@extends($_page['layout'])

@section('pageName', 'Welcome')

@section('pageContent')
    <div class="container-fluid">
        <h1 class="text-center my-0">My Saved Searches</h1>

        @if($saved_searches->count())
            <p>You have <strong class="biggest">{{ $saved_searches->count() }}</strong> total saved searches that you are managing.</p>

            <div class="table-responsive mb-3">
                <table class="table table-hover table-bordered table-striped border" data-border-width="2" data-border-color="gray6" data-box-shadow="border">
                    <thead class="table-dark">
                        <tr>
                            <th>System Group</th>
                            <th>Saved Search</th>
                            <th>Automatic Searching Enabled</th>
                            <th>Alerts Enabled</th>
                            <th>Last Searched At</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach($saved_searches as $saved_search)
                        <tr>
                            <td>
                                <form>
                                    <div class="form-group row mb-3">
                                        <div class="input-group w-auto">
                                            <select class="form-control system_group_input" data-saved-search-id="{{ $saved_search->getAttribute('id') }}">
                                                <option value="" {{ (strlen($saved_search->getAttribute('system_group')) == 0 ? 'selected' : '') }}>[No Group]</option>
                                                <option value="NES" {{ ($saved_search->getAttribute('system_group') == "NES" ? 'selected' : '') }}>NES</option>
                                                <option value="SNES" {{ ($saved_search->getAttribute('system_group') == "SNES" ? 'selected' : '') }}>SNES</option>
                                                <option value="N64" {{ ($saved_search->getAttribute('system_group') == "N64" ? 'selected' : '') }}>N64</option>
                                                <option value="GameCube" {{ ($saved_search->getAttribute('system_group') == "GameCube" ? 'selected' : '') }}>GameCube</option>
                                                <option value="Wii" {{ ($saved_search->getAttribute('system_group') == "Wii" ? 'selected' : '') }}>Wii</option>
                                                <option value="WiiU" {{ ($saved_search->getAttribute('system_group') == "WiiU" ? 'selected' : '') }}>WiiU</option>
                                                <option value="Switch" {{ ($saved_search->getAttribute('system_group') == "Switch" ? 'selected' : '') }}>Switch</option>
                                                <option value="GB" {{ ($saved_search->getAttribute('system_group') == "GB" ? 'selected' : '') }}>GB</option>
                                                <option value="GBC" {{ ($saved_search->getAttribute('system_group') == "GBC" ? 'selected' : '') }}>GBC</option>
                                                <option value="GBA" {{ ($saved_search->getAttribute('system_group') == "GBA" ? 'selected' : '') }}>GBA</option>
                                                <option value="DS" {{ ($saved_search->getAttribute('system_group') == "DS" ? 'selected' : '') }}>DS</option>
                                                <option value="3DS" {{ ($saved_search->getAttribute('system_group') == "3DS" ? 'selected' : '') }}>3DS</option>
                                                <option value="Misc Nintendo" {{ ($saved_search->getAttribute('system_group') == "Misc Nintendo" ? 'selected' : '') }}>Misc Nintendo</option>
                                                <option value="Misc Sega" {{ ($saved_search->getAttribute('system_group') == "Misc Sega" ? 'selected' : '') }}>Misc Sega</option>
                                                <option value="Misc PlayStation" {{ ($saved_search->getAttribute('system_group') == "Misc PlayStation" ? 'selected' : '') }}>Misc PlayStation</option>
                                                <option value="Misc Xbox" {{ ($saved_search->getAttribute('system_group') == "Misc Xbox" ? 'selected' : '') }}>Misc Xbox</option>
                                                <option value="Other" {{ ($saved_search->getAttribute('system_group') == "Other" ? 'selected' : '') }}>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>

{{--                                {!! strlen($saved_search->getAttribute('system_group')) > 0 ? $saved_search->getAttribute('system_group') : '<span class="text-muted fst-italic">N/A</span>' !!}--}}
                            </td>
                            <td>
                                <div>
                                    <span>[ID: {{ $saved_search->getAttribute('id') }}]</span>
                                    <a class="hover_up biggest text-decoration-none" href="{{ route('web.search', ['id' => $saved_search->getAttribute('id')]) }}">{!! (strlen($saved_search->getAttribute('keywords')) > 0 ? $saved_search->getAttribute('keywords') : '<em>No Keywords</em>') !!}</a>
                                    <a class="btn btn-primary px-2 nobr" href="{{ route('web.search', ['id' => $saved_search->getAttribute('id')]) }}"><i class="icon-wrench"></i>Edit</a>
                                </div>
                                <ul class="list-unstyled mb-0 lh-sm">
                                    <li><strong>Mercado Libre Site:</strong> {{ (App\Models\MercadoLibreSite::where('id', $saved_search->getAttribute('mercadolibre_site_id'))->first())->getAttribute('name') }} [ID: {{ $saved_search->getAttribute('mercadolibre_site_id') }}]</li>
                                    <li><strong>Mercado Libre Category:</strong> {{ $saved_search->getAttribute('mercadolibre_category_id') }}</li>
                                    <li><strong>Keywords:</strong> {{ $saved_search->getAttribute('keywords') }}</li>
                                    <li><strong>Title Must Contain:</strong> {{ $saved_search->getAttribute('title_must_contain') }}</li>
                                    <li><strong>Title Must Not Contain:</strong> {{ $saved_search->getAttribute('title_must_not_contain') }}</li>
                                </ul>
                            </td>
                            <td>
                                {!! $saved_search->getAttribute('automatic_searching_enabled') ? '<button class="btn btn-success px-2 nobr"><i class="icon-ok"></i>YES</button>' : '<button class="btn btn-danger px-2 nobr"><i class="icon-cancel"></i>NO</button>' !!}
                            </td>
                            <td>
                                {!! $saved_search->getAttribute('alerts_enabled') ? '<button class="btn btn-success px-2 nobr"><i class="icon-ok"></i>YES</button>' : '<button class="btn btn-danger px-2 nobr"><i class="icon-cancel"></i>NO</button>' !!}
                            </td>
                            <td>
                                @if(is_null($saved_search->getAttribute('last_searched_at')))
                                    <span class="text-muted fst-italic">Never</span>
                                @else
                                    <span>{{ $saved_search->getAttribute('last_searched_at')->format('D, M d, Y h:i A') }}</span>
                                    <br/><span class="text-muted">({{ $saved_search->getAttribute('last_searched_at')->diffForHumans() }})</span>
                                @endif
                            </td>
                            <td>

                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="alert alert-warning">No Saved Searches</div>
        @endif

        <div class="mb-3">
            <a class="btn btn-light px-2" href="{{ route('web.search') }}"><i class="icon-magic-wand"></i>New Search</a>
        </div>


    </div>
@endsection
