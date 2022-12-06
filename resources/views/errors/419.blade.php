@extends('errors.error_default_layout', [
    'error_code' => '419',
    'custom_error_message' => __(isset($exception) && is_string($exception->getMessage()) && strlen($exception->getMessage()) > 0 ?: 'Page Expired'),
    'link_back_home' => true,
])
