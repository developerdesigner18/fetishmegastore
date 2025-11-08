@extends('admin.base')

@section('section_title')
    <strong>{{ __('Affiliate Tracks') }}</strong>
@endsection

@section('section_body')
    <hr class="my-3"/>

    @if ($affiliate_tracks->count() > 0)
        <table class="table border-collapse w-full bg-white text-stone-600 dataTable">
            <thead>
            <tr>
                <x-th>{{ __('ID') }}</x-th>
                <x-th>{{ __('User') }}</x-th>
                <x-th>{{ __('IP Address') }}</x-th>
                <x-th>{{ __('Affiliate Code') }}</x-th>
                <x-th>{{ __('Created At') }}</x-th>
            </tr>
            </thead>
            <tbody>
            @foreach ($affiliate_tracks as $c)
                <tr>
                    <x-td>
                        <x-slot name="field">{{ __('ID') }}</x-slot>
                        {{ $c->id }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('User') }}</x-slot>
                        {{ $c->user ? str_replace('_', ' ', $c->user->name) : '-' }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('IP Address') }}</x-slot>
                        {{ $c->ip_address }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Affiliate Code') }}</x-slot>
                        {{ $c->affiliate_code }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Created At') }}</x-slot>
                        {{ $c->created_at->format('Y-m-d H:i:s') }}
                        {{-- Alternatively: {{ $c->created_at->diffForHumans() }} --}}
                    </x-td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <p>{{ __('No affiliate tracks in database.') }}</p>
    @endif
@endsection

@push('adminExtraJS')
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
@endpush
