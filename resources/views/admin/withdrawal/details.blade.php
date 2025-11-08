@extends('admin.base')

@section('section_title')
    <strong>{{ __('Withdrawal Details') }}</strong>
@endsection

@section('section_body')
<div class="bg-white rounded shadow p-6 space-y-6">
    <h2 class="text-xl font-bold text-gray-800 border-b pb-3">{{ __('Withdrawal Request Information') }}</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <p class="text-sm text-gray-500">{{ __('User Name') }}</p>
            <p class="text-lg font-semibold">{{ $payout->user->name ?? 'N/A' }}</p>
        </div>
        <div>
            <p class="text-sm text-gray-500">{{ __('User Email') }}</p>
            <p class="text-lg font-semibold">{{ $payout->user->email ?? 'N/A' }}</p>
        </div>
        <!-- <div>
            <p class="text-sm text-gray-500">{{ __('User ID') }}</p>
            <p class="text-lg font-semibold">{{ $payout->user_id }}</p>
        </div> -->
        <div>
            <p class="text-sm text-gray-500">{{ __('Payment Type') }}</p>
            <p class="text-lg font-semibold">{{ ucfirst($payout->payment_type) }}</p>
        </div>
        @if($payout->email)
        <div>
            <p class="text-sm text-gray-500">{{ __('Payment Email') }}</p>
            <p class="text-lg font-semibold">{{ $payout->email }}</p>
        </div>
        @endif
        @if($payout->wallet_address)
        <div>
            <p class="text-sm text-gray-500">{{ __('Payment Wallet Address') }}</p>
            <p class="text-lg font-semibold">{{ $payout->wallet_address }}</p>
        </div>
        @endif
        @if($payout->iban_code)
        <div>
            <p class="text-sm text-gray-500">{{ __('Payment IBAN Code') }}</p>
            <p class="text-lg font-semibold">{{ $payout->iban_code }}</p>
        </div>
        @endif
        @if($payout->swift_code)
        <div>
            <p class="text-sm text-gray-500">{{ __('Payment Swift code') }}</p>
            <p class="text-lg font-semibold">{{ $payout->swift_code }}</p>
        </div>
        @endif
        <div>
            <p class="text-sm text-gray-500">{{ __('Requested Amount') }}</p>
            <p class="text-lg font-semibold">{{ $currency }}{{ number_format($payout->amount, 2) }}</p>
        </div>
        <div>
            <p class="text-sm text-gray-500">{{ __('Status') }}</p>
            <span class="px-3 py-1 text-sm rounded-full 
                @if($payout->status == 'approved') bg-green-100 text-green-700
                @elseif($payout->status == 'reject') bg-red-100 text-red-700
                @else bg-yellow-100 text-yellow-700 @endif">
                {{ ucfirst($payout->status) }}
            </span>
        </div>
        @if($payout->approved_amount)
        <div>
            <p class="text-sm text-gray-500">{{ __('Approved Amount') }}</p>
            <p class="text-lg font-semibold">{{ $currency }}{{ number_format($payout->approved_amount, 2) }}</p>
        </div>
        @endif
        <div>
            <p class="text-sm text-gray-500">{{ __('Created At') }}</p>
            <p class="text-lg font-semibold">{{ $payout->created_at->format('d M Y h:i A') }}</p>
        </div>
       @if($payout->approved_at)
            <div>
                <p class="text-sm text-gray-500">{{ __('Approved At') }}</p>
                <p class="text-lg font-semibold">{{ \Carbon\Carbon::parse($payout->approved_at)->format('d M Y h:i A') }}</p>
            </div>
        @endif
    </div>
</div>


<div class="bg-white rounded shadow p-6 mt-6">
    <h2 class="text-xl font-bold text-gray-800 border-b pb-3">{{ __('User Account Info') }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
            <p class="text-sm text-gray-500">{{ __('Current Total Commission(Balance):') }}</p>
            <p class="text-lg font-semibold">{{ $currency }}{{ number_format($balance, 2) }}</p>
        </div>
    </div>
</div>

<div class="mt-6 flex space-x-4">
    <a href="{{ route('withdrawal.index') }}" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
        {{ __('Back to List') }}
    </a>
</div>
@endsection
