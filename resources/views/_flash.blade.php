<div class="p-0" id="flash_messages_container">
    @if(Session::has('flash_message'))
        <div class="m-2 alert alert-{{ isset(Session::get('flash_message')['type']) ? Session::get('flash_message')['type'] : 'default' }} bigger d-inline-block position-relative py-3 pe-5 mb-0">
{{--            <button class="smbbox_close" title="Close" onclick='((event) => { event.parentNode.remove(); })(this);'></button>--}}

            <button class="btn-close position-absolute top-0 right-0 mt-2 me-2" type="button" data-bs-dismiss="alert" aria-label="Close"></button>

            {{--        @if(isset(Session::get('flash_message')['show_icon']) && Session::get('flash_message')['show_icon'])--}}
            {{--            @switch(Session::get('flash_message')['type'])--}}
            {{--                @case('success')--}}
            {{--                <i class="icon-ok bigger"></i>--}}
            {{--                @break;--}}
            {{--                @case('danger')--}}
            {{--                <i class="icon-cancel-circled bigger"></i>--}}
            {{--                @break;--}}
            {{--                @case('info')--}}
            {{--                <i class="icon-info bigger"></i>--}}
            {{--                @break;--}}
            {{--                @case('warning')--}}
            {{--                <i class="icon-attention bigger"></i>--}}
            {{--                @break;--}}
            {{--            @endswitch--}}
            {{--        @endif--}}

            {!! isset(Session::get('flash_message')['message']) ? Session::get('flash_message')['message'] : 'No Message' !!}

        </div>
    @endif

    @if(isset($errors) && count($errors) > 0)
        <div class="alert alert-danger d-inline-block position-relative py-3 pe-5 rounded-0 mb-0">
            <button class="btn-close position-absolute top-0 right-0 mt-2 me-2" type="button" data-bs-dismiss="alert" aria-label="Close"></button>

            <p><strong>Please correct the following errors:</strong></p>
            <ol class="mb-0">
                @foreach($errors->all() as $error)
                    <li>{!! $error !!}</li>
                @endforeach
            </ol>
        </div>
    @endif
</div>
