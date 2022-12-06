<?php

namespace App\Console\Commands\Database;

use Illuminate\Console\Command;
use Storage;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use App\Console\MyCommand;
use function config;
use function storage_path;

class DbRestore extends DatabaseBackupsManager
{
    /**
     * The name and signature of the console command.
     * @var string
     */
    protected $signature = 'db:restore
        {--disk=local : Disk of where the backup will be restored from}
        {--local : Restore from the local disk}
        {--dropbox : Restore from the dropbox disk}
        {--s3 : Restore from the s3 disk}
    ';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Restore the database';

    /**
     * Execute the console command.
     * @return int
     */
    public function handle(): int
    {
        try {
            $this->removeMemoryLimit();

//            $process = Process::fromShellCommandline(sprintf(
//                'gunzip < %s | mysql -u%s -p%s %s',
//                storage_path('app/database/backups/' . basename($backup_file_relative_path)),
//                config('database.connections.mysql.username'),
//                config('database.connections.mysql.password'),
//                config('database.connections.mysql.database')
//            ));

            $backup_disk = $this->getBackupDisk();

            $available_backup_files = Storage::disk($backup_disk)->allFiles( $this->getBackupPath( "." ) );

            $this->call("db:list", [
                '--disk' => 'local',
                '--sort' => 'modified',
                '--direction' => 'up',
            ]);

            $backup_to_restore = $this->anticipate(
                'What Backup To Restore?',
                $available_backup_files,
                null
            );

//            dd($backup_to_restore);

            $this->runShellCommand(sprintf(
                'gunzip < "%s" | mysql -u%s -p%s %s',
                storage_path('app/' . $backup_to_restore),
                config('database.connections.mysql.username'),
                config('database.connections.mysql.password'),
                config('database.connections.mysql.database')
            ), true);

            return $this->exitSuccessfully("The database restoration has completed successfully.\n  Backup:\t<info>" . $backup_to_restore . "</info>\n  Disk:\t\t<info>" . $backup_disk . "</info>");
        }
        catch(Exception $ex) {
            return $this->exitWithErrors(1, $ex->getMessage());
        }
    }


}
