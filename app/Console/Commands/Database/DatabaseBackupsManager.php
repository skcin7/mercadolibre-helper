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

class DatabaseBackupsManager extends MyCommand
{
    /**
     * The name and signature of the console command.
     * @var string
     */
    protected $signature = 'db:manage
        {action? : Action to perform}
        {--backup : Create a database backup}
        {--restore : Restore a database backup}
        {--list : List the database backups that are currently stored}
        {--purge : Purge old backups}
        {--settings : Edit settings}
        {--exit : Exit the database backups manager}

        {--disk=local : Disk of where the backups are being stored}
        {--local : Use the local filesystem disk}
        {--dropbox : Use the dropbox filesystem disk}
        {--s3 : Use the s3 filesystem disk}
        {--verbosity=VERBOSE : Verbosity level string.}
    ';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Database backups manager';

    /**
     * List of available actions that the database manager may process.
     * @var array|string[][]
     */
    private static array $available_actions = [
        'backup' => [
            'description' => 'Create a new database backup',
            'class' => DbBackup::class,
        ],
        'list' => [
            'description' => 'List the database backups',
            'class' => DbList::class,
        ],
        'purge' => [
            'description' => 'Purge old database backups',
            'class' => DbPurge::class,
        ],
        'restore' => [
            'description' => 'Restore from an existing database backup',
            'class' => DbRestore::class,
        ],
//        'settings' => [
//            'description' => 'Edit database backups manager settings',
//            'class' => DbSettings::class,
//        ],
//        'exit' => [
//            'description' => 'Exit the backups manager',
//            'class' => null,
//        ],
    ];

    /**
     * Execute the console command.
     * @return int
     */
    public function handle(): int
    {
        $this->removeMemoryLimit();

//        try {

            while(true) {

                $this->runShellCommand('printf "\e[44m\e[97m' . str_pad("Database Backups Manager", $this->getTerminal()->getWidth(), " ", STR_PAD_BOTH) . '\e[0m\n";', true);

                $this->newLine();

                $table = new Table($this->getOutput());
                $table
                    ->setHeaderTitle('Database Backups Manager - Available Actions')
                    ->setFooterTitle('Q/q = Quit')
                    ->setHeaders(['Action', 'Description'])
                    ->setRows(array_map(function(string $action, array $this_action) {
                        return [
                            $action,
                            $this_action['description'],
                        ];
                    }, array_keys(self::$available_actions), array_values(self::$available_actions)))
                    ->setStyle('box-double')
                ;
                $table->render();


//                dd(array_keys(self::$available_actions));
                $action_to_perform = $this->anticipate('What action to perform?', array_merge(
                    array_keys(self::$available_actions),
                    ["q", "Q"]
                ));

                if(strtolower($action_to_perform) == "q") {
                    $this->runShellCommand('printf "\e[44m\e[97m Quitting... \e[0m\n";');
                    return $this->exitSuccessfully();
                }


//                $available_actions_index = null;
//                for($i = 0; $i < count(self::$available_actions); $i++) {
//                    if(self::$available_actions[$i]['name'] == $action_to_perform) {
//                        $available_actions_index = $i;
//                    }
//                }

                if(!isset(self::$available_actions[$action_to_perform])) {
                    $this->runShellCommand('printf "\e[41m\e[97mInvalid Command\e[0m\n";');
                    continue;
                }

                try {
                    $exit_code = $this->call(self::$available_actions[$action_to_perform]['class'], [
                        //
                    ]);
                }
                catch(ProcessFailedException $ex) {
                    $this->runShellCommand('printf "\e[41m\e[97m' . $ex->getMessage() . '\e[0m\n";');
                }

//                if($action_to_perform == 'backup') {
//                    return $this->call("db:backup", [
//                        '--disk' => 'local',
//                    ]);
//                }
//                else if($action_to_perform == 'restore') {
//
//                    return $this->call("db:restore", [
//                        '--disk' => 'local',
//                    ]);
//                }
//                else if($action_to_perform == 'list') {
//                    return $this->call("db:list", [
//                        '--disk' => 'local',
//                    ]);
//                }
//                else if($action_to_perform == 'purge') {
//                    return $this->call("db:purge", [
//                        '--disk' => 'local',
//                    ]);
//                }

            }

//            $this->determineActionToPerform();

//        }
//        catch(ProcessFailedException $ex) {
//            $this->runShellCommand('printf "\e[41m\e[97m' . $ex->getMessage() . '\e[0m\n";');
//
//            return $this->exitWithErrors(1, $ex->getMessage());
//        }
    }

//    private string|null $action_to_perform = null;


//    /**
//     * Determine the action to perform.
//     * @return void
//     */
//    private function determineActionToPerform()
//    {
//        $this->action_to_perform = $this->hasArgument('action') && isset(self::$available_actions[$this->argument('action')]) ? (string)$this->argument('action') : null;
//
//        if(is_null($this->action_to_perform)) {
//            foreach(self::$available_actions as $available_action => $action_properties) {
//                if($this->option($available_action)) {
//                    $this->action_to_perform = $available_action;
//                    break;
//                }
//            }
//        }
//
//        if(is_null($this->action_to_perform)) {
//
//////            dd(self::$available_actions);
////            dd( array_values(array_map(function(array $this_action) {
////                return $this_action['description'];
////            }, self::$available_actions)) );
//////            dd(array_keys(self::$available_actions));
////            dd(array_combine( array_keys(self::$available_actions), array_values(self::$available_actions) ));
//
////            $this->info('Choose the database action to perform:');
//
//
//            $table = new Table($this->getOutput());
//            $table
//                ->setHeaderTitle('Database Backups - Actions')
//                ->setHeaders(['Action', 'Description'])
//                ->setRows(array_map(function(string $action, array $this_action) {
//                    return [
//                        $action,
//                        $this_action['description'],
//                    ];
//                }, array_keys(self::$available_actions), array_values(self::$available_actions)))
//                ->setStyle('box-double')
//            ;
//            $table->render();
//
//
//
////            $this->table([
////                'Database Action',
////                'Description',
////            ], array_map(function(string $action, array $this_action) {
////                return [
////                    $action,
////                    $this_action['description'],
////                ];
////            }, array_keys(self::$available_actions), array_values(self::$available_actions)), 'box-double');
//
//            $this->action_to_perform = $this->anticipate('What the database manager action to perform?', array_keys(self::$available_actions));
//
//
//        }
//
//
//    }


    /**
     * List of all the backup disks that are supported to have database backups stored to.
     * @var array|string[]
     */
    private const SUPPORTED_BACKUP_DISKS = [
        'local',
        'dropbox',
        's3',
    ];

    /**
     * @return string
     */
    protected function getBackupDisk(): string
    {
        $disk = (string)$this->option('disk');

        if($this->option('local')) {
            $disk = 'local';
        }
        else if($this->option('dropbox')) {
            $disk = 'dropbox';
        }
        else if($this->option('s3')) {
            $disk = 's3';
        }

        if( !in_array($disk, self::SUPPORTED_BACKUP_DISKS) ) {
            $disk = 'local'; // Default
        }

        return $disk;
    }

    /**
     * Get the backup filename.
     * @param string $filename
     * @param string $extension
     * @return string
     */
    protected function getBackupFilename(string $filename, string $extension = "sql.gz"): string
    {
        return $filename . '.' . $extension;
    }

    /**
     * Get the storage path of where the backups are to be stored.
     * @param string $local_backups_path
     * @return string
     */
    protected function getBackupPath(string $local_backups_path = "."): string
    {
        $storage_path = "database_backups/" . $local_backups_path;

        // In case any of the storage directories aren't created yet, create them real fast.
        $this->runShellCommand("mkdir -p " . storage_path('app/' . $storage_path), true);

        return $storage_path;
    }


}
