<?php

namespace App\Console;

use Illuminate\Console\Command;
use Symfony\Component\Console\Terminal;
use Symfony\Component\Process\Process;
use App\Console\Parser;


// @see https://symfony.com/doc/current/components/string.html
//use Symfony\Component\String\UnicodeString;
// the b() function creates byte strings
use function Symfony\Component\String\b;

// the u() function creates Unicode strings
use function Symfony\Component\String\u;

// the s() function creates a byte string or Unicode string depending on the given contents
use function Symfony\Component\String\s;


use Symfony\Component\Console\Formatter\OutputFormatterStyle;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputDefinition;
use Symfony\Component\Console\Output\OutputInterface;

use Symfony\Component\Console\Style\OutputStyle;

class MyCommand extends Command
{
    /**
     * The current terminal instance (symfony package).
     * @var Terminal
     */
    protected Terminal $terminal;

    protected static array $output_styles = [
        "normal" => [
            "foreground" => "white",
            "background" => "black",
            "options" => [],
        ],
        "bright" => [
            "foreground" => "bright-white",
            "background" => "black",
            "options" => [],
        ],
        "success" => [
            "foreground" => "black",
            "background" => "green",
            "options" => ["bold"],
        ],
        "danger" => [
            "foreground" => "black",
            "background" => "red",
            "options" => ["bold"],
        ],
        "warning" => [
            "foreground" => "black",
            "background" => "yellow",
            "options" => ["bold"],
        ],
        "info" => [
            "foreground" => "black",
            "background" => "blue",
            "options" => ["bold"],
        ],
        "branding" => [
            "foreground" => "#0066CC",
            "background" => "black",
            "options" => ["bold"],
        ],
    ];

//    /**
//     * Console output style.
//     * @var OutputStyle
//     */
//    protected OutputStyle $outputStyle;

    /**
     * Create a new MyCommand instance.
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->terminal = new Terminal();



//        $style = new OutputFormatterStyle('white', 'red', ['bold']);
//        $this->getOutput()->getFormatter()->setStyle('branding', $style);
//
//        if($this->consoleOutput) {
//            $style = new \Symfony\Component\Console\Formatter\OutputFormatterStyle('white', 'red', ['bold']); //white text on red background
//            $this->consoleOutput->getFormatter()->setStyle('error', $style);
//            $this->consoleOutput->writeln('<error>' . $text . '</error>');
//        }

//        $this->inputDefinition = new InputDefinition();

//        $this->getOutput();

//        $outputStyle = new OutputFormatterStyle('red', '#ff0', ['bold', 'blink']);
//        $output->getFormatter()->setStyle('fire', $outputStyle);

//        $output->write('<fire>foo</>');
    }



    /**
     * Remove the memory limit from an Artisan command, so that it can be processed without interruption in case it takes a long time.
     * @return void
     */
    protected function removeMemoryLimit()
    {
        ini_set('memory_limit', '-1');
    }

//    /**
//     * Exit an artisan command by returning the return exit code, and optionally printing a custom message.
//     * @param int $exit_code
//     * @param string|null $custom_message
//     * @return int
//     */
//    protected function exitArtisan(int $exit_code = 0, string|null $custom_message = null): int
//    {
//        if(is_string($custom_message) && strlen($custom_message) > 0) {
//            if($exit_code == 0) {
//                $this->line($custom_message);
//            }
//            else {
//                $this->error($custom_message);
//            }
//        }
//        return $exit_code;
//    }

    /**
     * Gracefully handle the exiting of an artisan command.
     * @param int $exit_code
     * @param string|null $custom_exit_message
     * @return int
     */
    protected function handleExit(int $exit_code = 0, string|null $custom_exit_message = null): int
    {
        if($exit_code != 0) {
            return $this->exitWithErrors($exit_code, $custom_exit_message);
        }
        return $this->exitSuccessfully($custom_exit_message);
    }

    /**
     * Exit an Artisan command successfully.
     * @param string|null $custom_success_message
     * @return int
     */
    protected function exitSuccessfully(string|null $custom_success_message = null): int
    {
        if(is_string($custom_success_message) && strlen($custom_success_message) > 0) {
            $this->info($custom_success_message);
        }
        return 0;
    }

    /**
     * List of error codes for Artisan Commands.
     * @var array|string[]
     */
    private static array $known_exit_codes = [
        0 => 'Command Completed Successfully',
        1 => 'Command Has Error(s)',
        10 => 'Artisan Error',
    ];

    /**
     * Exit an Artisan command with errors, based on the specified Error Code provided.
     * @param int $error_code
     * @param string|null $custom_error_message
     * @return int
     */
    protected function exitWithErrors(int $error_code = 1, string|null $custom_error_message = null): int
    {
        if(is_string($custom_error_message) && strlen($custom_error_message) > 0) {
            $this->error($custom_error_message);
        }
        return $error_code;
    }


//    /**
//     * Overriding the Laravel parser so we can have required arguments
//     * From https://stackoverflow.com/a/72134336/721361
//     *
//     * @inheritdoc
//     * @throws \ReflectionException
//     */
//    protected function configureUsingFluentDefinition(): void
//    {
//        // Using our parser here:
//        [$name, $arguments, $options] = Parser::parse($this->signature);
//
//        // Need to call the great-grandparent constructor here; probably
//        // could have hard-coded to Symfony, but better safe than sorry.
//        $reflectionMethod = new \ReflectionMethod(
//            get_parent_class(BaseCommand::class),
//            "__construct"
//        );
//        $reflectionMethod->invoke($this, $name);
//
//        $this->getDefinition()->addArguments($arguments);
//        $this->getDefinition()->addOptions($options);
//    }

    /**
     * Get the current terminal instance (symfony package).
     * @return Terminal
     */
    public function getTerminal(): Terminal
    {
        return $this->terminal;
    }

    /**
     * Run a shell command.
     * @param string $shell_command
     * @param bool $tty_mode_enabled
     * @return void
     */
    public function runShellCommand(string $shell_command, bool $tty_mode_enabled = true)
    {
        $process = Process::fromShellCommandline($shell_command);
        $process->setTty($tty_mode_enabled);
        $process->setTimeout(60 * 60 * 24);
        $process->mustRun(function($type, $buffer) {
            if(Process::ERR === $type) {
                $this->error($buffer);
            }
            else {
                $this->comment("<info>" . $buffer . "</info>");
            }
        });
    }

//    /**
//     * Print a header in the CLI tool.
//     * @param string $header_message
//     * @param string $align = 'left'
//     * @param string|int $width = 'auto'
//     * @param bool $center_the_message = false
//     * @param string $center_padding_character = " "
//     * @return void
//     */
//    protected function printHeader(string $header_message, string $align = "left", bool $center_the_message = false, string $center_padding_character = " ")
//    {
////        $unicode_string = new UnicodeString($header_message);
//
//        $header_string = s($header_message);
////        dd($header_string);
//
//        if($center_the_message) {
//            $this->runShellCommand('printf "\e[44m\e[97m' . str_pad($header_message, $this->getTerminal()->getWidth(), substr($center_padding_character, 0, 1), STR_PAD_BOTH) . '\e[0m";', true);
//        }
//        $this->runShellCommand('printf "\e[44m\e[97m' . $header_message . '\e[0m";', true);
//    }



    /**
     * Verbosity level to print messages to the console.
     * @var int
     */
    private int $verbosity_level = 0;

    /**
     * All verbosity levels and their meanings.
     * @var array|string[]
     */
    private array $verbosity_levels = [
        0 => 'QUIET',
        1 => 'VERBOSE',
        2 => 'VERY_VERBOSE',
        3 => 'DEBUG',
    ];

    /**
     * Warnings that can accumulate as the Artisan command processes are stored here.
     * @var array
     */
    private array $warnings = [];


}
