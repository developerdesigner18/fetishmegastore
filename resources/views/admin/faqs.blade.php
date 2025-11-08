@extends('admin.base')

@section('section_title')
    <strong>{{ __('Faqs') }}</strong>
@endsection

@section('section_body')

    <div>
        <a href="{{route('faq.add.view')}}"><x-button>Add Faq</x-button></a>

    </div>
    <hr class="my-3"/>

    @if (count($faqs) > 0)

        <table class="table border-collapse w-full bg-white text-stone-600 dataTable">
            <thead>
            <tr>
                <x-th>{{ __('ID') }}</x-th>
                <x-th>{{ __('Question') }}</x-th>
                <x-th>{{ __('Answer') }}</x-th>
                <x-th>{{ __('Order By') }}</x-th>
                <x-th>{{ __('Status') }}</x-th>
                <x-th>{{ __('Actions') }}</x-th>
            </tr>
            </thead>
            <tbody>
            @foreach ($faqs as $c)
                <tr>
                    <x-td>
                        <x-slot name="field">{{ __('ID') }}</x-slot>
                        {{ $c->id }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Question') }}</x-slot>
                        {{ $c->question }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Answer') }}</x-slot>
                        {{ $c->answer }}
                    </x-td>
                    
                     <x-td>
                        <x-slot name="field">{{ __('Order_By') }}</x-slot>
                        <input
                            type="number"
                            class="border border-gray-300 rounded px-2 py-1 w-20 order-input"
                            value="{{ $c->order_by }}"
                            data-id="{{ $c->id }}"
                        />
                    </x-td>

                    <x-td>
                        <x-slot name="field">{{ __('Status') }}</x-slot>
                        {{ $c->status == 1 ? 'Active' : 'Deactive' }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Actions') }}</x-slot>
                        <div class="btn-group">
                            <a class="inline-flex mr-2" href="{{route('faq.edit.view',['id' => $c->id])}}">
                                <i class="fa-solid fa-pencil text-teal-600"></i>
                            </a>
                            <a href="{{ route('faq.delete', ['id' => $c->id]) }}"
                            onclick="return confirm('{{ __('Are you sure you want to remove this FAQ from database?') }}');"
                            class="inline-flex">
                                <i class="fa-solid fa-trash text-red-400"></i>
                            </a>

                        </div>
                    </x-td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        {{ __('No Faqs in database.') }}
    @endif
@endsection

@push('adminExtraJS')
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    {{-- attention, dynamic because only needed on this page to save resources --}}
    
    <script>
    $(document).ready(function () {
        $('.dataTable').dataTable({ ordering: false });

        $('.dataTable').on('change', '.order-input', function () {
            const id = $(this).data('id');
            const orderBy = $(this).val();

            $.ajax({
                url: "{{ route('faq.update.order') }}",
                type: "POST",
                data: {
                    id: id,
                    order_by: orderBy,
                    _token: "{{ csrf_token() }}"
                },
                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: response.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                },
                error: function () {
                    Swal.fire('Error', 'Could not update order', 'error');
                }
            });
        });
    });
</script>

@endpush