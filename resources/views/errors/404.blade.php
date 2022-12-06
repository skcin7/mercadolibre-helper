{{--@extends('errors::minimal')--}}

{{--@section('title', __('Not Found'))--}}
{{--@section('code', '404')--}}
{{--@section('message', strlen($exception->getMessage()) ? $exception->getMessage() : __('Not Found'))--}}


@extends('errors.error_default_layout', [
    'error_code' => '404',
    'error_message_title' => __(isset($exception) && is_string($exception->getMessage()) && strlen($exception->getMessage()) > 0 ? $exception->getMessage() : 'Not Found'),
])
