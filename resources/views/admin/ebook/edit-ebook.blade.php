@extends('admin.base')

@section('section_title')
    {{ __('Edit ebook') }}
    <br/>

    <a href="/admin/ebooks" class="text-indigo-700 hover:underline font-semibold">&raquo; {{ __('Back To ebooks') }}</a>
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
        <form method="POST" enctype="multipart/form-data" action="/admin/ebooks/save/{{ $ebook->id }}">
            @csrf

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                    <!-- Title Section -->
                    <div>
                        <x-label>{{ __("Title Eng") }}</x-label>
                        <x-input id="title" class="block mt-1 w-full" type="text" value="{{ $ogValue ? $ogValue->title->en ?? $ogValue->title->en : '' }}" name="title" required/>
                    </div>

                    <div>
                        <x-label>{{ __("Select Language for Title") }}</x-label>
                        <select name="title_lang" id="title_lang_selector" class="w-full">
                            <option value="">-- No Language --</option>
                            @foreach($supportedLocales as $locale)
                                <option value="{{ $locale['lang_value'] }}" @if($ebook->title_lang == $locale['lang_value']) selected @endif>
                                    {{ $locale['lang_name'] }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Dynamic Title Input (default mein hidden) -->
                    <div id="title_de_wrapper" style="display: none;">
                        <x-label id="title_de_label">{{ __("Title") }}</x-label>
                        <x-input id="title_de" class="block mt-1 w-full" type="text" value="" name="title_de"/>
                    </div>

                    <div>
                        <x-label for="streamer_selector" class="block text-sm font-medium text-danger">Select Streamer</x-label>
                        <select name="streamer" id="streamer_selector" class="w-full">
                            <option value="">{{"-- No Streamer --"}}</option>
                            @foreach($streamers as $streamer)
                                <option value="{{ $streamer->id }}" @if($ebook->user_id == $streamer->id) selected @endif>
                                    {{ $streamer->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('streamer') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <!-- Category -->
                    <div>
                        @php
                            $selectedCategories = explode(',', $ebook->category_id);
                        @endphp
                        <x-label>{{ __("Category") }}</x-label>
                        <select name="category_id[]" class="w-full multiSelector" multiple>
                            @foreach($categories as $c)
                                <option value="{{ $c->id }}" @if(in_array($c->id, $selectedCategories)) selected @endif>{{ $c->category }}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Model -->
                    <div>
                        @php
                            $selectedModels = explode(',', $ebook->model_id);
                        @endphp
                        <x-label>{{ __("Model") }}</x-label>
                        <select name="model_id[]" class="w-full multiSelectorModel" multiple="">
                            @foreach($models as $modelDetails)
                                <option value="{{ $modelDetails->id }}" @if(in_array($modelDetails->id, $selectedModels)) selected @endif>{{ $modelDetails->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Tags -->
                    <div>
                        @php
                            $selectedTags = explode(',', $ebook->tags);
                        @endphp
                        <x-label>{{ __("Tags") }}</x-label>
                        <select name="tags[]" class="w-full multiSelectorTag" multiple>
                            @foreach($tags as $tagDetails)
                                <option value="{{ $tagDetails->name }}" @if(in_array($tagDetails->name, $selectedTags)) selected @endif>{{ $tagDetails->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Free for subs -->
                    <div>
                        <x-label>{{ __("Free for subscribers?") }}</x-label>
                        <x-select name="free_for_subs" class="w-full">
                            <option value="yes" @if($ebook->free_for_subs == "yes") selected @endif>{{ __("Yes") }}</option>
                            <option value="no" @if($ebook->free_for_subs == "no") selected @endif>{{ __("No") }}</option>
                        </x-select>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                    <!-- Thumbnail -->
                    <div>
                        <x-label>{{ __("Thumbnail - Add Only if want to update thumbnail") }}</x-label>
                        <x-input id="thumbnail" class="block mt-1 w-full" type="file" name="thumbnail"/>
                    </div>

                    <!-- ebook Selector -->
                    <div>
                        <x-label>{{ __("Select Video") }}</x-label>
                        <select name="video" class="w-full form-control fileSelector">
                            <option value="videos/{{$ebook->ebook_file}}" selected>{{$ebook->ebook_file}}</option>
                            @foreach($fileNames as $fileName)
                                <option value="{{$fileName['value']}}" @if($ebook->ebook_file == $fileName['label']) selected @endif>{{$fileName['label']}}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Price -->
                    <div>
                        <x-label>{{ __("Price") }}</x-label>
                        <x-input id="price" class="block mt-1 w-full" type="number" value="{{ $ebook->price }}"  name="price" step="any" required/>
                    </div>

                    <!-- Description -->
                    <div>
                        <x-label>{{ __("Description") }}</x-label>
                        <x-textarea id="description_en" class="block mt-1 w-full" name="description">
                            {{ $ogValue ? $ogValue->description->en ?? '' : '' }}
                        </x-textarea>
                    </div>

                    <div>
                        <x-label>{{ __("Select Additional Language for Description") }}</x-label>
                        <select name="description_lang" id="description_lang_selector" class="w-full">
                            <option value="">-- No Additional Language --</option>
                            @foreach($supportedLocales as $locale)
                                <option value="{{ $locale['lang_value'] }}" @if($ebook->description_lang == $locale['lang_value']) selected @endif>
                                    {{ $locale['lang_name'] }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    
                    <!-- Dynamic Description Input (default mein hidden) -->
                    <div id="description_de_wrapper" style="display: none;">
                        <x-label id="description_de_label">{{ __("Description") }}</x-label>
                        <x-textarea id="description_de" class="block mt-1 w-full" name="description_de"></x-textarea>
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
                            <input type="text" name="seo[h2]" value="{{@$ebook->seoDetails->h2 ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[keyword]" value="{{@$ebook->seoDetails->keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[meta_keyword]" value="{{@$ebook->seoDetails->meta_keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[desc]" value="{{@$ebook->seoDetails->desc ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- German SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">German</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[de][h2]" value="{{@$ebook->seoDetails->de->h2 ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[de][keyword]" value="{{@$ebook->seoDetails->de->keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[de][meta_keyword]" value="{{@$ebook->seoDetails->de->meta_keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[de][desc]" value="{{@$ebook->seoDetails->de->desc ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- Common SEO Fields -->
                    <div class="col-span-2 grid grid-cols-1 grid-cols-1 gap-6">
                        <div>
                            <label for="og-title" class="block text-sm font-medium text-gray-700">OG Title:</label>
                            <input id="og-title" type="text" name="seo[og_title]" value="{{@$ebook->seoDetails->og_title}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-desc" class="block text-sm font-medium text-gray-700">OG Description:</label>
                            <input id="og-desc" type="text" name="seo[og_desc]" value="{{@$ebook->seoDetails->og_desc}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="meta-robot" class="block text-sm font-medium text-gray-700">Meta Robot:</label>
                            <input id="meta-robot" type="text" name="seo[meta_robot]" value="{{@$ebook->seoDetails->meta_robot}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="cust-url" class="block text-sm font-medium text-gray-700">Custom URL:</label>
                            <input id="cust-url" type="text" name="seo[cust_url]" value="{{@$ebook->seoDetails->cust_url}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-image-url" class="block text-sm font-medium text-gray-700">OG Image URL:</label>
                            <input id="og-image-url" type="text" name="seo[og_image_url]" value="{{@$ebook->seoDetails->og_image_url}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="json-id" class="block text-sm font-medium text-gray-700">JSON ID:</label>
                            <input id="json-id" type="text" name="seo[json_id]" value="{{@$ebook->seoDetails->json_id}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-6">
                <x-button class="w-full md:w-auto">{{ __('Save') }}</x-button>
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
    </script>
    <script>
        // Is object mein hum saare translations save karenge
        const titleTranslations = @json($ogValue->title);
        const descriptionTranslations = @json($ogValue->description);

        function setupLanguageField(selectorId, wrapperId, inputId, labelId, translations) {
            const selector = $(`#${selectorId}`);
            const wrapper = $(`#${wrapperId}`);
            const input = $(`#${inputId}`);
            const label = $(`#${labelId}`);

            function updateVisibility() {
                const selectedLang = selector.val();
                if (selectedLang) {
                    const langName = selector.find('option:selected').text();
                    label.text(`Title (${langName})`);
                    input.val(translations[selectedLang] || ''); // Purani value daalo
                    wrapper.slideDown();
                } else {
                    wrapper.slideUp();
                    input.val(''); // Value khaali kar do
                }
            }
            
            // Dropdown ke change hone par function call karo
            selector.on('change', updateVisibility);

            // Page load hone par bhi ek baar function call karo
            updateVisibility();
        }

        $(document).ready(function() {
            setupLanguageField('title_lang_selector', 'title_de_wrapper', 'title_de', 'title_de_label', titleTranslations);
            setupLanguageField('description_lang_selector', 'description_de_wrapper', 'description_de', 'description_de_label', descriptionTranslations);
        });
    </script>
@endpush