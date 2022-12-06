<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Console\MyCommand;

class TriggerDeployment extends MyCommand
{
//    use ProcessesArtisanCommand;
//    use ProgressesThroughModelItems;

    /**
     * The name and signature of the console command.
     * @var string
     */
    protected $signature = 'application:trigger-deployment
            {--verbosity=VERBOSE : Verbosity level string.}
        ';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Trigger the application deployment';

//    /**
//     * The URL used to trigger the deployment of the application.
//     * @var string
//     */
//    private string $deployment_trigger_url = "https://forge.laravel.com/servers/587393/sites/1733518/deploy/http?token=yZO3KfAKgj6Xcp9GAUpCULKR7mfJ5MB6BZbaePob";

    /**
     * The URLs used to trigger the deployment of the application.
     *
     * @var string[]
     */
    private array $trigger_urls = [
        "https://forge.laravel.com/servers/393137/sites/1828087/deploy/http?token=vBnETh3qgLZiXT9QkMGt5nBjIgXpNkZHAwiEPmMx",
    ];

    /**
     * Execute the console command.
     * @return int
     */
    public function handle(): int
    {
        if($this->option('verbosity')) {
            $this->setVerbosity($this->option('verbosity'));
        }

        // Remove the memory limit so that the command script continues until it finishes.
        $this->removeMemoryLimit();

        foreach($this->trigger_urls as $trigger_url) {
            $this->runShellCommand('curl -X POST ' . $trigger_url);
        }

        return $this->exitSuccessfully();

    }
}
