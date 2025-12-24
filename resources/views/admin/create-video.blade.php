@extends('admin.base')

@section('section_title')
    {{ __('Create New Video') }}
    <br/>

    <a href="/admin/videos" class="text-indigo-700 hover:underline font-semibold">&raquo; {{ __('Back To Videos') }}</a>
@endsection

@section('section_body')
    <style>
        /* Chrome, Safari, Edge, Opera */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* Firefox */
        input[type=number] {
            -moz-appearance: textfield;
        }

    </style>
    <div class="bg-white rounded-lg shadow-sm p-6 text-stone-600">
        <form method="POST" enctype="multipart/form-data" action="{{ route('admin.videos.store') }}">
            @csrf

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                    <!-- Streamer Selection -->
                    <div>
                        <x-label>{{ __("Select Streamer") }}</x-label>
                        <select name="user_id" class="w-full streamerSelector" required>
                            <option value="">-- {{ __("Select Streamer") }} --</option>
                            @foreach($streamers as $streamer)
                                <option value="{{ $streamer->id }}" {{ old('user_id') == $streamer->id ? 'selected' : '' }}>{{ $streamer->username }} ({{ $streamer->name }})</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Title Section -->
                    <div>
                        <x-label>{{ __("Title Eng") }}</x-label>
                        <x-input id="title" class="block mt-1 w-full" type="text"
                                 value="{{ old('title') }}"
                                 name="title" required/>
                    </div>

                    <div>
                        <x-label>{{ __("Select Language for Title") }}</x-label>
                        <select name="title_lang" id="title_lang_selector" class="w-full">
                            <option value="">-- No Language --</option>
                            @foreach($supportedLocales as $locale)
                                <option value="{{ $locale['lang_value'] }}" {{ old('title_lang') == $locale['lang_value'] ? 'selected' : '' }}>
                                    {{ $locale['lang_name'] }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Dynamic Title Input (default mein hidden) -->
                    <div id="title_de_wrapper" style="display: none;">
                        <x-label id="title_de_label">{{ __("Title") }}</x-label>
                        <x-input id="title_de" class="block mt-1 w-full" type="text" value="{{ old('title_de') }}" name="title_de"/>
                    </div>

                    <!-- Category -->
                    <div>
                        <x-label>{{ __("Category") }}</x-label>
                        <select name="category_id[]" class="w-full multiSelector" multiple required>
                            @foreach($video_categories as $c)
                                <option value="{{ $c->id }}" {{ in_array($c->id, old('category_id', [])) ? 'selected' : '' }}>{{ $c->category }}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Model -->
                    <div>
                        <x-label>{{ __("Model") }}</x-label>
                        <select name="model_id[]" class="w-full multiSelectorModel" multiple="">
                            @foreach($models as $modelDetails)
                                <option value="{{ $modelDetails->id }}" {{ in_array($modelDetails->id, old('model_id', [])) ? 'selected' : '' }}>{{ $modelDetails->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Tags -->
                    <div>
                        <x-label>{{ __("Tags") }}</x-label>
                        <select name="tags[]" class="w-full multiSelectorTag" multiple>
                            @foreach($tags as $tagDetails)
                                <option value="{{ $tagDetails->name }}" {{ in_array($tagDetails->name, old('tags', [])) ? 'selected' : '' }}>{{ $tagDetails->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Free for subs -->
                    <div>
                        <x-label>{{ __("Free for subscribers?") }}</x-label>
                        <x-select name="free_for_subs" class="w-full" required>
                            <option value="yes" {{ old('free_for_subs') == 'yes' ? 'selected' : '' }}>{{ __("Yes") }}</option>
                            <option value="no" {{ old('free_for_subs', 'no') == 'no' ? 'selected' : '' }}>{{ __("No") }}</option>
                        </x-select>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                    <!-- Thumbnail -->
                    <div>
                        <x-label>{{ __("Thumbnail") }}</x-label>
                        <x-input id="thumbnail" class="block mt-1 w-full" type="file" name="thumbnail" required/>
                    </div>

                    <!-- Select video from ftp? Toggle -->
                    <div class="flex items-center space-x-3 mb-3">
                        <input type="checkbox" id="ftpToggle" class="form-checkbox h-5 w-5 text-blue-600">
                        <label for="ftpToggle" class="cursor-pointer font-medium">{{ __("Select video from ftp?") }}</label>
                    </div>

                    <!-- Video Section -->
                    <div>
                        <x-label>{{ __("Video") }}</x-label>

                        <!-- Video Selector (shown when FTP toggle is ON) -->
                        <div id="videoSelector" style="display: none;">
                            <select id="videoSelect" class="w-full fileSelector">
                                <option value="">-- {{ __("Select Video File") }} --</option>
                                @foreach($fileNames as $fileName)
                                    <option value="{{$fileName['value']}}" {{ old('video') == $fileName['value'] ? 'selected' : '' }}>{{$fileName['label']}}</option>
                                @endforeach
                            </select>
                        </div>

                        <!-- Video File Upload (shown when FTP toggle is OFF) -->
                        <div id="videoUpload">
                            <x-label class="text-sm text-gray-600">{{ __("Video File") }}</x-label>
                            <x-input type="file" id="videoFileInput" class="block mt-1 w-full" accept="video/*"/>
                        </div>
                    </div>

                    <!-- Price -->
                    <div>
                        <x-label>{{ __("Price") }}</x-label>
                        <x-input id="price" class="block mt-1 w-full" type="number"
                                 value="{{ old('price', 0) }}"  name="price" step="any" required/>
                    </div>

                    <!-- Description -->
                    <div>
                        <x-label>{{ __("Description") }}</x-label>
                        <x-textarea id="description_en" class="block mt-1 w-full" name="description">{{ old('description') }}</x-textarea>
                    </div>

                    <div>
                        <x-label>{{ __("Select Additional Language for Description") }}</x-label>
                        <select name="description_lang" id="description_lang_selector" class="w-full">
                            <option value="">-- No Additional Language --</option>
                            @foreach($supportedLocales as $locale)
                                <option value="{{ $locale['lang_value'] }}" {{ old('description_lang') == $locale['lang_value'] ? 'selected' : '' }}>
                                    {{ $locale['lang_name'] }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Dynamic Description Input (default mein hidden) -->
                    <div id="description_de_wrapper" style="display: none;">
                        <x-label id="description_de_label">{{ __("Description") }}</x-label>
                        <x-textarea id="description_de" class="block mt-1 w-full" name="description_de">{{ old('description_de') }}</x-textarea>
                    </div>
                </div>
            </div>

            <!-- SEO Section -->
            <div class="mt-8 border-t pt-6">
                <h3 class="text-lg font-medium mb-4">SEO Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- English SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">English</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[h2]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[keyword]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[meta_keyword]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[desc]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- German SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">German</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[de][h2]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[de][keyword]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[de][meta_keyword]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[de][desc]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- Common SEO Fields -->
                    <div class="col-span-2 grid grid-cols-1 grid-cols-1 gap-6">
                        <div>
                            <label for="og-title" class="block text-sm font-medium text-gray-700">OG Title:</label>
                            <input id="og-title" type="text" name="seo[og_title]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-desc" class="block text-sm font-medium text-gray-700">OG Description:</label>
                            <input id="og-desc" type="text" name="seo[og_desc]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="meta-robot" class="block text-sm font-medium text-gray-700">Meta Robot:</label>
                            <input id="meta-robot" type="text" name="seo[meta_robot]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="cust-url" class="block text-sm font-medium text-gray-700">Custom URL:</label>
                            <input id="cust-url" type="text" name="seo[cust_url]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-image-url" class="block text-sm font-medium text-gray-700">OG Image URL:</label>
                            <input id="og-image-url" type="text" name="seo[og_image_url]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="json-id" class="block text-sm font-medium text-gray-700">JSON ID:</label>
                            <input id="json-id" type="text" name="seo[json_id]" value=""
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-6">
                <x-button class="w-full md:w-auto">{{ __('Create Video') }}</x-button>
            </div>
        </form>
    </div>

@endsection
@push('adminExtraJS')
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script !src="">
        var settings = {};
        new TomSelect('.multiSelector',settings);
        new TomSelect('.multiSelectorTag',settings);
        new TomSelect('.multiSelectorModel',settings);
        new TomSelect('.fileSelector',settings);
        new TomSelect('.streamerSelector',settings);
    </script>
    <script>
        function setupLanguageField(selectorId, wrapperId, inputId, labelId) {
            const selector = $(`#${selectorId}`);
            const wrapper = $(`#${wrapperId}`);
            const input = $(`#${inputId}`);
            const label = $(`#${labelId}`);

            function updateVisibility() {
                const selectedLang = selector.val();
                if (selectedLang) {
                    const langName = selector.find('option:selected').text();
                    label.text(`Title (${langName})`);
                    wrapper.slideDown();
                } else {
                    wrapper.slideUp();
                    input.val('');
                }
            }

            // Dropdown ke change hone par function call karo
            selector.on('change', updateVisibility);

            // Page load hone par bhi ek baar function call karo
            updateVisibility();
        }

        $(document).ready(function() {
            setupLanguageField('title_lang_selector', 'title_de_wrapper', 'title_de', 'title_de_label');
            setupLanguageField('description_lang_selector', 'description_de_wrapper', 'description_de', 'description_de_label');

            // FTP Toggle functionality
            const ftpToggle = $('#ftpToggle');
            const videoSelector = $('#videoSelector');
            const videoUpload = $('#videoUpload');
            const videoSelect = $('#videoSelect');
            const videoFileInput = $('#videoFileInput');

            // Check if there's an old video value (FTP was selected)
            const oldVideo = "{{ old('video') }}";
            const oldVideoFile = "{{ old('video_file') }}";

            // Restore FTP toggle state if video was selected from FTP
            if (oldVideo) {
                ftpToggle.prop('checked', true);
            }

            // Function to toggle video input method
            function toggleVideoInput() {
                if (ftpToggle.is(':checked')) {
                    // Show FTP selector, hide file upload
                    videoSelector.slideDown();
                    videoUpload.slideUp();
                    videoSelect.prop('required', true);
                    videoFileInput.prop('required', false);
                    videoFileInput.val(''); // Clear file input
                    // Remove name from file input so it's not submitted
                    videoFileInput.removeAttr('name');
                    videoSelect.attr('name', 'video');
                } else {
                    // Show file upload, hide FTP selector
                    videoSelector.slideUp();
                    videoUpload.slideDown();
                    videoSelect.prop('required', false);
                    videoFileInput.prop('required', true);
                    videoSelect.val(''); // Clear selector
                    // Remove name from selector so it's not submitted
                    videoSelect.removeAttr('name');
                    videoFileInput.attr('name', 'video_file');
                }
            }

            // Initial state (file upload shown by default)
            toggleVideoInput();

            // Toggle on change
            ftpToggle.on('change', toggleVideoInput);
        });
    </script>
@endpush
