@extends($_page['layout'])

@section('pageName', 'Welcome')

@section('pageContent')
    <div class="container-fluid">
        <h1>{{ $saved_search->exists ? 'Update' : 'Create' }} Saved Search</h1>

        <form action="{{ route('web.saved_searches.' . ($saved_search->exists ? 'update' : 'create') ) }}" method="POST">
            @csrf

            <div class="form-group row mb-3">
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend d-none d-md-flex">
                            <label class="input-group-text px-1 cursor_pointer" for="input_include_keywords">Include Keywords</label>
                        </div>
                        <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control" id="input_include_keywords" name="include_keywords" placeholder="[Include Keywords]" type="text" maxlength="255" value="{{ $saved_search->exists ? $saved_search->getAttribute('include_keywords') : '' }}"/>
                    </div>
                </div>

                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend d-none d-md-flex">
                            <label class="input-group-text px-1 cursor_pointer" for="input_exclude_keywords">Exclude Keywords</label>
                        </div>
                        <input autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control" id="input_exclude_keywords" name="exclude_keywords" placeholder="[Exclude Keywords]" type="text" maxlength="255" value="{{ $saved_search->exists ? $saved_search->getAttribute('exclude_keywords') : '' }}"/>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary" type="submit">{{ $saved_search->exists ? 'Update' : 'Create' }} Saved Search</button>
        </form>

    </div>
@endsection
