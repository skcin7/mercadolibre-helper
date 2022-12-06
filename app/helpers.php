<?php

use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Helper functions
|--------------------------------------------------------------------------
|
| Useful functions which may be used throughout the app
|
*/

if (! function_exists('mastermind')) {
    /**
     * Determine if the user is a mastermind.
     * @return bool
     */
    function mastermind(): bool
    {
        return auth()->user() && auth()->user()->isMastermind();
    }
}

if (! function_exists('admin')) {
    /**
     * Determine if the user is an admin.
     * @return bool
     */
    function admin(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }
}

if(! function_exists('slugify')) {
    /**
     * Generate a slug of a string.
     * @param string $string
     * @param string $seperator_character
     * @param int|null $maxlength
     * @return string
     */
    function slugify(string $string, string $seperator_character = '-', int|null $maxlength = null): string
    {
        $clean = iconv('UTF-8', 'ASCII//IGNORE', $string);
        $clean = preg_replace("/[^a-zA-Z0-9\/_| -]/", '', $clean);
        $clean = strtolower(trim($clean, $seperator_character));
        $clean = preg_replace("/[\/_| -]+/", $seperator_character, $clean);
        if(is_int($maxlength) && $maxlength > 0) {
            $clean = substr($clean, 0, $maxlength);
        }
        return trim($clean, $seperator_character);
    }
}

if(! function_exists('slug_parts')) {
    /**
     * slug_parts - get a single part (segment) of a slug
     * @param string $slug
     * @param int $part
     * @param string $delimiter
     * @return string
     */
    function slug_parts(string $slug, int $part = 0, string $delimiter = '-'): string
    {
        return explode($delimiter, $slug)[$part];
    }
}

if( !function_exists('get_ip_address') ) {
    /**
     * Gets the IP address of the user accessing the service.
     * @return string
     */
    function get_ip_address(): string
    {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if(isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }
}

if( !function_exists('http_status_text') ) {
    /**
     * Gets the status text that is associated with the HTTP status code.
     * @see \Symfony\Component\HttpFoundation\Response::class
     * @param int $http_status_code
     * @return string
     */
    function http_status_text(int $http_status_code): string
    {
        if( !isset(\Symfony\Component\HttpFoundation\Response::$statusTexts[$http_status_code]) ) {
            return 'Unknown/Other (HTTP ' . $http_status_code . ')';
        }
        return \Symfony\Component\HttpFoundation\Response::$statusTexts[$http_status_code];
    }
}

if( !function_exists('array_keys_allowlist') ) {
    /**
     * Filter an array by allowed keys only.
     * https://stackoverflow.com/a/73738076/721361
     * @param array $array
     * @param array $allowlist
     * @return array
     */
    function array_keys_allowlist(array $array, array $allowlist): array
    {
        return array_intersect_key($array, array_flip($allowlist));
    }
}

if( !function_exists('array_keys_denylist') ) {
    /**
     * Filter an array by allowed keys only.
     * https://stackoverflow.com/a/73738076/721361
     * @param array $array
     * @param array $denylist
     * @return array
     */
    function array_keys_denylist(array $array, array $denylist): array
    {
        return array_diff_key($array, array_flip($denylist));
    }
}
