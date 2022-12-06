@extends('layouts.layout', [
    '_page' => [
        'title' => 'Http Error',
        'show_header' => false,
        'show_footer' => false,
    ],
])

@section('pageName', 'HttpError')

{{-- Page Title overrides any other page title. --}}
@section('pageTitle', http_status_text($error_code))

@push('pageStyles')
    <!-- Error Styles: -->
    <style>
        #error_container {
            align-items: center;
            display: flex;
            height: 100vh;
            justify-content: center;
            position: relative;
            width: 100% !important;
        }
        #error_code {
            border-right: 2px solid #000;
            font-size: 26px;
            padding: 0 1rem;
            text-align: center;
        }
        #error_message {
            font-size: 18px;
            padding: 1rem;
            text-align: left;
        }
    </style>
@endpush

@section('pageContent')
    <div id="error_container">
        <div id="error_code">{{ $error_code }}</div>
        <div id="error_message">
            <div class="smbbox smbbox_danger lh-sm p-0 mb-2">
                <span class="bigger">{{ (isset($error_message_title) ? $error_message_title : http_status_text($error_code)) }}</span>
                {!! isset($custom_error_message) && is_string($custom_error_message) && strlen($custom_error_message) > 0 && (http_status_text($error_code) != $custom_error_message) ? '<br/>' . $custom_error_message : '' !!}
            </div>
{{--            <a class="hover_up small" href="javascript:void(0)" onclick="history.back()">← Go Back</a> |--}}
            @if( (isset($link_back_home) && is_bool($link_back_home) && $link_back_home) || !isset($link_back_home) )
                <a class="btn btn-secondary" href="{{ route('web.welcome') }}"><i class="icon-home"></i>Home</a>
            @endif
        </div>
    </div>
@endsection
