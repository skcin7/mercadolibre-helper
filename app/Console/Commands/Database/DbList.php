<?php

namespace App\Console\Commands\Database;

use Symfony\Component\Console\Helper\Table;
use Illuminate\Console\Command;
use Illuminate\Http\File;
use Storage;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use App\Console\MyCommand;
use Carbon\Carbon;
use function config;
use function storage_path;

class DbList extends DatabaseBackupsManager
{
    /**
     * The name and signature of the console command.
     * @var string
     */
    protected $signature = 'db:list
        {--disk=local : Disk of where the backups are being stored}
        {--local : Use the local disk}
        {--dropbox : Use the dropbox disk}
        {--s3 : Use the s3 disk}

        {--sort=backup : Way to sort by when getting a list}
        {--direction=up : Direction to sort (up or down)}
        {--latest : Get the latest backup}
    ';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'List the database backups';

    /**
     * Maximum number of backups that may be stored for each environment.
     */
    private const MAX_BACKUPS_PER_ENVIRONMENT = 10;

    /**
     * List of environments where database backups may be stored.
     * @var array|string[]
     */
    private static array $enrivonments_list = [
        "development",
        "production",
        "testing",
    ];

    /**
     * Execute the console command.
     * @return int
     */
    public function handle(): int
    {
        try {
            $this->removeMemoryLimit();

//            $available_backup_files = Storage::disk($this->getBackupDisk())->allFiles( $this->getBackupPath( "." ) );
//            dd($available_backup_files);

            $available_backup_files = Storage::disk($this->getBackupDisk())->allFiles( "database_backups/." );
//            dd($available_backup_files);


            $database_list = [
                "sort_by" => (in_array($this->option('sort'), ["backup", "size", "modified"]) ? $this->option('sort') : "backup"),
                "sort_direction" => (in_array($this->option('direction'), ["up", "down"]) ? $this->option('direction') : "up"),
                "backups" => [],
            ];
            foreach($available_backup_files as $backup_file) {
                $database_list["backups"][] = [
                    "backup" => $backup_file,
//                    "file" => basename($backup_file),
//                    "path" => dirname($backup_file),
                    "size" => Storage::disk($this->getBackupDisk())->size($backup_file),
                    "modified" => Storage::disk($this->getBackupDisk())->lastModified($backup_file),
                    "is_latest" => false,
                ];
            }

            // Determine which one is the latest to turn the "is_latest" boolean to true on that one.
            $latest_index = null;
            foreach($database_list["backups"] as $this_backup_index => $backup) {
                if( is_null($latest_index) ) {
                    $latest_index = $this_backup_index;
                }
                else {
                    if( $backup["modified"] > $database_list["backups"][$latest_index]["modified"] ) {
                        $latest_index = $this_backup_index;
                    }
                }
            }
            $database_list["backups"][$latest_index]["is_latest"] = true;

            if($this->option('latest')) {
                return $this->exitSuccessfully($database_list["backups"][$latest_index]["backup"]);
            }

            array_multisort( array_column($database_list["backups"], $database_list["sort_by"]), $database_list["sort_direction"] == "up" ? SORT_ASC : SORT_DESC, $database_list["backups"] );

            // ⌃ ↑ ⌄ ↓
            $this->table([
                'Database Backup' . ( $database_list["sort_by"] == "backup" ? " " . ( $database_list["sort_direction"] == "up" ? '↑' : '↓' ) : '' ),
                'File Size (Bytes)' . ( $database_list["sort_by"] == "size" ? " " . ( $database_list["sort_direction"] == "up" ? '↑' : '↓' ) : '' ),
                'Backed Up At' . ( $database_list["sort_by"] == "modified" ? " " . ( $database_list["sort_direction"] == "up" ? '↑' : '↓' ) : '' ),
            ], array_map(function(array $this_backup) {
                $carbon_last_modified = Carbon::createFromTimestamp($this_backup["modified"]);

                return [
                    $this_backup["backup"],
                    $this_backup["size"],
//                    $this_backup["modified"] . "\n" . ucwords($carbon_last_modified->diffForHumans()),
                    ucwords($carbon_last_modified->diffForHumans()) . ($this_backup["is_latest"] ? " <info>**LATEST**</info>" : ""),
//                    ($this_backup["is_latest"] ? "<info>LATEST</info>" : ""),
                ];

            }, $database_list["backups"] ), 'box-double');
            return $this->exitSuccessfully();
        }
        catch(ProcessFailedException $ex) {
            return $this->exitWithErrors(1, $ex->getMessage());
        }
    }


}
