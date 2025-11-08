@extends('admin.base')

@section('section_title')
    <strong>{{ __('Video Categories') }}</strong>
@endsection

@section('section_body')
    <form method="POST" action="{{ empty($catname) ? '/admin/add_video_category' : '/admin/update_video_category' }}"
          enctype="multipart/form-data" class="space-y-6">
        {{ csrf_field() }}

            @if (!empty($catname))
            <input type="hidden" name="catID" value="{{ $catID }}">
        @endif

        <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="catname_en" class="block text-sm font-medium text-gray-700">English:</label>
                    <input id="catname_en" type="text" name="catname[en]" value="{{ $ogValue->category->en ?? $catname }}"
                           placeholder="{{ __('Category Name')  }}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label for="catname_de" class="block text-sm font-medium text-gray-700">German:</label>
                    <input id="catname_de" type="text" name="catname[de]" value="{{ $ogValue->category->de ?? $catname }}"
                           placeholder="{{ __('Category Name')  }}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="image" class="block text-sm font-medium text-gray-700">Image:</label>
                    <input id="image" type="file" name="image"
                           class="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
            </div>

            <div class="mt-8 border-t pt-6">
                <h3 class="text-lg font-medium mb-4">SEO Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- English SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">English</h4>
                        @php
                            //prd($ogValue);
                        @endphp
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[h2]" value="{{@$ogValue->seo->h2 ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[keyword]" value="{{@$ogValue->seo->keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[meta_keyword]" value="{{@$ogValue->seo->meta_keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[desc]" value="{{@$ogValue->seo->desc ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- German SEO -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-stone-700">German</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">H2</label>
                            <input type="text" name="seo[de][h2]" value="{{@$ogValue->seo->de->h2 ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keyword:</label>
                            <input type="text" name="seo[de][keyword]" value="{{@$ogValue->seo->de->keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                            <input type="text" name="seo[de][meta_keyword]" value="{{@$ogValue->seo->de->meta_keyword ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta Description:</label>
                            <input type="text" name="seo[de][desc]" value="{{@$ogValue->seo->de->desc ?? ''}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <!-- Common SEO Fields -->
                    <div class="col-span-2 grid grid-cols-1 grid-cols-1 gap-6">
                        <div>
                            <label for="og-title" class="block text-sm font-medium text-gray-700">OG Title:</label>
                            <input id="og-title" type="text" name="seo[og_title]" value="{{@$ogValue->seo->og_title}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-desc" class="block text-sm font-medium text-gray-700">OG Description:</label>
                            <input id="og-desc" type="text" name="seo[og_desc]" value="{{@$ogValue->seo->og_desc}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="meta-robot" class="block text-sm font-medium text-gray-700">Meta Robot:</label>
                            <input id="meta-robot" type="text" name="seo[meta_robot]" value="{{@$ogValue->seo->meta_robot}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="cust-url" class="block text-sm font-medium text-gray-700">Custom URL:</label>
                            <input id="cust-url" type="text" name="seo[cust_url]" value="{{@$ogValue->seo->cust_url}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="og-image-url" class="block text-sm font-medium text-gray-700">OG Image URL:</label>
                            <input id="og-image-url" type="text" name="seo[og_image_url]" value="{{@$ogValue->seo->og_image_url}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label for="json-id" class="block text-sm font-medium text-gray-700">JSON ID:</label>
                            <input id="json-id" type="text" name="seo[json_id]" value="{{@$ogValue->seo->json_id}}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {{ __('Save') }}
                </button>
            </div>
        </div>
    </form>

{{--    <form method="POST" action="{{ empty($catname) ? '/admin/add_video_category' : '/admin/update_video_category' }}"--}}
{{--          enctype="multipart/form-data">--}}
{{--        {{ csrf_field() }}--}}
{{--        <div class="flex items-center bg-white rounded p-3">--}}

{{--            @if (!empty($catname))--}}
{{--                <input type="hidden" name="catID" value="{{ $catID }}">--}}
{{--            @endif--}}


{{--            <div>--}}
{{--                <label for="">Eng : </label>--}}
{{--                <x-input type="text" name="catname[en]" value="{{ $ogValue->category->en }}"--}}
{{--                         placeholder="{{ __('Category Name')  }}"/>--}}
{{--            </div>--}}

{{--            <div>--}}
{{--                <label for="">Germany : </label>--}}
{{--                <x-input type="text" name="catname[de]" value="{{ $ogValue->category->de }}"--}}
{{--                         placeholder="{{ __('Category Name')  }}"/>--}}
{{--            </div>--}}

{{--            <div>--}}
{{--                <x-input type="file" name="image"/>--}}
{{--            </div>--}}

{{--            <div>--}}
{{--                <label for="">SEO Description : </label>--}}
{{--                <x-input type="text" name="seo_desc" value="{{ @$ogValue->seo_desc }}"--}}
{{--                         placeholder="{{ __('SEO Desc')  }}"/>--}}
{{--            </div>--}}

{{--            <div>--}}
{{--                <label for="">SEO Keyword : </label>--}}
{{--                <x-input type="text" name="seo_keyword" value="{{ @$ogValue->seo_seyword }}"--}}
{{--                         placeholder="{{ __('SEO Keyword')  }}"/>--}}
{{--            </div>--}}

{{--            <div class="ml-3">--}}
{{--                <x-button>{{ __('Save') }}</x-button>--}}
{{--            </div>--}}
{{--        </div><!-- /.col-xs-12 col-md-6 -->--}}
{{--    </form>--}}

    <hr class="my-3"/>

    @if ($categories)
        <table class="table border-collapse w-full bg-white text-stone-600">
            <thead>
            <tr>
                <x-th>{{ __('ID') }}</x-th>
                <x-th>{{ __('Category') }}</x-th>
                <x-th>{{ __('Videos') }}</x-th>
                <x-th>{{ __('Actions') }}</x-th>
            </tr>
            </thead>
            <tbody>
            @foreach ($categories as $c)
                <tr>
                    <x-td>
                        <x-slot name="field">{{ __('ID') }}</x-slot>
                        {{ $c->id }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Category') }}</x-slot>
                        {{ $c->category }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Videos') }}</x-slot>
                        <span class="inline-flex px-2 py-1 bg-indigo-200 text-indigo-700 rounded-lg">
                    {{ $c->videos_count }}
                </span>
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Actions') }}</x-slot>
                        <div class="btn-group">
                            <a class="inline-flex mr-2" href="/admin/video-categories?update={{ $c->id }}">
                                <i class="fa-solid fa-pencil text-teal-600"></i>
                            </a>
                            <a href="/admin/video-categories?remove={{ $c->id }}"
                               onclick="return confirm('{{ __('Are you sure you want to remove this category from database?')  }}');"
                               class="inline-flex">
                                <i class="fa-solid fa-trash text-red-400"></i>
                            </a>
                        </div>
                    </x-td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        {{ __('No categories in database.') }}
    @endif

@endsection