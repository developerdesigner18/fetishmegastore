@extends('admin.base')

@section('section_title')
    <strong>{{ __('Unsubscribe Reasons Configuration') }}</strong>
@endsection

@section('section_body')
    @include('admin.configuration-navi')

    <div class="bg-white rounded p-3 text-stone-600">
        <form method="POST" enctype="multipart/form-data">
            @csrf

            <div class="mt-5">
                <dt class="font-semibold text-stone-600 mb-2">{{ __('Reason Options') }}</dt>

                <div id="reasonRepeater" class="space-y-2">
                    @php
                        $reasons = json_decode(opt('reason', '[]'), true) ?? [];
                    @endphp

                    @foreach ($reasons as $reason)
                        <div class="flex items-center space-x-2">
                            <x-input type="text" name="reasons[]" value="{{ $reason }}" class="w-full" />
                            <button type="button" class="removeReason text-red-500 font-bold px-2">×</button>
                        </div>
                    @endforeach

                    @if (empty($reasons))
                        <div class="flex items-center space-x-2">
                            <x-input type="text" name="reasons[]" class="w-full" />
                            <button type="button" class="removeReason text-red-500 font-bold px-2">×</button>
                        </div>
                    @endif
                </div>

                <button type="button" id="addReason" class="mt-3 text-sm text-blue-600 font-semibold">
                    + {{ __('Add Reason') }}
                </button>
            </div>

            <div class="flex w-full my-4">
                <x-button>{{ __('Save Reasons') }}</x-button>
            </div>
        </form>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const repeater = document.getElementById('reasonRepeater');
            document.getElementById('addReason').addEventListener('click', () => {
                const div = document.createElement('div');
                div.className = 'flex items-center space-x-2 mt-2';
                div.innerHTML = `
                    <input type="text" name="reasons[]" class="w-full border rounded px-2 py-1" />
                    <button type="button" class="removeReason text-red-500 font-bold px-2">×</button>
                `;
                repeater.appendChild(div);
            });

            repeater.addEventListener('click', function (e) {
                if (e.target.classList.contains('removeReason')) {
                    e.target.parentElement.remove();
                }
            });
        });
    </script>
@endsection
