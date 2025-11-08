@extends('admin.base')

@section('section_title')
    {{ __('Add Gallery') }}
@endsection

@section('section_body')
    <div class=" bg-white rounded-lg shadow-sm p-3 text-stone-600">
        <form method="POST" enctype="multipart/form-data" action="{{route('save.gallery')}}">
            @csrf
            <x-label class="mt-5">{{ __("Is Promo Video?") }}</x-label>
            <div class="flex items-center gap-4 mt-2">
                <label class="inline-flex items-center">
                    <input type="radio" class="form-radio" name="is_promo_video" value="1">
                    <span class="ml-2">Yes</span>
                </label>
                <label class="inline-flex items-center">
                    <input type="radio" class="form-radio" name="is_promo_video" value="0" checked>
                    <span class="ml-2">No</span>
                </label>
            </div>
            <br>
            
            <x-label>{{ __("Title Eng") }}</x-label>

            <x-input id="title" class="block mt-0 w-full" type="text" value="" name="title"
                     required/>

           <div>
                <x-label>{{ __("Select Additional Language for Title") }}</x-label>
                <select name="title_lang" id="title_lang_selector" class="w-full">
                    <option value="">-- No Additional Language --</option>
                    @foreach($supportedLocales as $locale)
                        <option value="{{ $locale['lang_value'] }}">{{ $locale['lang_name'] }}</option>
                    @endforeach
                </select>
            </div>

            {{-- Dynamic Title Input (default mein hidden) --}}
            <div id="title_de_wrapper" style="display: none;">
                <x-label id="title_de_label">{{ __("Title") }}</x-label>
                <x-input id="title_de" class="block mt-1 w-full" type="text" value="{{ old('title_de') }}" name="title_de"/>
            </div>

            <x-label class="mt-5">{{ __("Streamer") }}</x-label>

            <select name="user_id" class="w-full multiSelectorStreamer">
                <option value="">Please select</option>
                @foreach($streamer as $s)
                    <option value="{{ $s->id }}">{{ $s->username }}</option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Category") }}</x-label>

            <select name="category_id[]" class="w-full multiSelector" multiple>
                @foreach($video_categories as $c)
                    <option value="{{ $c->id }}">{{ $c->category }}</option>
                @endforeach
            </select>


            <x-label class="mt-5">{{ __("Tags") }}</x-label>

            <select name="tags[]" class="w-full multiSelectorTag" multiple>
                @foreach($tags as $tagDetails)
                    <option value="{{ $tagDetails->id }}">{{ $tagDetails->name }}</option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Model") }}</x-label>

            <select name="model_id[]" class="w-full multiSelectorModel" multiple>
                @foreach($model as $modelDetailss)
                    <option value="{{ $modelDetailss->id }}">{{ $modelDetailss->name }}</option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Full Video Link") }}</x-label>
            {{--            <x-input id="video" class="block mt-0 w-full" type="file" name="video"/>--}}

           <select name="video_id" class="w-full selectVideoLink">
                <option value="">Please select</option>
                 @foreach($systemVideo as $videoData)
                    <option value="{{ $videoData['value'] }}">
                        {{ $videoData['label']->en ?? 'Untitled' }}
                    </option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Thumbnail") }}</x-label>
            <x-input id="thumbnail" class="block mt-0 w-full" type="file" name="thumbnail"/>

            <x-label class="mt-5">{{ __("Images") }}</x-label>
            <x-input id="images" class="block mt-0 w-full" type="file" name="images[]" multiple=""/>

            <x-label class="mt-5">{{ __("Description") }}</x-label>
            <x-textarea id="description_en" class="block mt-0 w-full" name="description"></x-textarea>

            <div>
                <x-label>{{ __("Select Additional Language for Description") }}</x-label>
                <select name="description_lang" id="description_lang_selector" class="w-full">
                    <option value="">-- No Additional Language --</option>
                    @foreach($supportedLocales as $locale)
                        <option value="{{ $locale['lang_value'] }}">{{ $locale['lang_name'] }}</option>
                    @endforeach
                </select>
            </div>

            {{-- Dynamic Description Input (default mein hidden) --}}
            <div id="description_de_wrapper" style="display: none;">
                <x-label id="description_de_label">{{ __("Description") }}</x-label>
                <x-textarea id="description_de" class="block mt-1 w-full" name="description_de">{{ old('description_de') }}</x-textarea>
            </div>

            <hr class="mt-3"/>

            <div class="mt-8 border-t pt-6">
                <h3 class="text-lg font-medium mb-4">SEO Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- English SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">English</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[h2]" value="{{@$blog->seo->h2 ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[keyword]" value="{{@$blog->seo->keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[meta_keyword]" value="{{@$blog->seo->meta_keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[desc]" value="{{@$blog->seo->desc ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- German SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">German</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[de][h2]" value="{{@$blog->seo->de->h2 ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[de][keyword]" value="{{@$blog->seo->de->keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[de][meta_keyword]" value="{{@$blog->seo->de->meta_keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[de][desc]" value="{{@$blog->seo->de->desc ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- Common SEO Fields -->
                    <div class="col-span-2 grid grid-cols-1 grid-cols-1 gap-6">
                        <div>
                            <label for="og-title" class="block text-sm font-medium text-gray-700">OG Title:</label>
                            <input id="og-title" type="text" name="seo[og_title]" value="{{@$blog->seo->og_title}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-desc" class="block text-sm font-medium text-gray-700">OG Description:</label>
                            <input id="og-desc" type="text" name="seo[og_desc]" value="{{@$blog->seo->og_desc}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="meta-robot" class="block text-sm font-medium text-gray-700">Meta Robot:</label>
                            <input id="meta-robot" type="text" name="seo[meta_robot]" value="{{@$blog->seo->meta_robot}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="cust-url" class="block text-sm font-medium text-gray-700">Custom URL:</label>
                            <input id="cust-url" type="text" name="seo[cust_url]" value="{{@$blog->seo->cust_url}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-image-url" class="block text-sm font-medium text-gray-700">OG Image URL:</label>
                            <input id="og-image-url" type="text" name="seo[og_image_url]" value="{{@$blog->seo->og_image_url}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="json-id" class="block text-sm font-medium text-gray-700">JSON ID:</label>
                            <input id="json-id" type="text" name="seo[json_id]" value="{{@$blog->seo->json_id}}"
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
    <script !src="">
        var settings = {};
        new TomSelect('.multiSelector',settings);
        new TomSelect('.multiSelectorStreamer',settings);
        new TomSelect('.multiSelectorTag',settings);
        new TomSelect('.multiSelectorModel',settings);
        new TomSelect('.selectVideoLink',settings);
    </script>

    <script>
        function setupLanguageField(selectorId, wrapperId, inputId, labelId, isTitle) {
            const selector = $(`#${selectorId}`);
            const wrapper = $(`#${wrapperId}`);
            const input = $(`#${inputId}`);
            const label = $(`#${labelId}`);

            function updateVisibility() {
                const selectedLang = selector.val();
                if (selectedLang) {
                    const langName = selector.find('option:selected').text().trim();
                    // Title aur Description ke liye label alag-alag set karein
                    const fieldName = isTitle ? 'Title' : 'Description';
                    label.text(`${fieldName} (${langName})`);
                    wrapper.slideDown();
                } else {
                    wrapper.slideUp();
                    input.val(''); // Value khaali kar do
                }
            }
            
            selector.on('change', updateVisibility);
            updateVisibility(); // Page load par ek baar run karein
        }

        $(document).ready(function() {
            // Title ke liye
            setupLanguageField('title_lang_selector', 'title_de_wrapper', 'title_de', 'title_de_label', true);
            // Description ke liye
            setupLanguageField('description_lang_selector', 'description_de_wrapper', 'description_de', 'description_de_label', false);
        });
    </script>
@endpush