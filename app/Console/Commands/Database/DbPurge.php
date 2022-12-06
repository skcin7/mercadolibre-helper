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

class DbPurge extends DatabaseBackupsManager
{
    /**
     * The name and signature of the console command.
     * @var string
     */
    protected $signature = 'db:purge
        {--disk=local : Disk of where the backups are being stored}
        {--local : Use the local disk}
        {--dropbox : Use the dropbox disk}
        {--s3 : Use the s3 disk}

        {keep_amount=10 : Maximum number of most recent backups to be stored in each environment}
    ';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Purge old database backups';

//    /**
//     * Maximum number of backups that may be stored for each environment.
//     */
//    private const MAX_BACKUPS_PER_ENVIRONMENT = 10;

    private const BACKUPS_ENVIRONMENTS = [
        'development',
        'production',
        'testing',
    ];

    /**
     * Execute the console command.
     * @return int
     */
    public function handle(): int
    {
        try {
            $this->removeMemoryLimit();

            $backup_disk = $this->getBackupDisk();

            $keep_amount = (int)$this->argument('keep_amount');

            $total_backups = [];
            $to_be_purged_count = 0;

            foreach(self::BACKUPS_ENVIRONMENTS as $backups_environment) {
                $backup_files_in_this_environment = Storage::disk($backup_disk)->allFiles( $this->getBackupPath( $backups_environment ) );

//                dd($backup_files_in_this_environment);

                $backups = [];
                $order = count($backup_files_in_this_environment);
                foreach($backup_files_in_this_environment as $backup_file) {
                    $backups[] = [
                        "backup" => $backup_file,
                        "size" => Storage::disk($this->getBackupDisk())->size( $backup_file ),
                        "modified" => Storage::disk($this->getBackupDisk())->lastModified( $backup_file ),
                        "order" => ((string)$order--),
                        "will_be_deleted" => false,
                    ];
                }

                array_multisort( array_column($backups, "modified"), SORT_ASC, $backups);


//                dd($backups);
//                dd($keep_amount);
//                $order = count($backups);
                for($i = 0; $i < count($backups); $i++) {
//                    $backups[$i]['order'] = ((string)$i);

                    if($backups[$i]['order'] > $keep_amount) {
                        $backups[$i]['will_be_deleted'] = true;
                        $to_be_purged_count++;
                    }
                }

//                dd($backups);
//                $total_backups[] = $backups;

                $total_backups = array_merge(array_values($total_backups), array_values($backups));
            }

//            dd($total_backups);




            $successfully_purged_count = 0;
            if($to_be_purged_count > 0) {

                $this->table([
                    'Backup',
                    'Size',
                    'Last Modified',
                    'Order',
                ], array_map(function(array $this_backup) use ($keep_amount, $to_be_purged_count) {
                    $carbon_last_modified = Carbon::createFromTimestamp($this_backup["modified"]);

                    return [
                        $this_backup["backup"],
                        $this_backup["size"],
                        ucwords($carbon_last_modified->diffForHumans()),
                        $this_backup["order"],
                        ($this_backup["will_be_deleted"] ? "<error>WILL BE PURGED</error>" : null)
                    ];

                }, $total_backups ), 'box-double');



                if($this->confirm("<comment>" . $to_be_purged_count . " Total Backups Will Be Purged/Deleted (Keeping the most recent " . $keep_amount . ", per environment)</comment>\nReally Purge These " . $to_be_purged_count . " Backups?", true)) {
                    foreach($total_backups as $current_backup) {
                        if(!$current_backup['will_be_deleted']) {
                            continue;
                        }

                        if( $current_backup['will_be_deleted'] && Storage::disk( $backup_disk )->exists($current_backup['backup']) ) {
                            Storage::disk( $backup_disk )->delete($current_backup['backup']);

                            $successfully_purged_count++;
                        }
                    }
                }
                else {
                    return $this->exitWithErrors(1, "The Purge Was Canceled");
                }
            }
            else {
                return $this->exitSuccessfully("<error>Nothing To Purge</error>");
            }

            return $this->exitSuccessfully("The database purge has completed successfully.\n  Purged:\t\t<info>" . $successfully_purged_count . "</info>");
        }
        catch(ProcessFailedException $ex) {
            return $this->exitWithErrors(1, $ex->getMessage());
        }
    }

}
