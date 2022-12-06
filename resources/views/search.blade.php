@extends($_page['layout'])

@section('pageName', 'Search')

@push('pageScripts')
    <script type="text/javascript">
        let _pageData = {
            "saved_search": {
                "id": {!! $saved_search->getAttribute('id') !!},
                "exists": Boolean({!! $saved_search->exists ? 'true' : 'false' !!}),
                "mercadolibre_site_id": String({!! $saved_search->getAttribute('mercadolibre_site_id') !!}),
                "mercadolibre_category_id": String({!! $saved_search->getAttribute('mercadolibre_category_id') !!}),
                "keywords": String({!! $saved_search->getAttribute('keywords') !!}),
                "title_must_contain": {!! $saved_search->getAttribute('title_must_contain') !!},
                "is_enabled": Boolean({!! $saved_search->getAttribute('is_enabled') ? 'true' : 'false' !!}),
                "notifications_enabled": Boolean({!! $saved_search->getAttribute('notifications_enabled') ? 'true' : 'false' !!}),
            },

            // 'viewmode': viewmode,
            // 'showing_advanced_search': showing_advanced_search,
            // 'inventory_items': inventory_items,
            {{--'trash': Boolean({{ (isset($trash) && ($trash) ? 'true' : 'false') }}),--}}
        };
    </script>
@endpush

@section('pageContent')
    <div class="container-fluid px-2">

        <div class="d-flex flex-row align-items-center justify-content-center">
            <h1 class="d-inline my-0">{{ $saved_search->exists ? 'Existing' : 'New' }} Search</h1>

            <button class="btn btn-primary ms-2" type="button" data-event-action="save_saved_search"><i class="icon-floppy-disk"></i>{{ ($saved_search->exists ? 'Update Saved Search' : 'Save This Search') }}</button>
            @if($saved_search->exists)
                <button class="btn btn-danger ms-2" type="button" data-event-action="delete_saved_search"><i class="icon-trash"></i>Delete Search</button>
            @endif
        </div>

        <div id="search_sticky_header">
            <fieldset class="fieldset" id="input_parameters_fieldset">
                <legend class="biggest text-center">{{ $saved_search->exists ? 'Existing' : 'New' }} Search</legend>
                <form action="{{ route('web.search.find_listings') }}" id="find_matched_listings_form" method="POST">
                    @csrf

                    <div class="form-group row mb-2">
                        <div class="col">
                            <div class="input-group">
                                <div class="input-group-prepend d-none d-md-flex">
                                    <span class="input-group-text px-2">Mercado Libre Site<span class="text-danger">*</span></span>
                                </div>
                                <select class="form-control" name="mercadolibre_site_id" required>
                                    <option value="">[Choose Mercado Libre Site]</option>
                                    @foreach($mercadolibre_sites as $mercadolibre_site)
                                        <option value="{{ $mercadolibre_site->getAttribute('id') }}" {{ ($mercadolibre_site->getAttribute('id') == $saved_search->getAttribute('mercadolibre_site_id') ? 'selected' : '') }}>{{ $mercadolibre_site->getAttribute('name') }} [ID: {{ $mercadolibre_site->getAttribute('id') }}]</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="col">
                            <div class="input-group disabled">
                                <div class="input-group-prepend d-none d-md-flex">
                                    <span class="input-group-text px-2">Category</span>
                                </div>
                                <select class="form-control" name="mercadolibre_category_id" disabled>
                                    <option value="">[Any Category]</option>
                                    <option value="MLB186456" selected>Video Games [ID: MLB186456]</option>
                                </select>
                            </div>
                        </div>

                        <div class="col">
                            <div class="input-group">
                                <div class="input-group-prepend d-none d-md-flex">
                                    <span class="input-group-text px-2">Keywords</span>
                                </div>
                                <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control" maxlength="255" name="keywords" placeholder="[Keywords...]" type="text" value="{{ $saved_search->getAttribute('keywords') }}"/>
                            </div>
                        </div>
                    </div>

                    <div class="form-group row mb-2">
                        <div class="col">
                            <div class="input-group">
                                <div class="input-group-prepend d-none d-md-flex">
                                    <label class="input-group-text px-2 py-1 lh-1 d-flex flex-column cursor_pointer" for="title_must_contain_input">
                                        <div>Title<u class="mx-1">Must</u>Contain</div>
                                        <div class="small">These Words</div>
                                    </label>
                                </div>
                                <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control" id="title_must_contain_input" maxlength="255" name="title_must_contain" placeholder="[Title Must Contain...]" type="text" value="{{ $saved_search->getAttribute('title_must_have') }}"/>
                            </div>
                        </div>
                    </div>

                    <div class="form-group row mb-0">
                        <div class="col-auto">
                            <button class="btn btn-primary" type="submit" data-event-action="find_matched_listings">Find Matched Listings</button>
                        </div>

                        {{--                    <div class="col-auto">--}}
                        {{--                        <button class="btn btn-primary" type="button"><i class="icon-floppy-disk"></i>{{ ($saved_search->exists ? 'Update' : 'Create') }} Saved Search</button>--}}
                        {{--                        @if($saved_search->exists)--}}
                        {{--                            <button class="btn btn-danger" type="button"><i class="icon-trash"></i>Delete Search</button>--}}
                        {{--                        @endif--}}
                        {{--                    </div>--}}
                    </div>
                </form>
            </fieldset>
        </div>

        <fieldset class="fieldset border" data-border-color="branding" data-border-width="2" data-box-shadow="border">
            <legend>Matched Listings</legend>

            <ul class="list-unstyled" id="matched_listings_list"></ul>
        </fieldset>


    </div>
@endsection
