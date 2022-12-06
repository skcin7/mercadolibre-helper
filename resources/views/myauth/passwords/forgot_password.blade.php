@extends($_page['layout'], [
    'bgscene' => 'clouds',
])

@section('pageName', 'AuthPasswordsForgotPassword')

@section('layoutContent')
    <div class="container">
        <div class="row mb-3 justify-content-center">
            <div class="col-md-8">
                <div class="card mb-3 border mt-3 rounded-1" data-border-width="2" data-border-color="gray-5" data-box-shadow="border">
                    <div class="card-header text-center font_family_pixelated bigger">
                        <i class="icon-lock me-1"></i>{{ __('Forgot Password') }}
                    </div>

                    <div class="card-body">
                        <p class="mb-2">To recover your account, enter the email address that is associated with your account. Instructions will be emailed there with instructions to recover your account.</p>

{{--                        @if(session('status'))--}}
{{--                            <div class="alert alert-success" role="alert">--}}
{{--                                {{ session('status') }}--}}
{{--                            </div>--}}
{{--                        @endif--}}

                        <form action="{{ route('web.auth.forgot_password') }}" method="POST">
                            @csrf

                            <div class="row mb-3">
                                <label for="email_input" class="col-md-4 col-form-label text-md-end bigger">{{ __('Email Address') }}:</label>

                                <div class="col-md-6">
                                    <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control @error('email') is-invalid @enderror" id="email_input" name="email" placeholder="" type="email" value="{{ old('email') }}" required autocomplete="email_input" autofocus>

                                    @error('email')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="row mb-0">
                                <div class="col-md-6 offset-md-4">
                                    <button type="submit" class="btn btn-primary big">
                                        <i class="icon-lock me-1 d-none"></i>{{ __('Send Password Reset Link') }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            @if(Route::has('web.auth.login'))
                <div>
                    <a class="btn btn-secondary" href="{{ route('web.auth.login') }}">← Back To Login</a>
                </div>
            @endif
        </div>
    </div>
@endsection
