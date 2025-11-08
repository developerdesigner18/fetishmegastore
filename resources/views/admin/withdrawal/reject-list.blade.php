@extends('admin.base')

@section('section_title')
    <strong>{{ __(':type Management', ['type' => ucfirst($active)]) }}</strong>
@endsection

@section('section_body')
    <!-- Search Form -->
    <form method="GET" class="flex flex-wrap gap-2 mb-4 items-end">
        <div>
            <label for="search" class="sr-only">Search</label>
            <x-input name="search" id="search" class="w-52 block" type="text" placeholder="{{ __('Search...') }}" />
        </div>
        <div>
            <x-button>{{ __('Search') }}</x-button>
        </div>
    </form>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded shadow">
        <table class="w-full text-stone-600 border-collapse">
            <thead class="bg-gray-100 border-b">
                <tr>
                    <x-th>{{ __('ID') }}</x-th>
                    <x-th>{{ __('Username') }}</x-th>
                    <x-th>{{ __('Request Amount') }}</x-th>
                    <x-th>{{ __('Payment Type') }}</x-th>
                    <x-th>{{ __('Status') }}</x-th>
                    <x-th>{{ __('Actions') }}</x-th>
                </tr>
            </thead>
            <tbody>
            @forelse ($rejectList as $u)
                <tr class="border-b hover:bg-gray-50">
                    <x-td><x-slot name="field">ID</x-slot>{{ $u->id }}</x-td>
                    <x-td><x-slot name="field">Username</x-slot>{{ $u->user_id }}</x-td>
                    <x-td><x-slot name="field">Request Amount</x-slot>{{ $u->amount }}</x-td>
                    <x-td><x-slot name="field">Payment Type</x-slot>{{ $u->payment_type }}</x-td>
                    <x-td>
                        <x-slot name="field">Status</x-slot>
                       
                            {{ $u->status }}
                        
                    </x-td>

                    <x-td>
                        <x-slot name="field">Actions</x-slot>
                        <a href="{{ route('withdrawal.details', $u->id) }}" class="text-blue-600 hover:text-blue-800" title="View Details">
                            <i class="fas fa-eye"></i>
                        </a>
                    </x-td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center py-6 text-gray-500">
                        {{ __('No withdrawal data found') }}
                    </td>
                </tr>
            @endforelse
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    @if ($rejectList->hasPages())
        <div class="mt-4">
            {!! $rejectList->links('pagination::bootstrap-5') !!}
        </div>
    @endif
@endsection

@section('extra_bottom')
    @if ($errors->any())
        <div class="alert alert-danger mt-4">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
@endsection

@push('adminExtraJS')
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
<script src="{{ asset('js/jquery.min.js') }}"></script>
<script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
@endpush
