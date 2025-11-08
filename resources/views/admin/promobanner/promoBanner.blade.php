@extends('admin.base')

@section('section_title')
    <strong>{{ __('Promo Banner') }}</strong>
@endsection

@push('adminExtraCSS')
<style>
    .dataTables_wrapper .dataTables_filter input {
        margin-bottom: 10px !important;
    }

    .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 25px;
    margin-right: 10px;
    }

    .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    }

    .slider {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    border-radius: 25px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: .4s;
    }

    .slider:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
    }

    input:checked + .slider {
    background-color: #4CAF50;
    }

    input:checked + .slider:before {
    transform: translateX(24px);
    }

    .slider.round {
    border-radius: 25px;
    }

    .status-label {
    font-weight: bold;
    color: #333;
    }
    

</style>
@endpush

@section('section_body')

    <div class="flex justify-between items-center mb-4">
        <a href="{{ route('promoTools.add.PromoBanner') }}">
            <x-button>{{ __('Add Promo Banner') }}</x-button>
        </a>

        <div class="flex items-center space-x-2">
            <label for="goToPageInput" class="text-sm font-medium text-gray-700">Go to Page:</label>
            <input type="number" min="1" id="goToPageInput" class="border rounded px-2 py-1 w-20" placeholder="Page#"/>
            <button onclick="goToPage()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                Go
            </button>
        </div>
    </div>

    <hr class="my-3"/>

    @if ($promo_banners->count() > 0)
        <table class="table border-collapse w-full bg-white text-stone-600 dataTable" id="promoTable">
            <thead>
                <tr>
                    <x-th>{{ __('ID') }}</x-th>
                    <x-th>{{ __('Name') }}</x-th>
                    <x-th>{{ __('Category') }}</x-th>
                    <x-th>{{ __('Thumbnail Image') }}</x-th>
                    <x-th>{{ __('Status') }}</x-th>
                    <x-th>{{ __('Actions') }}</x-th>
                </tr>
            </thead>
            <tbody>
                @foreach ($promo_banners as $c)
                    <tr>
                        <x-td><x-slot name="field">{{ __('ID') }}</x-slot>{{ $c->id }}</x-td>
                        <x-td><x-slot name="field">{{ __('Name') }}</x-slot>{{ $c->name }}</x-td>
                        <x-td><x-slot name="field">{{ __('Category') }}</x-slot>{{ $c->category_names }}</x-td>
                        <x-td>
                            <x-slot name="field">{{ __('Thumbnail Image') }}</x-slot>
                            @if($c->thumbnail && file_exists(public_path($c->thumbnail)))
                                <img src="{{ asset($c->thumbnail) }}" alt="thumbnail" class="w-20 h-auto rounded shadow">
                            @else
                                <span class="text-gray-400">N/A</span>
                            @endif
                        </x-td>
                       <x-td>
                            <x-slot name="field">{{ __('Status') }}</x-slot>

                            <label class="switch">
                                <input 
                                    type="checkbox" 
                                    onchange="confirmStatusChange(this, '{{ route('promoTools.toggleStatus', ['id' => $c->id]) }}')"
                                    {{ $c->status == 1 ? 'checked' : '' }}
                                >
                                <span class="slider round"></span>
                            </label>
                            <span class="status-label" id="status-label-{{ $c->id }}">
                                {{ $c->status == 1 ? 'ON' : 'OFF' }}
                            </span>
                        </x-td>


                        <x-td>
                            <x-slot name="field">{{ __('Actions') }}</x-slot>
                            <div class="flex space-x-2">
                                <a href="{{ route('promoTools.edit.PromoBanner', ['id' => $c->id]) }}"
                                   class="text-blue-600 hover:text-blue-800">
                                    <i class="fa-solid fa-pencil"></i>
                                </a>
                               <!-- <a href="javascript:void(0);" class="text-red-500 hover:text-red-700"
                                   onclick="confirmDelete('{{ route('promoTools.delete', ['id' => $c->id]) }}')">
                                    <i class="fa-solid fa-trash"></i>
                                </a> -->
                                <a href="javascript:void(0);" class="text-red-500 hover:text-red-700"
                                   onclick="confirmDelete('{{ route('promoTools.delete', ['id' => $c->id, 'page' => request('page')]) }}')">
                                   <i class="fa-solid fa-trash"></i>
                                </a>

                            </div>
                        </x-td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        {{-- Laravel pagination links --}}
        <div class="mt-4">
            {{ $promo_banners->links() }}
        </div>

    @else
        <p class="text-gray-500">{{ __('No Promo Banner in database.') }}</p>
    @endif

@endsection

@push('adminExtraJS')
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script>
    $(document).ready(function () {
        $('#promoTable').DataTable({
            responsive: true,
            paging: false,
            info: false
        });
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');
        if (currentPage) {
            document.getElementById('goToPageInput').value = currentPage;
        }
    });

    function confirmDelete(url) {
        Swal.fire({
            title: 'Are you sure?',
            text: "This promo banner will be deleted permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = url;
            }
        });
    }

   function confirmStatusChange(checkbox, url) {
        const originalState = !checkbox.checked;
        checkbox.checked = originalState;
        Swal.fire({
            title: 'Change Status?',
            text: "Do you want to turn this banner " + (originalState ? 'ON' : 'OFF') + "?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = url;
            } else {
                checkbox.checked = !originalState;
            }
        });
    }

    function goToPage() {
        let page = parseInt(document.getElementById('goToPageInput').value);
        if (!page || page < 1) {
            Swal.fire('Invalid Page', 'Please enter a valid page number.', 'error');
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        window.location.href = url.toString();
    }
</script>

@endpush
