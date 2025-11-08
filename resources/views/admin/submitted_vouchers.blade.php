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
            <x-th>{{ __('Token Asked For') }}</x-th>
            <x-th>{{ __('CODE') }}</x-th>
            <x-th>{{ __('Type') }}</x-th>
            <x-th>{{ __('Actions') }}</x-th>
        </tr>
        </thead>
        <tbody>
        @foreach ($data as $u)

            <tr>
                <x-td>
                    <x-slot name="field">{{ __('ID') }}</x-slot>
                    {{ $u->id }}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('User Name') }}</x-slot>
                     {{ $u->user ? $u->user->username : '' }}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Token Asked For') }}</x-slot>
                    {{$u->token->tokens ?? ''}}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('CODE') }}</x-slot>
                    {{$u->code ?? ''}}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Description') }}</x-slot>
                    {{ $u->type ?? '' }}
                </x-td>

                <x-td>
                    <x-slot name="field">{{ __('Actions') }}</x-slot>
                    <a href="javascript:void(0)" class="text-teal-600 hover:underline sendMail" data-id="{{$u->id}}"><i class="fa-solid fa-check"></i></a>
                     <a href="javascript:void(0)" class="hover:underline" onclick="confirmDelete({{ $u->id }})">
                            <i class="fa-solid fa-trash" style="color: red;"></i>
                        </a>

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
    
    Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // If user confirms
            $.ajax({
                url: "{{route('approve.voucher')}}",
                method: 'post',
                data: { "id": id, "_token": "{{csrf_token()}}" },
                dataType: 'JSON',
                success: function (datas) {
                    if (datas.status == 1) {
                        Swal.fire({
                            title: 'Done.',
                            icon: 'success',
                            text: datas.message
                        });
                        window.location.reload(true);
                    } else {
                        Swal.fire({
                            title: '',
                            icon: 'error',
                            text: datas.message
                        });
                    }
                },
                error: function () {
                    Swal.fire({
                        title: 'Error!',
                        icon: 'error',
                        text: 'Something went wrong. Please try again later.'
                    });
                }
            });
        }
    });
});

    </script>


<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    function confirmDelete(u) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Make the AJAX request
                fetch(`/admin/delete-item/${u}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire(
                            'Deleted!',
                            data.message,
                            'success'
                        ).then(() => {
                            // Optionally, reload the page or remove the item from the DOM
                            location.reload();
                        });
                    } else {
                        Swal.fire(
                            'Error!',
                            data.message,
                            'error'
                        );
                    }
                })
                .catch(error => {
                    Swal.fire(
                        'Error!',
                        'Something went wrong.',
                        'error'
                    );
                });
            }
        });
    }
</script>

@endpush