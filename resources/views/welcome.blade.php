@extends($_page['layout'])

@section('pageName', 'Welcome')

@section('pageContent')
    <div class="container-fluid p-3">
        @if(Auth::check())
            <p>You are logged in. To go to your account, <a class="hover_up" href="{{ route('web.account') }}">click here</a>.</p>
        @else
            <p>Please <a class="hover_up" href="{{ route('web.auth.login') }}">login</a> to continue.</p>
        @endif
    </div>
@endsection
