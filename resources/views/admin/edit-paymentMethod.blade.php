@extends('admin.base')

@section('section_title')
    <strong>{{ __('Payment Method') }}</strong>
@endsection


@section('section_body')

    <form method="POST" action="{{route('payment_method.update',['id' => $payment_method->id])}}"
          enctype="multipart/form-data">
        {{ csrf_field() }}
    <div class="bg-white rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div class="shadow-sm p-3 text-stone-600">
            <x-label>{{ __("Name") }}</x-label>
            <x-input id="name" class="block mt-0 w-full" type="text" name="name" value="{{ $payment_method->name }}" required />
        </div>
        <div class="shadow-sm p-3 text-stone-600">
            <x-label>{{ __("Environment") }}</x-label>
            <div class="flex items-center">
                <label class="mr-4">
                    <input type="radio" name="environment" value="Sandbox" class="mr-2" {{ $payment_method->environment == 'Sandbox' ? 'checked' : '' }} />
                    {{ __("Sandbox") }}
                </label>
                <label>
                    <input type="radio" name="environment" value="Live" class="mr-2" {{ $payment_method->environment == 'Live' ? 'checked' : '' }} />
                    {{ __("Live") }}
                </label>
            </div>
        </div>
        <div class="shadow-sm p-3 text-stone-600">
            <x-label>{{ __("Is Recurring") }}</x-label>
            <div class="flex items-center">
                <label class="mr-4">
                    <input type="radio" name="is_recurring" value="0" class="mr-2" {{ $payment_method->is_recurring == '0' ? 'checked' : '' }} />
                    {{ __("OFF") }}
                </label>
                <label>
                    <input type="radio" name="is_recurring" value="1" class="mr-2" {{ $payment_method->is_recurring == '1' ? 'checked' : '' }} />
                    {{ __("ON") }}
                </label>
            </div>
        </div>
        </div>
        
     
    <div class="col-span-12 shadow-sm p-3 text-stone-600">
        <x-label>{{ __("Sandbox Credentials") }}</x-label>
        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th class="border px-2 py-1">{{ __("#") }}</th>
                    <th class="border px-2 py-1">{{ __("Key") }}</th>
                    <th class="border px-2 py-1">{{ __("Value") }}</th>
                    <th class="border px-2 py-1">{{ __("Action") }}</th>
                </tr>
            </thead>
            <tbody id="sandbox-credentials-repeater">
        @php
            // Ensure sandbox_credentials is a valid array
            $sandboxCredentials = is_string($payment_method->sandbox_credentials)
                ? json_decode(stripslashes($payment_method->sandbox_credentials), true)
                : $payment_method->sandbox_credentials;
        @endphp

        @if (!empty($sandboxCredentials))
            @foreach ($sandboxCredentials as $index => $sandboxCredential)
                <tr>
                    <td class="border px-2 py-1">{{ $index + 1 }}</td>
                    <td class="border px-2 py-1">
                        <input type="text" name="sandbox_keys[]" class="w-full border px-2 py-1" value="{{ $sandboxCredential['key'] }}" placeholder="Key" />
                    </td>
                    <td class="border px-2 py-1">
                        <input type="text" name="sandbox_values[]" class="w-full border px-2 py-1" value="{{ $sandboxCredential['value'] }}" placeholder="Value" />
                    </td>
                    <td class="border px-2 py-1 text-center">
                        <button type="button" class="remove-row bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                    </td>
                </tr>
            @endforeach
        @endif
    </tbody>

        </table>
        <button type="button" class="add-more-sandbox bg-green-500 text-white px-2 py-1 rounded mt-2">Add More</button>
    </div>


    <div class="col-span-12 shadow-sm p-3 text-stone-600">
        <x-label>{{ __("Live Credentials") }}</x-label>
        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th class="border px-2 py-1">{{ __("#") }}</th>
                    <th class="border px-2 py-1">{{ __("Key") }}</th>
                    <th class="border px-2 py-1">{{ __("Value") }}</th>
                    <th class="border px-2 py-1">{{ __("Action") }}</th>
                </tr>
            </thead>
            <tbody id="live-credentials-repeater">
        @if (!empty($payment_method->live_credentials))
            @php
                // Check if live_credentials is a JSON string or already an array
                $liveCredentials = is_string($payment_method->live_credentials) 
                ? json_decode(stripslashes($payment_method->live_credentials), true) 
                : $payment_method->live_credentials;
            @endphp

            @foreach ($liveCredentials as $index => $liveCredential)
                <tr>
                    <td class="border px-2 py-1">{{ $index + 1 }}</td>
                    <td class="border px-2 py-1">
                        <input type="text" name="live_keys[]" class="w-full border px-2 py-1" value="{{ $liveCredential['key'] }}" placeholder="Key" />
                    </td>
                    <td class="border px-2 py-1">
                        <input type="text" name="live_values[]" class="w-full border px-2 py-1" value="{{ $liveCredential['value'] }}" placeholder="Value" />
                    </td>
                    <td class="border px-2 py-1 text-center">
                        <button type="button" class="remove-row bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                    </td>
                </tr>
            @endforeach
        @endif
    </tbody>

        </table>
        <button type="button" class="add-more-live bg-green-500 text-white px-2 py-1 rounded mt-2">Add More</button>
    </div>
    <div class="col-span-12 shadow-sm p-3 text-stone-600">
            <x-label>{{ __("Status") }}</x-label>
            <div class="flex items-center">
                <label class="mr-4">
                    <input type="radio" name="status" value="1" class="mr-2" {{ $payment_method->status == '1' ? 'checked' : '' }} />
                    {{ __("Active") }}
                </label>
                <label>
                    <input type="radio" name="status" value="0" class="mr-2" {{ $payment_method->status == '0' ? 'checked' : '' }} />
                    {{ __("Deactive") }}
                </label>
            </div>
    </div>
    </div>


    <div class="ml-3">
        <x-button>{{ __('Update') }}</x-button>
    </div>
    

    </form>

    <hr class="my-3"/>

    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
@endsection
@push('adminExtraJS')
<script>
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".add-more-sandbox").addEventListener("click", function () {
        const repeater = document.getElementById("sandbox-credentials-repeater");
        const rowCount = repeater.rows.length + 1;

        const newRow = `
            <tr>
                <td class="border px-2 py-1">${rowCount}</td>
                <td class="border px-2 py-1">
                    <input type="text" name="sandbox_keys[]" class="w-full border px-2 py-1" placeholder="Key" />
                </td>
                <td class="border px-2 py-1">
                    <input type="text" name="sandbox_values[]" class="w-full border px-2 py-1" placeholder="Value" />
                </td>
                <td class="border px-2 py-1 text-center">
                    <button type="button" class="remove-row bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                </td>
            </tr>`;
        repeater.insertAdjacentHTML("beforeend", newRow);
    });
    document.querySelector(".add-more-live").addEventListener("click", function () {
        const repeater = document.getElementById("live-credentials-repeater");
        const rowCount = repeater.rows.length + 1;

        const newRow = `
            <tr>
                <td class="border px-2 py-1">${rowCount}</td>
                <td class="border px-2 py-1">
                    <input type="text" name="live_keys[]" class="w-full border px-2 py-1" placeholder="Key" />
                </td>
                <td class="border px-2 py-1">
                    <input type="text" name="live_values[]" class="w-full border px-2 py-1" placeholder="Value" />
                </td>
                <td class="border px-2 py-1 text-center">
                    <button type="button" class="remove-row bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                </td>
            </tr>`;
        repeater.insertAdjacentHTML("beforeend", newRow);
    });

    document.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("remove-row")) {
            e.target.closest("tr").remove();
        }
    });
});
</script>
@endpush
