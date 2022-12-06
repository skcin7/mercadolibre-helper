@extends($_page['layout'])

@section('pageName', 'Welcome')

@section('pageContent')
    <div class="container-fluid">
        <h1 class="text-center my-0">My Saved Searches</h1>

        @if($saved_searches->count())
            <p>You have <strong>{{ $saved_searches->count() }}</strong> saved searches.</p>

            <div class="table-responsive mb-3">
                <table class="table table-hover table-bordered table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>Saved Search</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach($saved_searches as $saved_search)
                        <tr>
                            <td>
                                <a class="hover_up" href="{{ route('web.search', ['id' => $saved_search->getAttribute('id')]) }}">{{ $saved_search->getAttribute('id') }}</a>

                                <br/><strong>Include Keywords:</strong> {{ $saved_search->getAttribute('include_keywords') }}
                                <br/><strong>Exclude Keywords:</strong> {{ $saved_search->getAttribute('exclude_keywords') }}
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="alert alert-warning">No Saved Searches</div>
        @endif


    </div>
@endsection
