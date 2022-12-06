@extends($_page['layout'], [
    'bgscene' => 'clouds',
])

@section('pageName', 'AuthLogin')

@section('layoutContent')
    <div class="container">
        <div class="row mb-3 justify-content-center">
            <div class="col-md-10">
                <div class="card mb-3 border mt-3 rounded-1" data-border-width="1" data-border-color="gray6" data-box-shadow="border">
                    <div class="card-header text-center bigger">
                        <i class="icon-lock me-1"></i>
                        <span>{!! __('Login To Access Your Account') !!}</span>
                    </div>
                    <div class="card-body">
                        <form action="{{ route('web.auth.login') }}" id="login_form" method="post">
                            @csrf
                            <div class="row mb-2">
                                <label for="username_or_email_input" class="col-md-4 col-form-label text-md-end bigger cursor_pointer lh-1">{{ __('Identify Yourself') }}:<br/>(What's Your Username?)</label>
                                <div class="col-md-6">
                                    <div class="form-group col">
                                        <div class="input-group">
                                            <label class="input-group-prepend d-none d-md-flex cursor_pointer" for="username_or_email_input">
                                                <span class="input-group-text px-2"><i class="icon-at"></i></span>
                                            </label>
                                            <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control @error('username_or_email') is-invalid @enderror" id="username_or_email_input" name="username_or_email" placeholder="" type="text" required autocomplete="username_or_email_input" autofocus/>
                                            @error('username_or_email')
                                            <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                        <div class="text-muted">This is the username that is associated with your account.</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-2">
                                <label for="password_input" class="col-md-4 col-form-label text-md-end bigger cursor_pointer lh-1">{{ __('Speak, Friend, And Enter') }}:<br/>(What's Your Password?)</label>
                                <div class="col-md-6">
                                    <div class="form-group col">
                                        <div class="input-group">
                                            <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control @error('password') is-invalid @enderror" id="password_input" name="password" placeholder="" type="password" required autocomplete="password_input">
                                            <div class="input-group-append d-none d-md-flex cursor_pointer" onclick="((event) => { let $password_input_element = $(this).closest('form').find('input[name=password]'); let current_input_type = $password_input_element.attr('type'); $password_input_element.attr('type', (current_input_type == 'password' ? 'text' : 'password')); let $icon_element = $(this).find('.input-group-text i'); if($icon_element.hasClass('icon-eye-off')) { $icon_element.removeClass('icon-eye-off').addClass('icon-eye'); } else { $icon_element.removeClass('icon-eye').addClass('icon-eye-off'); } $password_input_element.focus(); })(this);">
                                                <span class="input-group-text px-2"><i class="icon-eye-disabled"></i></span>
                                            </div>
                                            @error('password')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-2">
                                <div class="col-md-6 offset-md-4">
                                    <div class="form-group col">
                                        <div class="input-group">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" name="remember" id="remember" checked>
                                                <label class="form-check-label bigger" for="remember">
                                                    {{ __('Remember Me') }}
                                                </label>
                                            </div>
                                        </div>
                                        <div class="text-muted lh-1">Keep Me Logged In, Until I Manually Log Out</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-0">
                                <div class="col-md-8 offset-md-4">
                                    <button type="submit" class="btn btn-primary big">
                                        <i class="icon-locked me-1"></i>
                                        <span>{{ __('Log In') }}</span>
                                    </button>
                                    @if(Route::has('web.auth.forgot_password'))
                                        <a class="btn btn-link bigger hover_up" href="{{ route('web.auth.forgot_password') }}">
                                            {{ __('I Forgot My Password') }}
                                        </a>
                                    @endif
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

{{--            @if(Route::has('web.auth.register'))--}}
{{--                <p class="big text-secondary">Need An Account? <a class="btn btn-primary" href="{{ route('web.auth.register') }}">Click Here To Register</a></p>--}}
{{--            @endif--}}

        </div>
    </div>
@endsection
