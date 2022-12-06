<?php

namespace App\Console\Commands\Database;

use Symfony\Component\Console\Helper\Table;
use Illuminate\Console\Command;
use Illuminate\Http\File;
use Storage;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
//use App\Console\Commands\CommandTraits\ProcessesArtisanCommand;
//use App\Console\Commands\CommandTraits\ProgressesThroughModelItems;
use App\Console\MyCommand;
use Carbon\Carbon;
use function config;
use function storage_path;

class DbBackup extends DatabaseBackupsManager
{
//    use ProcessesArtisanCommand;
//    use ProgressesThroughModelItems;

    /**
     * The name and signature of the console command.
     * @var string
     */
    protected $signature = 'db:backup
        {--disk=local : Disk of where the backups are being stored}
        {--local : Use the local disk}
        {--dropbox : Use the dropbox disk}
        {--s3 : Use the s3 disk}

        {--list : Just show a list of the backups}
        {--latest : Get the latest backup}
        {--sort=backup : Way to sort by when getting a list}
        {--direction=up : Direction to sort (up or down)}

        {--restore : Restore a database backup}
    ';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Create a database backup';

    /**
     * The format that is used for storing database backup filenames.
     * @var string
     */
    private const FILENAME_DATE_FORMAT = "Y-m-d H-i-s e";

    /**
     * Maximum number of backups that may be stored for each environment.
     */
    private const MAX_BACKUPS_PER_ENVIRONMENT = 10;

    /**
     * Execute the console command.
     * @return int
     */
    public function handle(): int
    {
        try {
            $this->removeMemoryLimit();

            // First create a temporary backup that is stored locally.
            $this->runShellCommand(sprintf(
                'mysqldump -u%s -p%s %s | gzip > "%s"',
                config('database.connections.mysql.username'),
                config('database.connections.mysql.password'),
                config('database.connections.mysql.database'),
                storage_path('app/' . $this->getBackupPath(".") . '/' . $this->getBackupFilename("temp"))
            ), true);


            $backup_disk = $this->getBackupDisk();
            $backup_path = $this->getBackupPath(config('app.env'));
            $backup_filename = $this->getBackupFilename(date(self::FILENAME_DATE_FORMAT));

            // Copy the temp backup to be the main backup file now.
            Storage::disk("local")->copy(
                $this->getBackupPath(".") . '/' . $this->getBackupFilename("temp"),
                $backup_path . '/' . $backup_filename
            );

//            // Also store a "latest" version of it too.
//            Storage::disk("local")->copy(
//                $this->getBackupPath(".") . '/' . $this->getBackupFilename("temp"),
//                $backup_path . '/' . $this->getBackupFilename("latest")
//            );

            // Delete the temp file from the local disk:
            if( Storage::disk($backup_disk)->exists( $this->getBackupPath(".") . '/' . $this->getBackupFilename("temp") ) ) {
                Storage::disk($backup_disk)->delete( $this->getBackupPath(".") . '/' . $this->getBackupFilename("temp") );
            }

//            $this->runShellCommand('printf "\e[42m\e[97m' . " Database Backup - Completed Successfully! \n\tFilename: $backup_filename \n\tPath: $backup_path \n\tDisk: $backup_disk " . '\e[0m\n";', true);
            $this->runShellCommand('printf "\e[42m\e[97m' . " Database Backup - Completed Successfully! " . '\e[0m\n";', true);
            $this->runShellCommand('printf "\e[40m\e[97m' . " Backup: $backup_path/$backup_filename " . '\e[0m\n";', true);
            $this->runShellCommand('printf "\e[40m\e[97m' . " Disk: $backup_disk " . '\e[0m\n";', true);
//            $this->runShellCommand('printf "\e[40m\e[97m' . " Path: $backup_path " . '\e[0m\n";', true);
//            $this->runShellCommand('printf "\e[40m\e[97m' . " Disk: $backup_disk " . '\e[0m\n";', true);
            $this->newLine();
            return $this->exitSuccessfully();

//            return $this->exitSuccessfully("The database backup has completed successfully.\n  Filename:\t<info>" . $backup_filename . "</info>\n  Path:\t\t<info>" . $backup_path . "</info>\n  Disk:\t\t<info>" . $backup_disk . "</info>");
        }
        catch(ProcessFailedException $ex) {
            return $this->exitWithErrors(1, $ex->getMessage());
        }
    }

}
