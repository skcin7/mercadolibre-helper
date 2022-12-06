<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class UsernamePolicyRule implements Rule
{
//    /**
//     * Regular expression that a username must match to be considered valid.
//     * The ONLY characters allowed are alphanumeric, '.', and '_', with '.' and '_' may NOT be consecutive.
//     * https://stackoverflow.com/a/30316930
//     *
//     * @var string
//     */
//    private $regex_old = "/^(?!.*[._]{2})[a-zA-Z0-9_.]+$/";

    /**
     * Regular expression that a username must match to be considered valid.
     * Usernames can only have letters, numbers, and a period.
     *
     * @var string
     */
    private string $regex = "/^[A-Za-z0-9.]+$/";

    /**
     * A list of allowed characters that may be used as separators within an alphanumeric username.
     *
     * @var string[]
     */
    private array $separatorCharacters = [
        '.',
        //'_',
    ];

    /**
     * The maximum number of separator characters that are allowed in a username.
     *
     * @var int
     */
    private int $separatorCharactersMax = 1;

    /**
     * The maximum length that a username can be.
     *
     * @var int
     */
    private int $maxLength = 55;

    /**
     * The minimum length that a username can be.
     *
     * @var int
     */
    private $minLength = 1;

    /**
     * Usernames may not be any of the disallowed usernames list. The reason for each disallowed username is usually due to some technical reason with how VGDB works.
     *
     * @var array
     */
    private array $bannedUsernamesList = [
        'new',
        'admin',
        'vgdb',
    ];

    /**
     * The message to be shown to the user upon failure of the validation.
     *
     * @var string
     */
    private string $failureMessage = "That is not a valid username.";

    /**
     * The list of specific validations to be checked to ensure a valid username.
     *
     * @var string[]
     */
    private array $validationsListToCheck = [
        'regex',
        'min',
        'max',
        'unique',
        'first_and_last_alphanumeric',
        'banned',
        'separator_max',
        'separator_consecutive',
    ];

    /**
     * Create a new validation instance.
     *
     * @param null $validationsListToCheck
     * @return void
     */
    public function __construct($validationsListToCheck = null)
    {
        // If a custom list of validation items is passed, update the validations list.
        if(! is_null($validationsListToCheck)) {
            $this->validationsListToCheck = $validationsListToCheck;
        }
    }

    /**
     * Set the message to be shown upon validation failure to a new/custom one.
     *
     * @param $failureMessage
     */
    private function setFailureMessage($failureMessage)
    {
        $this->failureMessage = $failureMessage;
    }

    /**
     * Get the message to be shown upon validation failure.
     *
     * @return string
     */
    private function getFailureMessage(): string
    {
        return $this->failureMessage;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param type $attribute
     * @param type $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        // Ensure that the username passes the regular expression check
        if(in_array('regex', $this->validationsListToCheck)) {
            if(! preg_match($this->regex, $value)) {
                $this->setFailureMessage("The username did not pass the validation. A username may only contain alphanumeric characters, and at most a single period.");
                return false;
            }
        }

        // Ensure it's not shorter than the minimum
        if(in_array('min', $this->validationsListToCheck)) {
            if(strlen($value) < $this->minLength) {
                $this->setFailureMessage("The username must be at least " . $this->minLength . " characters.");
                return false;
            }
        }

        // Ensure it's not longer than the maximum
        if(in_array('max', $this->validationsListToCheck)) {
            if(strlen($value) > $this->maxLength) {
                $this->setFailureMessage("The username must be at most " . $this->maxLength . " characters.");
                return false;
            }
        }

        // Ensure that a username is unique and not already in use by a user
        if(in_array('unique', $this->validationsListToCheck)) {
            // TODO
            // For now, rely on the native laravel 'unique' validation rule to ensure username uniqueness.
        }

        // Ensure first and last characters are each alpha-numeric
        if(in_array('first_and_last_alphanumeric', $this->validationsListToCheck)) {
            $first_character = substr($value, 0, 1);
            $last_character = substr($value, strlen($value) - 1, 1);
            if(! (ctype_alnum($first_character) && ctype_alnum($last_character))) {
                $this->setFailureMessage("The first and last characters of a username must each be alphanumeric.");
                return false;
            }
        }

        // Ensure it's not on the list of banned usernames
        if(in_array('banned', $this->validationsListToCheck)) {
            if(in_array($value, $this->bannedUsernamesList)) {
                $this->setFailureMessage("The username is on the banned usernames list.");
                return false;
            }
        }

        // Ensure the number of separator characters used is not greater than the max.
        if(in_array('separator_max', $this->validationsListToCheck)) {
            $separator_characters_amount = substr_count($value, implode("", $this->separatorCharacters));
            if($separator_characters_amount > $this->separatorCharactersMax) {
                $this->setFailureMessage("A username may contain at most " . ($this->separatorCharactersMax === 1 ? 'a single' : $this->separatorCharactersMax) . " separator " . ($this->separatorCharactersMax === 1 ? 'character' : 'characters') . " (" . implode(", ", $this->separatorCharacters) . ").");
                return false;
            }
        }

        // Ensure that there is not more than a single consecutive allowed separator character.
        if(in_array('separator_consecutive', $this->validationsListToCheck)) {
            // There can only POSSIBLY be consecutive and needs to be checked if there is more than a single separator character.
            if($this->separatorCharactersMax > 1) {

                // Get a list of all characters that are consecutive in the username.
                // This full array will then be checked to see if any are separator characters.
                $all_consecutive_characters = [];
                $length = strlen($value);
                for($i = 0; $i < $length - 2; $i++) {
                    $current_character = substr($value, $i, 1);
                    $next_character = ($i + 1 === $length ? null : substr($value, $i + 1, 1)); // sets to null the current character is the last one in the string (so therefore there is not a next character)

                    if($current_character === $next_character) {
                        // Only add it if it hasn't already been added.
                        if(! in_array($current_character, $all_consecutive_characters)) {
                            $all_consecutive_characters[] = $current_character;
                        }
                    }
                }

                // Now loop through all the separator characters and if one is found in the consecutive list, then the validation fails
                foreach($this->separatorCharacters as $separatorCharacter) {
                    if(in_array($separatorCharacter, $all_consecutive_characters)) {
                        $this->setFailureMessage("A username may not contain more than a single separator character (" . implode(", ", $this->separatorCharacters) . ").");
                        return false;
                    }
                }

                // Old Way:
//                if(strpos($value, "..") !== false) {
//                    $this->setFailureMessage("A username may contain at most a single consecutive separator character (" . implode(", ", $this->separatorCharacters) . ").");
//                    return false;
//                }
            }
        }

        // All validation checks up until this point have passed, so therefore the username is valid!
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return $this->getFailureMessage();
    }
}
