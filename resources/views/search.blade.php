@extends($_page['layout'])

@section('pageName', 'Search')

@push('pageScripts')
    <script type="text/javascript">
        let _pageData = {
            'saved_search': {
                "id": {!! $saved_search->exists ? $saved_search->getAttribute('id') : 'null' !!},
                "exists": Boolean({!! $saved_search->exists ? 'true' : 'false' !!}),
                "mercadolibre_site_id": String("{!! $saved_search->getAttribute('mercadolibre_site_id') !!}"),
                "mercadolibre_category_id": String("{!! $saved_search->getAttribute('mercadolibre_category_id') !!}"),
                "keywords": String("{!! $saved_search->getAttribute('keywords') !!}"),
                "title_must_contain": String("{!! $saved_search->getAttribute('title_must_contain') !!}"),
                "title_must_not_contain": String("{!! $saved_search->getAttribute('title_must_not_contain') !!}"),
                "system_group": String("{!! $saved_search->getAttribute('system_group') !!}"),
                "automatic_searching_enabled": Boolean({!! $saved_search->getAttribute('automatic_searching_enabled') ? 'true' : 'false' !!}),
                "notifications_enabled": Boolean({!! $saved_search->getAttribute('notifications_enabled') ? 'true' : 'false' !!}),
            },
        };
    </script>
@endpush

@section('pageContent')
    <div class="container-fluid px-2">

{{--        <div class="d-flex flex-row align-items-center justify-content-center">--}}
{{--            <h1 class="d-inline my-0">{{ $saved_search->exists ? 'Existing' : 'New' }} Search</h1>--}}

{{--            <button class="btn btn-primary ms-2" type="button" data-event-action="create_or_update_saved_search"><i class="icon-floppy-disk"></i>{{ ($saved_search->exists ? 'Update' : 'Create Saved Search') }}</button>--}}
{{--            @if($saved_search->exists)--}}
{{--                <button class="btn btn-danger ms-2" type="button" data-event-action="delete_saved_search"><i class="icon-trash"></i>Delete Search</button>--}}
{{--            @endif--}}
{{--        </div>--}}

        <div class="mt-1" id="search_sticky_header">
            <fieldset class="fieldset" id="input_parameters_fieldset">
                <legend class="text-center">
                    <span class="biggest">{{ $saved_search->exists ? 'Existing Saved' : 'New' }} Search</span>

                    <button class="btn btn-primary btn-sm ms-1" type="button" data-event-action="create_or_update_saved_search"><i class="icon-floppy-disk"></i>{{ ($saved_search->exists ? 'Save Changes' : 'Save Search') }}</button>
                    @if($saved_search->exists)
                        <button class="btn btn-danger btn-sm ms-1" type="button" data-event-action="delete_saved_search"><i class="icon-trash"></i>Delete Saved Search</button>
                    @endif
                </legend>
                <form action="{{ route('web.search.find_listings') }}" id="find_matched_listings_form" method="POST">
                    @csrf

                    <fieldset class="fieldset fieldset-sm">
                        <legend>Native Mercado Libre Search Controls</legend>

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
                    </fieldset>


                    <fieldset class="fieldset fieldset-sm">
                        <legend>Additional Search Controls (We Process Locally, From Native ML Search Results)</legend>

                        <div class="form-group row mb-2">
                            <div class="col">
                                <div class="input-group">
                                    <div class="input-group-prepend d-none d-md-flex">
                                        <label class="input-group-text px-2 py-1 lh-1 d-flex flex-column cursor_pointer" for="title_must_contain_input">
                                            <div>Title<u class="mx-1">Must</u>Contain</div>
                                            <div class="small">Words/Phrases</div>
                                        </label>
                                    </div>
                                    <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control" id="title_must_contain_input" maxlength="255" name="title_must_contain" placeholder="[Title Must Contain...]" type="text" value="{{ $saved_search->getAttribute('title_must_contain') }}"/>
                                </div>
                                <div class="small lh-sm">
                                    <div>The title MUST contain all of these words/phrases.</div>
                                    <ul class="list-unstyled mb-0 ps-3">
                                        <li>Use <code>,</code> (comma) to separate multiple words/phrases that all must be matched.</li>
                                        <li>Use <code>|</code> (pipe) within a single word/phrase to specify that at least one within that set must be matched.</li>
                                        <li><strong>Example:</strong> <code>Game Boy|Gameboy,Kid Icarus</code> - Must match ("Game Boy" OR "Gameboy") AND must match "Kid Icarus"</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col">
                                <div class="input-group">
                                    <div class="input-group-prepend d-none d-md-flex">
                                        <label class="input-group-text px-2 py-1 lh-1 d-flex flex-column cursor_pointer" for="title_must_not_contain_input">
                                            <div>Title<u class="mx-1">Must Not</u>Contain</div>
                                            <div class="small">Words/Phrases</div>
                                        </label>
                                    </div>
                                    <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control" id="title_must_not_contain_input" maxlength="255" name="title_must_not_contain" placeholder="[Title Must Not Contain...]" type="text" value="{{ $saved_search->getAttribute('title_must_not_contain') }}"/>
                                </div>
                                <div class="small lh-sm">
                                    <div>The title MUST NOT contain any of these words/phrases.</div>
                                    <ul class="list-unstyled mb-0 ps-3">
                                        <li>Use <code>,</code> (comma) to separate multiple words/phrases that must not be matched.</li>
                                        <li><strong>Example:</strong> <code>3DS,Uprising</code> - If you're searching for Kid Icarus for Game Boy or NES, this is a good way to filter out listings for the 3DS game.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <div class="form-group row mb-0">
                        <div class="col-auto">
                            <button class="btn btn-primary" type="button" data-event-action="find_matched_listings">Find Mercado Libre Listings</button>
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

        <fieldset class="fieldset border" id="matched_listings_fieldset" data-is-started="false" data-is-finished="false" data-is-loading="false" data-total-results="" data-offset="0" data-border-color="branding" data-border-width="2" data-box-shadow="border">
            <legend>Matched Listings</legend>

            <ul class="list-unstyled" id="matched_listings_list"></ul>

            <div id="matched_listings_loadmore">
                <div id="matched_listings_loadmore__allresultsloaded">All Results Loaded.</div>
                <div id="matched_listings_loadmore__loadmore">Load More</div>
                <div id="matched_listings_loadmore__loading"><i class="icon-spin1 animate-spin"></i>Loading...</div>
            </div>
        </fieldset>


    </div>
@endsection
