@extends('admin.base')

@section('section_title')
    <strong>{{ __('Payment Methods') }}</strong>
@endsection

@section('section_body')

<form method="POST" action="{{ route('payment_method.add') }}" enctype="multipart/form-data">
    {{ csrf_field() }}
    <div class="bg-white rounded-lg grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6">
        
        <!-- Name field -->
        <div class="shadow-sm p-3 text-stone-600">
            <x-label>{{ __("Name") }}</x-label>
            <x-input id="name" class="block mt-0 w-full" type="text" name="name" required />
        </div>

        <!-- Environment field (Radio buttons for Sandbox and Live) -->
        <div class="shadow-sm p-3 text-stone-600">
            <x-label>{{ __("Environment") }}</x-label>
            <div class="flex items-center">
                <label class="mr-4">
                    <input type="radio" name="environment" value="Sandbox" class="mr-2" checked />
                    {{ __("Sandbox") }}
                </label>
                <label>
                    <input type="radio" name="environment" value="Live" class="mr-2" />
                    {{ __("Live") }}
                </label>
            </div>
        </div>

        <!-- Is Recurring field (Radio buttons for ON and OFF) -->
        <div class="shadow-sm p-3 text-stone-600">
            <x-label>{{ __("Is Recurring") }}</x-label>
            <div class="flex items-center">
                <label class="mr-4">
                    <input type="radio" name="is_recurring" value="0" class="mr-2" checked />
                    {{ __("OFF") }}
                </label>
                <label>
                    <input type="radio" name="is_recurring" value="1" class="mr-2" />
                    {{ __("ON") }}
                </label>
            </div>
        </div>
        </div>
        <div class="bg-white rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-6">
    <!-- Sandbox Credentials Section -->
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
                <tr>
                    <td class="border px-2 py-1">1</td>
                    <td class="border px-2 py-1">
                        <input type="text" name="sandbox_keys[]" class="w-full border px-2 py-1" placeholder="Key" />
                    </td>
                    <td class="border px-2 py-1">
                        <input type="text" name="sandbox_values[]" class="w-full border px-2 py-1" placeholder="Value" />
                    </td>
                    <td class="border px-2 py-1 text-center">
                        <button type="button" class="add-more-sandbox bg-green-500 text-white px-2 py-1 rounded">Add More</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Live Credentials Section -->
    <div class="col-span-12 shadow-sm p-3 text-stone-600 mt-6">
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
                <tr>
                    <td class="border px-2 py-1">1</td>
                    <td class="border px-2 py-1">
                        <input type="text" name="live_keys[]" class="w-full border px-2 py-1" placeholder="Key" />
                    </td>
                    <td class="border px-2 py-1">
                        <input type="text" name="live_values[]" class="w-full border px-2 py-1" placeholder="Value" />
                    </td>
                    <td class="border px-2 py-1 text-center">
                        <button type="button" class="add-more-live bg-green-500 text-white px-2 py-1 rounded">Add More</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="col-span-12 shadow-sm p-3 text-stone-600 mt-6">
        <x-label>{{ __("Status") }}</x-label>
            <div class="flex items-center">
                <label class="mr-4">
                    <input type="radio" name="status" value="1" class="mr-2" checked />
                    {{ __("Active") }}
                </label>
                <label>
                    <input type="radio" name="status" value="0" class="mr-2" />
                    {{ __("Deactive") }}
                </label>
            </div>
        
    </div>
</div>



    <div class="ml-3">
        <x-button>{{ __('Save') }}</x-button>
    </div>
</form>


    <hr class="my-3"/>
    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
@endsection
@push('adminExtraJS')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Function to update row numbers dynamically
        function updateRowNumbers(repeaterId) {
            const rows = document.querySelectorAll(`#${repeaterId} tr`);
            rows.forEach((row, index) => {
                row.querySelector('td:first-child').textContent = index + 1;
            });
        }

        // Add more rows to Sandbox Credentials
        document.querySelector('.add-more-sandbox').addEventListener('click', function () {
            const repeater = document.getElementById('sandbox-credentials-repeater');
            const newRow = repeater.rows[0].cloneNode(true);
            newRow.querySelector('input[name="sandbox_keys[]"]').value = '';
            newRow.querySelector('input[name="sandbox_values[]"]').value = '';
            newRow.querySelector('.add-more-sandbox').className = 'remove-row bg-red-500 text-white px-2 py-1 rounded';
            newRow.querySelector('.remove-row').textContent = 'Remove';
            repeater.appendChild(newRow);
            updateRowNumbers('sandbox-credentials-repeater');
        });

        // Add more rows to Live Credentials
        document.querySelector('.add-more-live').addEventListener('click', function () {
            const repeater = document.getElementById('live-credentials-repeater');
            const newRow = repeater.rows[0].cloneNode(true);
            newRow.querySelector('input[name="live_keys[]"]').value = '';
            newRow.querySelector('input[name="live_values[]"]').value = '';
            newRow.querySelector('.add-more-live').className = 'remove-row bg-red-500 text-white px-2 py-1 rounded';
            newRow.querySelector('.remove-row').textContent = 'Remove';
            repeater.appendChild(newRow);
            updateRowNumbers('live-credentials-repeater');
        });

        // Remove row functionality
        document.addEventListener('click', function (e) {
            if (e.target && e.target.classList.contains('remove-row')) {
                const repeaterId = e.target.closest('tbody').id;
                e.target.closest('tr').remove();
                updateRowNumbers(repeaterId);
            }
        });
    });
</script>

@endpush