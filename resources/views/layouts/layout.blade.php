<!doctype html>
<html lang="en" data-environment="{{ config('app.env', 'production') }}" {!! config('app.debug', false) ? 'data-debug="debug"' : '' !!}>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSRF Token: -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Page Title: -->
        <title>{{ config('app.env', 'production') == "development" ? '[DEV] ' : '' }}@yield('pageTitle')</title>

        <!-- Fonts: -->
        <link rel="dns-prefetch" href="//fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">

        <!-- Styles: -->
        <link href="{{ mix('css/app.css') }}" rel="stylesheet">
        @stack('pageStyles')

        <!-- Favicon: -->
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('favicon/apple-touch-icon.png') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon/favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon/favicon-16x16.png') }}">
        <link rel="manifest" href="{{ asset('favicon/site.webmanifest') }}">
        <link rel="mask-icon" href="{{ asset('favicon/safari-pinned-tab.svg') }}" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
    </head>
    <body>
        <div id="app" data-current-page="@yield('pageName')">
            @if( !(isset($_page['show_header']) && !$_page['show_header']) )
                <header id="header">
                    <nav class="navbar navbar-expand-lg navbar-light" id="header_navbar">
                        <div class="container-fluid p-1 align-items-stretch">
                            <a class="navbar-brand" id="header_navbar__branding" href="{{ route('web.welcome') }}">
                                <img src="{{ asset('images/MLLogo_500x350.png') }}" width="60"/>
                                <div>
                                    <span class="header_navbar__branding_title">MercadoLibre</span>
                                    <span class="header_navbar__branding_subtitle">Helper Tools</span>
                                </div>
                            </a>
                            <button class="navbar-toggler collapsed" id="header_navbar__toggler" type="button" data-bs-toggle="collapse" data-bs-target="#header_navbar_content" aria-controls="header_navbar_content" aria-expanded="false" aria-label="{{ __('Toggle Navigation') }}">
                                <span class="navbar-toggler-icon"></span>
                            </button>

                            <div class="collapse navbar-collapse" id="header_navbar_content">

                                {{-- Left Navigation Links: --}}
                                <ul class="navbar-nav header_navbar__items">
{{--                                    <li class="nav-item">--}}
{{--                                        <a class="nav-link" href="{{ route('web.welcome') }}" role="button">--}}
{{--                                            Home--}}
{{--                                        </a>--}}
{{--                                    </li>--}}
                                    <li class="nav-item header_navbar__item">
                                        <a class="nav-link header_navbar__link flex-column p-1" href="{{ route('web.search') }}" role="button">
                                            <i class="icon-magic-wand"></i>
                                            <span class="smaller">New Search</span>
                                        </a>
                                    </li>

{{--                                    <li class="nav-item header_navbar__item">--}}
{{--                                        <a class="nav-link header_navbar__link" href="{{ route('web.search') }}" role="button">--}}
{{--                                            New Search--}}
{{--                                        </a>--}}
{{--                                    </li>--}}
{{--                                    <li class="nav-item header_navbar__item">--}}
{{--                                        <a class="nav-link header_navbar__link" href="{{ route('web.saved_searches') }}" role="button">--}}
{{--                                            My Searches ({{ App\Models\SavedSearch::count() }})--}}
{{--                                        </a>--}}
{{--                                    </li>--}}
                                </ul>


                                {{-- Right Navigation Links: --}}
                                <ul class="navbar-nav ms-auto header_navbar__items">
                                    <li class="nav-item header_navbar__item">
                                        <a class="nav-link header_navbar__link flex-column p-1" href="{{ route('web.account') }}" role="button">
                                            <i class="icon-skull"></i>
                                            <span class="smaller">My Account</span>
                                        </a>
                                    </li>
                                </ul>

{{--                                <ul class="navbar-nav ms-auto">--}}
{{--                                    <li class="nav-item">--}}
{{--                                        <a class="nav-link" href="{{ route('web.auth.login') }}" role="button">--}}
{{--                                            Login--}}
{{--                                        </a>--}}
{{--                                    </li>--}}
{{--                                </ul>--}}

                            </div>
                        </div>
                    </nav>

                    @include('_flash')
                </header>
            @endif

            <section id="page_content">
                @hasSection('pageContent')
                    @yield('pageContent')
                @else
                    @hasSection('layoutContent')
                        @yield('layoutContent')
                    @endif
                @endif
            </section>

            @if( !(isset($_page['show_footer']) && ! $_page['show_footer']) )
                <footer id="footer">
                    <div class="container-fluid text-left lh-sm">
                        <div class="row">
                            <div class="col my-0">
                                <ul class="list-unstyled mb-0">
                                    <li class="d-inline-block">{{ config('app.name', 'App') }} v{{ config('app.version', '') }}</li>{{--
                                    --}}<li class="d-inline-block">Made By <a class="hover_up text-muted" href="https://vgdb.io/" target="_blank">VGDB</a> With<i class="icon-heart ms-0" style="color: red;"></i></li>{{--
                                    --}}<li class="d-inline-block"><a class="hover_up" href="{{ route('web.about') }}" title="About" data-bs-toggle="tooltip"><i class="icon-info-circled"></i>About</a></li>{{--
                                    --}}
                                </ul>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col my-0">
                                <ul class="list-unstyled mb-0">
                                    <li class="d-inline-block">©2022. All Rights Reserved.</li>
                                    <li class="d-inline-block">
                                        <a class="hover_up text-muted ms-1" href="{{ route('web.terms') }}">Terms Of Service</a>{{--
                                        --}}<span class="px-1">|</span>{{--
                                        --}}<a class="hover_up text-muted" href="{{ route('web.privacy') }}">Privacy Policy</a>
                                        @if(mastermind())
                                            <a class="ms-3 hover_up" href="{{ route('web.mastermind') }}" title="Mastermind Home" data-bs-toggle="tooltip"><i class="icon-skull"></i>Mastermind Home</a>
                                        @endif
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            @endif
        </div>

        <!--!START: Scripts-->
        <script src="{{ mix('js/ApplicationLoader.js') }}"></script>
        @stack('pageScripts')
        <script type="text/javascript">
            window.app().createApp({
                'mountTo': '#app',
                'components': [
                    {
                        "name": "Auth",
                        "enabled": true,
                        'config': {
                            'user': {!! Auth::check() ? json_encode(Auth::user(), JSON_PRETTY_PRINT) : 'null' !!},
                        },
                    },
                    {
                        "name": "Keyboard",
                        "enabled": true,
                        "config": {},
                    },
                    {
                        "name": "PageManager",
                        "enabled": true,
                        "config": {
                            // 'mode': 'History',
                            'mountTo': '#page_content',
                            // 'pages': [
                            //     'MercadoLibreApi',
                            //     'Welcome',
                            // ],
                            // 'initCurrentPage': false,
                            // 'initCurrentPageData': (typeof _pageData === 'undefined' || _pageData === null ? {} : _pageData),
                        },
                    },
                    {
                        "name": "TextareaCode",
                        "enabled": true,
                    },
                ],
            }).loadApp({
                    'initCurrentPage': true,
                    'initCurrentPageData': (typeof _pageData === 'undefined' || _pageData === null ? {} : _pageData),
                });
        </script>
        <!--!END: Scripts-->
    </body>
</html>
