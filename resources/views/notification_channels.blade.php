@extends($_page['layout'])

@section('pageName', 'NotificationChannels')

@section('pageContent')
    <div class="container-fluid">

        <form action="{{ route('web.account.notification_channels') }}" id="notification_channels_form" method="post">
            @csrf

            <div class="d-flex flex-row align-items-center justify-content-center">
                <h1 class="d-inline my-0">Notification Channels</h1>
                <button class="btn btn-primary ms-2" type="submit"><i class="icon-floppy-disk"></i>Save</button>
            </div>

            <div class="form-group row mb-3">
                <div class="col">
                    <div class="input-group">
                        <textarea autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control rounded-0 border autosize textarea_code font-monospace" name="notification_channels_json" placeholder="[Notification Channels JSON...]" rows="15" data-border-color="gray5" data-border-width="2" data-box-shadow="border">{{ old('notification_channels_json') ? old('notification_channels_json') : json_encode($notification_channels, JSON_PRETTY_PRINT) }}</textarea>
                    </div>
                </div>
            </div>

{{--            <button class="btn btn-primary" type="submit">Save Notification Channels</button>--}}
        </form>

{{--        <div class="table-responsive-md">--}}
{{--            <table class="table table-bordered table-border table-hover table-striped bg-white">--}}
{{--                <thead class="table-dark">--}}
{{--                <tr>--}}
{{--                    <th>Notification Channel</th>--}}
{{--                    <th>Action</th>--}}
{{--                </tr>--}}
{{--                </thead>--}}
{{--                <tbody>--}}
{{--                <tr>--}}
{{--                    <td class="bigger">--}}
{{--                        <i class="icon-email me-1"></i>Email--}}
{{--                    </td>--}}
{{--                    <td>--}}
{{--                        <div class="form-group row mb-3">--}}
{{--                            <div class="col">--}}
{{--                                <div class="input-group">--}}
{{--                                    <textarea autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="form-control autosize" name="catalog_items_vgdb_ids_list" placeholder="[VGDB IDs List...]" rows="8" required style="min-height: 198.125px;"></textarea>--}}
{{--                                </div>--}}
{{--                            </div>--}}
{{--                        </div>--}}
{{--                    </td>--}}
{{--                </tr>--}}
{{--                </tbody>--}}
{{--            </table>--}}
{{--        </div>--}}


    </div>
@endsection
