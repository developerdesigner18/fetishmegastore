@extends('admin.base')

@section('section_title')
    <strong>{{ __(':type Management', ['type' => ucfirst($active)]) }}</strong>
@endsection

@section('section_body')
    <table class="text-stone-600 table border-collapse w-full bg-white dataTable">
        <thead>
        <tr>
            <x-th>{{ __('ID') }}</x-th>
            <x-th>{{ __('User Name') }}</x-th>
            <x-th>{{ __('Video') }}</x-th>
            <x-th>{{ __('Description') }}</x-th>
            <x-th>{{ __('Purchase Status') }}</x-th>
            <x-th>{{ __('Actions') }}</x-th>
        </tr>
        </thead>
        <tbody>

        @foreach ($requests as $u)

            <tr>
                <x-td>
                    <x-slot name="field">{{ __('ID') }}</x-slot>
                    {{ $u->id }}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('User Name') }}</x-slot>
                    {{@$u->user->username}}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Video') }}</x-slot>
                    {{@$u->video->title}}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Description') }}</x-slot>
                    {{ @$u->description }}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Purchase Status') }}</x-slot>
                    @if(@$u->video->canBePlayed)
                        <span class="inline-flex px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg"> {{__('Yes')}}</span>
                    @else
                        <span class="inline-flex px-2 py-1 bg-red-600 text-white-700 rounded-lg"> {{__('No')}}</span>
                    @endif
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Actions') }}</x-slot>
                    <a href="javascript:void(0)" class="text-teal-600 hover:underline sendMail" data-id="{{$u->id}}">Send
                        Link As E-mail</a>
                </x-td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endsection

@section('extra_bottom')
    @if (count($errors) > 0)
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
@endsection

@push('adminExtraJS')
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    {{-- attention, dynamic because only needed on this page to save resources --}}
    <script>
        $(document).ready(function () {
            $('.dataTable').dataTable({ordering: false});
        });

        $(document).on('click', '.sendMail', function () {
            let id = $(this).data('id');
            $.ajax({
                url: "{{route('send.request.link')}}",
                method: 'post',
                data: {"id": id,"_token":"{{csrf_token()}}"},
                dataType: 'JSON',
                success: function (datas) {
                    if(datas.status == 1){
                        Swal.fire({
                            title: 'Done.',
                            icon: 'success',
                            text: datas.message
                        });
                        window.location.reload(true)
                    }else{
                        Swal.fire({
                            title: '',
                            icon: 'error',
                            text: datas.message
                        });
                    }
                }
            });
        });
    </script>
@endpush