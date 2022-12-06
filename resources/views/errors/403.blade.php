@extends('errors.error_default_layout', [
    'error_code' => '403',
    'custom_error_message' => __(isset($exception) && is_string($exception->getMessage()) && strlen($exception->getMessage()) > 0 ?: 'Forbidden'),
    'link_back_home' => true,
])
