<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class PasswordPolicyRule implements Rule
{
    /**
     * A list of special characters that are allowed to be part of a password.
     * https://owasp.org/www-community/password-special-characters
     *
     * @var array
     */
    private $allowedSpecialCharacters = [
        '!',
        '"',
        '#',
        '$',
        '%',
        '&',
        '\'',
        '(',
        ')',
        '*',
        '+',
        ',',
        '-',
        '.',
        '/',
        ':',
        ';',
        '<',
        '=',
        '>',
        '?',
        '@',
        '[',
        '\\',
        ']',
        '^',
        '_',
        '`',
        '{',
        '|',
        '}',
        '~',
    ];
//    private $allowedSpecialCharacters = "!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~";

    /**
     * The list of specific validations to be checked to ensure a valid username.
     *
     * @var string[]
     */
    private $toCheck = [
        'regex' => 1,
        'contains_letter' => false,
        'contains_uppercase_letter' => false,
        'contains_number' => false,
        'contains_special_character' => false,
        'min' => 8,
        'max' => 256,
    ];

    /**
     * The message to be shown to the user upon failure of the validation.
     *
     * @var string
     */
    private $failureMessage = "The password is not valid.";

    /**
     * Create a new validation instance.
     *
     * @param array $toCheck
     * @return void
     */
    public function __construct($toCheck = [])
    {
        // If a to check array was passed, update the list of validations to be checked.
        // e.g. ['regex' => false, 'contains_special_character' => true] may be passed in as an array
        foreach($toCheck as $key => $value) {
            $this->toCheck[$key] = $value;
        }

//        $this->toCheck[$key] => $value;

//        // If a custom list of validation items is passed, update the validations list.
//        if(! is_null($toCheck)) {
//            $this->toCheck = $toCheck;
//        }
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
    private function getFailureMessage()
    {
        return $this->failureMessage;
    }

    /**
     * Retrieve the regular expression used to determine a secure password.
     * FROM https://stackoverflow.com/a/31549892
     * A secure password must pass the specified number of the following 5 categories:
     *  - English uppercase characters (A – Z)
     *  - English lowercase characters (a – z)
     *  - Base 10 digits (0 – 9)
     *  - Non-alphanumeric (For example: !, $, #, or %)
     *  - Unicode characters
     *
     * @param int $numCategoriesMustPass
     * @return string
     */
    private function regex($numCategoriesMustPass = 3)
    {
        // https://www.nicesnippets.com/blog/laravel-password-validation-example
        // Must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
        $regex = "/^";
        $regex .= "(?=.*?[A-Za-z])"; // must have 1 uppercase or lowercase letter
//        $regex .= "(?=.*?[A-Z])"; // must have 1 uppercase letter
//        $regex .= "(?=.*?[a-z])"; // must have 1 lowercase letter
//        $regex .= "(?=.*?[0-9])"; // must have 1 digit
//        $regex .= "(?=.*?[#?!@$%^&*-])"; // must have 1 special character
        $regex .= ".{1,}$/";
        return $regex;


//        return "/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{1,}$/";

//        return "/^.*(?=.{" . $numCategoriesMustPass . ",})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%]).*$/";
    }

    /**
     * Determine if the validation rule passes.
     * @param type $attribute
     * @param type $value
     * @return type
     */
    public function passes($attribute, $value)
    {
        // Ensure the regular expression check passes
        if($this->toCheck['regex']) {
            if(! preg_match($this->regex($this->toCheck['regex']), $value)) {
//                $this->setFailureMessage("The password must contain at least " . $this->toCheck['regex'] . " of the following 5 categories: 1) a lowercase letter, 2) an uppercase letter, 3) a number, 4) a special character, 5) a unicode character.");
                $this->setFailureMessage("The password must contain at least 1 uppercase or lowercase letter, and 1 digit.");
                return false;
            }
        }

        // Require the password has a letter.
        if($this->toCheck['contains_letter']) {
            if(! preg_match('/[a-zA-Z]/', $value)){
                $this->setFailureMessage("The password must contain a letter.");
                return false;
            }
        }

        // Require the password has an uppercase letter.
        if($this->toCheck['contains_uppercase_letter']) {
            if(! preg_match('/[A-Z]/', $value)){
                $this->setFailureMessage("The password must contain an uppercase letter.");
                return false;
            }
        }

        // Require the password has a number.
        if($this->toCheck['contains_number']) {
            if(! preg_match('/[0-9]/', $value)){
                $this->setFailureMessage("The password must contain a number.");
                return false;
            }
        }

        // Require the password has a special character.
        if($this->toCheck['contains_special_character']) {
            if(! preg_match('/[0-9]/', $value)){
                $this->setFailureMessage("The password must contain at least one of the special characters: " . implode_with_pronouns($this->allowedSpecialCharacters, " ", " and "));
                return false;
            }
        }

        // Require the password not be shorter than the min length
        if($this->toCheck['min']) {
            if($this->toCheck['min'] > strlen($value)) {
                $this->setFailureMessage("The minimum length that a password can be is " . $this->toCheck['min'] . ".");
                return false;
            }
        }

        // Require the password not be longer than the max length
        if($this->toCheck['max']) {
            if(strlen($value) > $this->toCheck['max']) {
                $this->setFailureMessage("The maximum length that a password can be is " . $this->toCheck['max'] . ".");
                return false;
            }
        }

        // If all the checks up until here have passed, then the password must be valid!
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->getFailureMessage();
    }
}
