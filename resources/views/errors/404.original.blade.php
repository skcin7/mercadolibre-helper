@extends('errors::minimal')

@section('title', __('Not Found'))
@section('code', '404')
@section('message', strlen($exception->getMessage()) ? $exception->getMessage() : __('Not Found'))
