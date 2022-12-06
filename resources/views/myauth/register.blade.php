@extends($_page['layout'], [
    'bgscene' => 'clouds',
])

@section('pageName', 'AuthRegister')

@section('layoutContent')
    <div class="container">
        <div class="row mb-3 justify-content-center">
            <div class="col-md-10">
                <div class="card mb-3 border mt-3 rounded-1" data-border-width="2" data-border-color="gray-5" data-box-shadow="border">
                    <div class="card-header text-center font_family_pixelated bigger">
                        <i class="icon-sword me-1"></i>{{ __('Create Account') }}
                    </div>
                    <div class="card-body">
                        <form action="{{ route('web.auth.register') }}" id="register_form" method="post">
                            @csrf

                            <div class="row mb-3">
                                <label for="username_input" class="col-md-4 col-form-label text-md-end bigger cursor_pointer">{{ __('Username') }}:</label>
                                <div class="col-md-6">
                                    <div class="input-group">
                                        <div class="input-group-prepend d-none d-md-flex">
                                            <div class="input-group-text px-2"><i class="icon-at"></i></div>
                                        </div>
                                        <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control @error('username') is-invalid @enderror" id="username_input" name="username" placeholder="" type="text" value="{{ old('username') }}" required autocomplete="username_input" autofocus/>
                                    </div>
                                    @error('username')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="email_input" class="col-md-4 col-form-label text-md-end bigger cursor_pointer">{{ __('Email Address') }}:</label>
                                <div class="col-md-6">
                                    <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control @error('email') is-invalid @enderror" id="email_input" name="email" placeholder="" type="email" value="{{ old('email') }}" required autocomplete="email_input">
                                    <div class="text-muted">We don't spam you or sell your data.</div>
                                    @error('email')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="password_input" class="col-md-4 col-form-label text-md-end bigger cursor_pointer">{{ __('Password') }}:</label>
                                <div class="col-md-6">
                                    <div class="form-group col">
                                        <div class="input-group">
                                            <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control @error('password') is-invalid @enderror" id="password_input" name="password" placeholder="" type="password" value="{{ old('password') }}" required autocomplete="password_input">
                                            <div class="input-group-append d-none d-md-flex cursor_pointer" onclick="((event) => { let $password_input_element = $(this).closest('form').find('input[name=password]'); let current_input_type = $password_input_element.attr('type'); $password_input_element.attr('type', (current_input_type == 'password' ? 'text' : 'password')); let $icon_element = $(this).find('.input-group-text i'); if($icon_element.hasClass('icon-eye-off')) { $icon_element.removeClass('icon-eye-off').addClass('icon-eye'); } else { $icon_element.removeClass('icon-eye').addClass('icon-eye-off'); } $password_input_element.focus(); })(this);">
                                                <span class="input-group-text px-2"><i class="icon-eye-off"></i></span>
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

                            <div class="row mb-3">
                                <label for="password_confirmation_input" class="col-md-4 col-form-label text-md-end bigger cursor_pointer">{{ __('Confirm Password') }}:</label>
                                <div class="col-md-6">
                                    <div class="form-group col">
                                        <div class="input-group">
                                            <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control @if(isset($errors) && ($errors->has('password') || $errors->has('password_confirmation')) ) is-invalid @endif" id="password_confirmation_input" name="password_confirmation" placeholder="" type="password" value="{{ old('password_confirmation') }}" required autocomplete="password_confirmation_input">
                                            <div class="input-group-append d-none d-md-flex cursor_pointer" onclick="((event) => { let $password_confirmation_input_element = $(this).closest('form').find('input[name=password_confirmation]'); let current_input_type = $password_confirmation_input_element.attr('type'); $password_confirmation_input_element.attr('type', (current_input_type == 'password' ? 'text' : 'password')); let $icon_element = $(this).find('.input-group-text i'); if($icon_element.hasClass('icon-eye-off')) { $icon_element.removeClass('icon-eye-off').addClass('icon-eye'); } else { $icon_element.removeClass('icon-eye').addClass('icon-eye-off'); } $password_confirmation_input_element.focus(); })(this);">
                                                <span class="input-group-text px-2"><i class="icon-eye-off"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6 offset-md-4">
                                    <div class="form-check">
                                        <input class="form-check-input @error('required_conditions') is-invalid @enderror" type="checkbox" name="required_conditions" id="required_conditions" {{ old('required_conditions') ? 'checked' : '' }}>

                                        <label class="form-check-label" for="required_conditions">
                                            {!! __('I agree to the <a class="hover_up" href="' . route('web.terms') . '">Terms Of Service</a> and the <a class="hover_up" href="' . route('web.privacy') . '">Privacy Policy</a>.') !!}
                                        </label>

                                        @if($errors->has('required_conditions'))
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $errors->first('required_conditions') }}</strong>
                                        </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-0">
                                <div class="col-md-6 offset-md-4">
                                    <button type="submit" class="btn btn-primary big">
                                        <i class="icon-lock me-1 d-none"></i>{{ __('Create My Account') }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            @if(Route::has('web.auth.login'))
                <p class="big text-secondary">Already Have An Account? <a class="btn btn-primary" href="{{ route('web.auth.login') }}">Click Here To Login</a></p>
            @endif
        </div>
    </div>
@endsection
