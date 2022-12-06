@extends($_page['layout'])

@section('pageName', 'MercadolibreApi')

@section('pageContent')
    <div class="container-fluid">
        <h1 class="text-center my-0">Mercado Libre API</h1>

        <fieldset class="fieldset">
            <legend>Authorization Token</legend>
            @if( is_null(Auth::user()->getAttribute('mercadolibre_api')['authorization']) )
                <div class="alert alert-danger mb-0 d-inline-block rounded-0">
                    Your account is not connected to the Mercado Libre API!

                    <br/><br/>You must connect your account to the Mercado Libre API before you can use this application.

                    <br/><br/><a class="btn btn-primary" href="{{ route('web.account.mercadolibre_api.get_authorization') }}">Get API Authorization</a>
                </div>
            @else

            @endif
            <div>

            </div>
        </fieldset>

        <button class="btn btn-primary" type="button" data-event-action="get_mercadolibre_sites">Get Mercado Libre Sites</button>

    </div>
@endsection
