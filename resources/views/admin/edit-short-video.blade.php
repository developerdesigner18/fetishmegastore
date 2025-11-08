@extends('admin.base')

@section('section_title')
    {{ __('Edit Short Video') }}
@endsection

@section('section_body')
    <div class=" bg-white rounded-lg shadow-sm p-3 text-stone-600">
        <form method="POST" enctype="multipart/form-data" action="{{route('update.short.videos')}}">
            @csrf
            <input type="hidden" name="id" value="{{$video->id}}">

            <x-label class="mt-5">{{ __("Is Promo Video?") }}</x-label>
            <div class="flex items-center gap-4 mt-2">
                <label class="inline-flex items-center">
                    <input type="radio" class="form-radio" name="is_promo_video" value="1"
                        {{ old('is_promo_video', $video->is_promo_video ?? 0) == 1 ? 'checked' : '' }}>
                    <span class="ml-2">Yes</span>
                </label>
                <label class="inline-flex items-center">
                    <input type="radio" class="form-radio" name="is_promo_video" value="0"
                        {{ old('is_promo_video', $video->is_promo_video ?? 0) == 0 ? 'checked' : '' }}>
                    <span class="ml-2">No</span>
                </label>
            </div>
             <br>
            <x-label>{{ __("Title Eng") }}</x-label>

            <x-input id="title" class="block mt-0 w-full" type="text" value="{{ $ogValue ? $ogValue->title->en ?? $ogValue->title->en : '' }}" name="title" required/>

            <div>
                <x-label>{{ __("Select Language for Title") }}</x-label>
                <select name="title_lang" id="title_lang_selector" class="w-full">
                    <option value="">-- No Language --</option>
                    @foreach($supportedLocales as $locale)
                        <option value="{{ $locale['lang_value'] }}" @if($ogValue->title_lang == $locale['lang_value']) selected @endif>
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

            <!-- <x-label>{{ __("Title German") }}</x-label>

            <x-input id="title" class="block mt-0 w-full" type="text" value="{{ $ogValue ? $ogValue->title->de ?? $video->title : '' }}" name="title[de]"
                     required/> -->

            <x-label class="mt-5">{{ __("Streamer") }}</x-label>

            <select name="user_id" class="w-full multiSelectorStreamer">
                <option value="">Please select</option>
                @foreach($streamer as $s)
                    <option value="{{ $s->id }}" @if($s->id == $video->user_id) selected @endif>{{ $s->username }}</option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Category") }}</x-label>

            <select name="category_id[]" class="w-full multiSelector" multiple>
                @foreach($video_categories as $c)
                    <option value="{{ $c->id }}" @if(in_array($c->id,$video->category_id)) selected @endif>{{ $c->category }}</option>
                @endforeach
            </select>


            <x-label class="mt-5">{{ __("Tags") }}</x-label>

            <select name="tags[]" class="w-full multiSelectorTag" multiple>
                @foreach($tags as $tagDetails)
                    <option value="{{ $tagDetails->id }}" @if(in_array($tagDetails->id,$video->tags)) selected @endif>{{ $tagDetails->name }}</option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Model") }}</x-label>

            <select name="model_id[]" class="w-full multiSelectorModel" multiple>
                @foreach($model as $modelDetailss)
                    <option value="{{ $modelDetailss->id }}" @if(in_array($modelDetailss->id,$video->model_id)) selected @endif>{{ $modelDetailss->name }}</option>
                @endforeach
            </select>


            <x-label class="mt-5">{{ __("Thumbnail - Add Only if want to update thumbnail") }}</x-label>
            <x-input id="thumbnail" class="block mt-0 w-full" type="file" name="thumbnail"/>

{{--            <x-label class="mt-5">{{ __("Video File - Add Only if want to update video") }}</x-label>--}}
{{--            <x-input id="video" class="block mt-0 w-full" type="file" name="video"/>--}}

            <x-label class="mt-5">{{ __("Select Video") }}</x-label>

            <select name="video" class="w-full fileSelector">
                <option value="short-videos/{{$video->videoName}}" selected>{{$video->videoName}}</option>
                @foreach($fileNames as $fileName)
                    <option value="{{$fileName['value']}}" @if($video->videoName == $fileName['label']) selected @endif>{{$fileName['label']}}</option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Full Video Link") }}</x-label>
            {{--            <x-input id="video" class="block mt-0 w-full" type="file" name="video"/>--}}

           <select name="video_id" class="w-full selectVideoLink">
                <option value="">Please select</option>
                 @foreach($systemVideo as $videoData)
                    <option value="{{ $videoData['value'] }}" @if($video->video_id == $videoData['value']) selected @endif>
                        {{ $videoData['label']->en ?? 'Untitled' }}
                    </option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Description") }}</x-label>

            <x-textarea id="description_en" class="block mt-0 w-full" name="description">{{ $ogValue ? $ogValue->description->en ?? '' : '' }}</x-textarea>

            <!-- <x-label class="mt-5">{{ __("German Description") }}</x-label>
            <x-textarea id="description_de" class="block mt-0 w-full" name="description[de]">{{ $ogValue ? $ogValue->description->en ?? '' : '' }}</x-textarea> -->
            <div>
                <x-label>{{ __("Select Additional Language for Description") }}</x-label>
                <select name="description_lang" id="description_lang_selector" class="w-full">
                    <option value="">-- No Additional Language --</option>
                    @foreach($supportedLocales as $locale)
                        <option value="{{ $locale['lang_value'] }}" @if($ogValue->description_lang == $locale['lang_value']) selected @endif>
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

            <hr class="mt-3"/>

            @php
                $video->seo = $video->seo ? json_decode($video->seo) : null;
            @endphp

            <div class="mt-8 border-t pt-6">
                <h3 class="text-lg font-medium mb-4">SEO Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- English SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">English</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[h2]" value="{{@$video->seo->h2 ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[keyword]" value="{{@$video->seo->keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[meta_keyword]" value="{{@$video->seo->meta_keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[desc]" value="{{@$video->seo->desc ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- German SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">German</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[de][h2]" value="{{@$video->seo->de->h2 ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[de][keyword]" value="{{@$video->seo->de->keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[de][meta_keyword]" value="{{@$video->seo->de->meta_keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[de][desc]" value="{{@$video->seo->de->desc ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- Common SEO Fields -->
                    <div class="col-span-2 grid grid-cols-1 grid-cols-1 gap-6">
                        <div>
                            <label for="og-title" class="block text-sm font-medium text-gray-700">OG Title:</label>
                            <input id="og-title" type="text" name="seo[og_title]" value="{{@$video->seo->og_title}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-desc" class="block text-sm font-medium text-gray-700">OG Description:</label>
                            <input id="og-desc" type="text" name="seo[og_desc]" value="{{@$video->seo->og_desc}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="meta-robot" class="block text-sm font-medium text-gray-700">Meta Robot:</label>
                            <input id="meta-robot" type="text" name="seo[meta_robot]" value="{{@$video->seo->meta_robot}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="cust-url" class="block text-sm font-medium text-gray-700">Custom URL:</label>
                            <input id="cust-url" type="text" name="seo[cust_url]" value="{{@$video->seo->cust_url}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-image-url" class="block text-sm font-medium text-gray-700">OG Image URL:</label>
                            <input id="og-image-url" type="text" name="seo[og_image_url]" value="{{@$video->seo->og_image_url}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="json-id" class="block text-sm font-medium text-gray-700">JSON ID:</label>
                            <input id="json-id" type="text" name="seo[json_id]" value="{{@$video->seo->json_id}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <hr>

            <x-button class="mt-5">{{ __('Save') }}</x-button>
        </form>
    </div>

@endsection
@push('adminExtraJS')
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

    <!-- Select2 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

    <!-- Select2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>


    <script !src="">
        var settings = {};
        new TomSelect('.multiSelector',settings);
        new TomSelect('.multiSelectorStreamer',settings);
        new TomSelect('.multiSelectorStreamer',settings);
        new TomSelect('.multiSelectorTag',settings);
        new TomSelect('.multiSelectorModel',settings);
        new TomSelect('.fileSelector',settings);
        new TomSelect('.selectVideoLink',settings);
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

    <script>
        $(document).ready(function() {
            $('.selectVideoLink').select2({
                placeholder: "Select full video link",
                allowClear: true,
                width: '100%'
            });
        });
    </script>
@endpush