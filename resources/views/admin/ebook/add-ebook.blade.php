@extends('admin.base')

@section('section_title')
    <strong>{{ __('Upload New Ebook') }}</strong>
    <br/>
    <a href="{{ route('admin.ebooks') }}" class="text-indigo-700 hover:underline font-semibold">&raquo; {{ __('Back To Ebooks') }}</a>
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
        <form method="POST" enctype="multipart/form-data" action="{{ route('admin.ebooks.store') }}">
            @csrf

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                    <!-- Title Section -->
                    <div>
                        <x-label for="title_en" class="block text-sm font-medium text-danger">Title Eng</x-label>
                        <x-input id="title_en" class="block mt-1 w-full" type="text"
                                 value="{{ old('title_en', '') }}"
                                 name="title_en" required/>
                        @error('title_en') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <x-label for="title_lang_selector" class="block text-sm font-medium text-danger">Select Language for Title</x-label>
                        <select name="title_lang" id="title_lang_selector" class="w-full">
                            <option value="">{{"-- No Language --"}}</option>
                            @foreach($supportedLocales as $locale)
                                <option value="{{ $locale['lang_value'] }}" @if(old('title_lang') == $locale['lang_value']) selected @endif>
                                    {{ $locale['lang_name'] }}
                                </option>
                            @endforeach
                        </select>
                        @error('title_lang') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <!-- Dynamic Title Input (default mein hidden) -->
                    <div id="title_de_wrapper" style="display: none;">
                        <x-label for="title_de" id="title_de_label" class="block text-sm font-medium text-danger">{{ __("Title (Translated)") }}</x-label>
                        <x-input id="title_de" class="block mt-1 w-full" type="text" value="{{ old('title_de', '') }}" name="title_de"/>
                        @error('title_de') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <x-label for="streamer_selector" class="block text-sm font-medium text-danger">Select Streamer</x-label>
                        <select name="streamer" id="streamer_selector" class="w-full">
                            <option value="">{{"-- No Streamer --"}}</option>
                            @foreach($streamers as $streamer)
                                <option value="{{ $streamer->id }}">
                                    {{ $streamer->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('streamer') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <!-- Category -->
                    <div>
                        <x-label for="category" class="block text-sm font-medium text-danger">Category</x-label>
                        @php
                            $selectedCategories = old('category_id', []);
                        @endphp
                        <select name="category_id[]" class="w-full multiSelector" multiple required>
                            @foreach($categories as $c)
                                <option value="{{ $c['value'] }}">{{ $c['label'] }}</option>
                            @endforeach
                        </select>
                        @error('category_id') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        @error('category_id.*') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <!-- Model -->
                    <div>
                        <x-label for="model" class="block text-sm font-medium text-danger">Model</x-label>
                        @php
                            $selectedModels = old('model_id', []);
                        @endphp
                        <select name="model_id[]" class="w-full multiSelectorModel" multiple>
                            @foreach($models as $modelDetails)
                                <option value="{{ $modelDetails['value'] }}">{{ $modelDetails['label'] }}</option>
                            @endforeach
                        </select>
                        @error('model_id') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        @error('model_id.*') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <!-- Tags -->
                    <div>
                        <x-label for="tags" class="block text-sm font-medium text-danger">Tags</x-label>
                        @php
                            $selectedTags = old('tags', []);
                        @endphp
                        <select name="tags[]" class="w-full multiSelectorTag" multiple>
                            @foreach($tags as $tagDetails)
                                <option value="{{ $tagDetails['value'] }}">{{ $tagDetails['label'] }}</option>
                            @endforeach
                        </select>
                        @error('tags') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        @error('tags.*') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <!-- Free for subs -->
                    <div>
                        <x-label for="free_for_subs" class="block text-sm font-medium text-danger">Free for subscribers</x-label>
                        <x-select name="free_for_subs" class="w-full" required>
                            <option value="yes" @if(old('free_for_subs') == "yes") selected @endif>{{ __("Yes") }}</option>
                            <option value="no" @if(old('free_for_subs') == "no") selected @endif>{{ __("No") }}</option>
                        </x-select>
                        @error('free_for_subs') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                    <!-- Thumbnail -->
                    <div>
                        <x-label for="thumbnail" class="block text-sm font-medium text-danger">Thumbnail</x-label>
                        <x-input id="thumbnail" class="block mt-1 w-full" type="file" name="thumbnail" required/>
                        @error('thumbnail') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <!-- Ebook File Selector (FTP or Local Upload) -->
                    <div>
                        <x-label>{{ __("Ebook File Source") }}</x-label>
                        <div class="flex items-center space-x-4 mb-2">
                            <label class="inline-flex items-center">
                                <input type="radio" name="file_source_type" value="local" class="form-radio" @if(old('file_source_type') == 'local' || !old('file_source_type')) checked @endif>
                                <span class="ml-2">{{ __("Upload Local File") }}</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="radio" name="file_source_type" value="ftp" class="form-radio" @if(old('file_source_type') == 'ftp') checked @endif>
                                <span class="ml-2">{{ __("Select from FTP") }}</span>
                            </label>
                        </div>
                        @error('file_source_type') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror

                        {{-- Local Ebook File Upload --}}
                        <div id="local_ebook_file_wrapper" @if(old('file_source_type') == 'ftp') style="display: none;" @endif>
                            <x-input id="ebook_file_input" class="block mt-1 w-full" type="file" name="ebook_file_input" accept=".pdf,.epub,.mobi,.azw3" required/>
                            @error('ebook_file_input') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>

                        {{-- FTP Ebook File Selection --}}
                        <div id="ftp_ebook_file_wrapper" @if(old('file_source_type') == 'local' || !old('file_source_type')) style="display: none;" @endif>
                            <select name="ebook_file" class="w-full form-control fileSelector" required>
                                <option value="">{{ __("-- Select FTP File --") }}</option>
                                @foreach($fileNames as $fileName)
                                    <option value="{{ $fileName['value'] }}" @if(old('ebook_file') == $fileName['value']) selected @endif>{{ $fileName['label'] }}</option>
                                @endforeach
                            </select>
                            @error('ebook_file') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                    </div>

                    <!-- Price -->
                    <div>
                        <x-label for="price" class="block text-sm font-medium text-danger">Price</x-label>
                        <x-input id="price" class="block mt-1 w-full" type="number" value="{{ old('price', 0) }}"  name="price" step="any" required/>
                        @error('price') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <!-- Description -->
                    <div>
                        <x-label for="description_en" class="block text-sm font-medium text-danger">Description (English)</x-label>
                        <x-textarea id="description_en" class="block mt-1 w-full" name="description_en" required>{{ old('description_en', '') }}</x-textarea>
                        @error('description_en') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <!-- <x-label for="description_lang_selector" value={{"Select Additional Language for Description"}} /> -->
                        <x-label for="description_lang_selector" class="block text-sm font-medium text-danger">Select Additional Language for Description</x-label>
                        <select name="description_lang" id="description_lang_selector" class="w-full">
                            <option value="">{{"-- No Additional Language --"}}</option>
                            @foreach($supportedLocales as $locale)
                                <option value="{{ $locale['lang_value'] }}" @if(old('description_lang') == $locale['lang_value']) selected @endif>
                                    {{ $locale['lang_name'] }}
                                </option>
                            @endforeach
                        </select>
                        @error('description_lang') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>
                    
                    <!-- Dynamic Description Input (default mein hidden) -->
                    <div id="description_de_wrapper" @if(old('description_lang') == null || old('description_lang') == '') style="display: none;" @endif>
                        <x-label for="description_de" id="description_de_label" class="block text-sm font-medium text-danger">Select Additional Language for Description</x-label>
                        <x-textarea id="description_de" class="block mt-1 w-full" name="description_de">{{ old('description_de', '') }}</x-textarea>
                        @error('description_de') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
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
                            <input type="text" name="seo[h2]" value="{{ old('seo.h2', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.h2') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[keyword]" value="{{ old('seo.keyword', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.keyword') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[meta_keyword]" value="{{ old('seo.meta_keyword', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.meta_keyword') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[desc]" value="{{ old('seo.desc', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.desc') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                    </div>

                    <!-- German SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">German</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[de][h2]" value="{{ old('seo.de.h2', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.de.h2') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[de][keyword]" value="{{ old('seo.de.keyword', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.de.keyword') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[de][meta_keyword]" value="{{ old('seo.de.meta_keyword', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.de.meta_keyword') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[de][desc]" value="{{ old('seo.de.desc', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.de.desc') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                    </div>
                    
                    <!-- Common SEO Fields -->
                    <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="og-title" class="block text-sm font-medium text-gray-700">OG Title:</label>
                            <input id="og-title" type="text" name="seo[og_title]" value="{{ old('seo.og_title', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.og_title') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label for="og-desc" class="block text-sm font-medium text-gray-700">OG Description:</label>
                            <input id="og-desc" type="text" name="seo[og_desc]" value="{{ old('seo.og_desc', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.og_desc') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label for="meta-robot" class="block text-sm font-medium text-gray-700">Meta Robot:</label>
                            <input id="meta-robot" type="text" name="seo[meta_robot]" value="{{ old('seo.meta_robot', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.meta_robot') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label for="cust-url" class="block text-sm font-medium text-gray-700">Custom URL:</label>
                            <input id="cust-url" type="text" name="seo[cust_url]" value="{{ old('seo.cust_url', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.cust_url') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label for="og-image-url" class="block text-sm font-medium text-gray-700">OG Image URL:</label>
                            <input id="og-image-url" type="text" name="seo[og_image_url]" value="{{ old('seo.og_image_url', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.og_image_url') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label for="json-id" class="block text-sm font-medium text-gray-700">JSON ID:</label>
                            <input id="json-id" type="text" name="seo[json_id]" value="{{ old('seo.json_id', '') }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            @error('seo.json_id') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-5">
                <x-button type="submit" class="w-full md:w-auto">{{ __('Upload') }}</x-button>
            </div>
        </form>
    </div>
@endsection

@section('extra_bottom')
    {{-- Display general validation errors --}}
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
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // TomSelect initialization
            var settings = { plugins: ['remove_button'], create: false };
            new TomSelect('select[name="category_id[]"]', settings);
            new TomSelect('select[name="model_id[]"]', settings);
            new TomSelect('select[name="tags[]"]', settings);
            new TomSelect('select[name="ebook_file"]', settings); // For FTP selector
            
            // Language fields logic
            const titleLangSelector = $('#title_lang_selector');
            const titleDeWrapper = $('#title_de_wrapper');
            const titleDeInput = $('#title_de');
            const titleDeLabel = $('#title_de_label');

            const descriptionLangSelector = $('#description_lang_selector');
            const descriptionDeWrapper = $('#description_de_wrapper');
            const descriptionDeInput = $('#description_de');
            const descriptionDeLabel = $('#description_de_label');

            // Initial visibility based on old input
            function updateTitleVisibility() {
                const selectedLang = titleLangSelector.val();
                if (selectedLang) {
                    const langName = titleLangSelector.find('option:selected').text();
                    titleDeLabel.text(`Title (${langName})`);
                    titleDeInput.val('{{ old('title_de', '') }}');
                    titleDeWrapper.slideDown();
                } else {
                    titleDeWrapper.slideUp();
                    titleDeInput.val('');
                }
            }
            titleLangSelector.on('change', updateTitleVisibility);
            updateTitleVisibility(); // On load

            function updateDescriptionVisibility() {
                const selectedLang = descriptionLangSelector.val();
                if (selectedLang) {
                    const langName = descriptionLangSelector.find('option:selected').text();
                    descriptionDeLabel.text(`Description (${langName})`);
                    descriptionDeInput.val('{{ old('description_de', '') }}');
                    descriptionDeWrapper.slideDown();
                } else {
                    descriptionDeWrapper.slideUp();
                    descriptionDeInput.val('');
                }
            }
            descriptionLangSelector.on('change', updateDescriptionVisibility);
            updateDescriptionVisibility(); // On load

            // File source type switch logic
            const localFileInputWrapper = $('#local_ebook_file_wrapper');
            const ftpFileInputWrapper = $('#ftp_ebook_file_wrapper');
            const localFileInput = $('#ebook_file_input');
            const ftpSelectInput = $('select[name="ebook_file"]');
            
            $('input[name="file_source_type"]').on('change', function() {
                if ($(this).val() === 'local') {
                    localFileInputWrapper.slideDown();
                    ftpFileInputWrapper.slideUp();
                    localFileInput.prop('required', true); // Local file required
                    ftpSelectInput.prop('required', false); // FTP not required
                } else {
                    localFileInputWrapper.slideUp();
                    ftpFileInputWrapper.slideDown();
                    localFileInput.prop('required', false);
                    ftpSelectInput.prop('required', true); // FTP required
                }
            });

            // Initial state for file source type
            const initialFileSourceType = $('input[name="file_source_type"]:checked').val();
            if (initialFileSourceType === 'local') {
                localFileInput.prop('required', true);
                ftpSelectInput.prop('required', false);
            } else {
                localFileInput.prop('required', false);
                ftpSelectInput.prop('required', true);
            }
        });
    </script>
@endpush