@extends($_page['layout'], [
    'bgscene' => 'clouds',
])

@section('pageName', 'AuthVerify')

@section('layoutContent')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card mb-3 border mt-3 rounded-1" data-border-width="2" data-border-color="gray-5" data-box-shadow="border">
                <div class="card-header text-center font_family_pixelated bigger">
                    {{ __('Verify Your Email Address') }}
                </div>
                <div class="card-body">
                    @if (session('resent'))
                        <div class="alert alert-success" role="alert">
                            {{ __('A fresh verification link has been sent to your email address.') }}
                        </div>
                    @endif

                    {{ __('Before proceeding, please check your email for a verification link.') }}
                    {{ __('If you did not receive the email') }},
                    <form class="d-inline" method="POST" action="{{ route('verification.resend') }}">
                        @csrf
                        <button type="submit" class="btn btn-link p-0 m-0 align-baseline">{{ __('click here to request another') }}</button>.
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
