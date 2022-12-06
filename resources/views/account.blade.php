@extends($_page['layout'])

@section('pageName', 'Search')

@section('pageContent')
    <div class="container-fluid">
        <h1 class="text-center my-0">My Account - Home</h1>

        <div class="d-inline-block alert alert-success rounded-0">You are logged in as <strong>{{ '@' . Auth::user()->getAttribute('name') }}</strong>!</div>

        <ul class="list-unstyled">
{{--            <li>--}}
{{--                <a class="hover_up bigger" href="{{ route('web.account.mercadolibre_api') }}">Mercado Libre API</a>--}}
{{--            </li>--}}
            <li>
                <a class="hover_up bigger" href="{{ route('web.account.saved_searches') }}">My Saved Searches ({{ number_format(Auth::user()->savedSearches->count()) }})</a>
            </li>
            <li>
                <a class="hover_up bigger" href="{{ route('web.account.notification_channels') }}">Notification Channels</a>
            </li>
            <li>
                <a class="hover_up bigger" href="#" data-event-action="handle_logout">Logout</a>
            </li>
        </ul>


{{--        <div class="row justify-content-center">--}}
{{--            <div class="col-md-8">--}}
{{--                <div class="card">--}}
{{--                    <div class="card-header">{{ __('Dashboard') }}</div>--}}

{{--                    <div class="card-body">--}}
{{--                        @if (session('status'))--}}
{{--                            <div class="alert alert-success" role="alert">--}}
{{--                                {{ session('status') }}--}}
{{--                            </div>--}}
{{--                        @endif--}}

{{--                        {{ __('You are logged in!') }}--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
    </div>
@endsection
