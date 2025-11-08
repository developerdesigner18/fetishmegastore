@extends('admin.base')

@section('section_title')
    <strong>{{ __('Stories') }}</strong>
@endsection
@push('adminExtraJS')
    <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>
    <script type="text/javascript">
        tinymce.init({
            selector: '.textarea',
            plugins: 'image code link lists',
            images_upload_url: '/admin/cms/upload-image',
            toolbar: 'code | formatselect fontsizeselect | insertfile a11ycheck | numlist bullist | bold italic | forecolor backcolor | template codesample | alignleft aligncenter alignright alignjustify | bullist numlist | link image tinydrive',
            promotion: false,
            setup: function (editor) {
                editor.on('init', function () {
                    @if(isset($blog->description_en))
                    editor.setContent(`{!! $blog->description_en !!}`);
                    @endif
                });
            }
        });

        tinymce.init({
            selector: '.textarea-de',
            plugins: 'image code link lists',
            images_upload_url: '/admin/cms/upload-image',
            toolbar: 'code | formatselect fontsizeselect | insertfile a11ycheck | numlist bullist | bold italic | forecolor backcolor | template codesample | alignleft aligncenter alignright alignjustify | bullist numlist | link image tinydrive',
            promotion: false,
            setup: function (editor) {
                editor.on('init', function () {
                    @if(isset($blog->description_de))
                    editor.setContent(`{!! $blog->description_de !!}`);
                    @endif
                });
            }
        });
    </script>
@endpush
@php
    $blogCategories = $blog->category_id ? explode(',',$blog->category_id) : [];
    $blogTags = $blog->tag_id ? explode(',',$blog->tag_id) : [];
@endphp
@section('section_body')

    <form method="POST" action="{{route('story.update',['id' => $blog->id])}}"
          enctype="multipart/form-data">
        {{ csrf_field() }}
        <div class="bg-white rounded-lg shadow-sm p-3 text-stone-600">

            <x-label>{{ __("Title Eng") }}</x-label>
            <x-input id="title" class="block mt-0 w-full" type="text" value="{{$blog->title_en}}" name="title[en]"
                     required/>

            <x-label>{{ __("Title German") }}</x-label>
            <x-input id="title" class="block mt-0 w-full" type="text" value="{{$blog->title_de}}" name="title[de]"
                     required/>

            <x-label>{{ __("Image") }} "If you don't choose an image, the current one will remain the same."</x-label>
            <x-input id="image" class="block mt-0 w-full" type="file" name="image"/>

            <x-label class="mt-5">{{ __("Category") }}</x-label>


            <select name="category_id[]" class="w-full multiSelector" multiple>

                @foreach($categories as $c)
                    <option value="{{ $c->id }}" @if(in_array($c->id,$blogCategories)) selected @endif >{{ $c->category }}</option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Tags") }}</x-label>

            <select name="tags[]" class="w-full multiSelectorTag" multiple>
                @foreach($tags as $tagDetails)
                    <option value="{{ $tagDetails->id }}" @if(in_array($tagDetails->id,$blogTags)) selected @endif>{{ $tagDetails->name }}</option>
                @endforeach
            </select>

            <x-label class="mt-5">{{ __("Description") }}</x-label>
            <textarea name="description[en]" id="page_content" class="w-full textarea" rows="20"></textarea>

            <x-label class="mt-5">{{ __("German Description") }}</x-label>
            <textarea name="description[de]" id="page_content_de" class="w-full textarea-de" rows="20"></textarea>


            <hr class="mt-3"/>

            <label  for="">SEO</label>

            @php
                $blog->seo = $blog->seo ? json_decode($blog->seo) : null;
            @endphp

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

            <div class="ml-3">
                <x-button>{{ __('Save') }}</x-button>
            </div>
        </div>
    </form>

    <hr class="my-3"/>

    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
@endsection
@push('adminExtraJS')
    <script>
        document.getElementById('seo-desc').addEventListener('input', function (e) {
            var value = e.target.value;
            var words = value.trim().split(/\s+/);
            if (words.length > 100) {
                // Trim the value to 100 words
                e.target.value = words.slice(0, 100).join(' ');
                alert('You can only enter up to 100 words.');
            }
        });

        var settings = {};
        new TomSelect('.multiSelector',settings);
        new TomSelect('.multiSelectorTag',settings);
    </script>
@endpush
