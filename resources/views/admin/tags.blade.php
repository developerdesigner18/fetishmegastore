@extends('admin.base')

@section('section_title')
    <strong>{{ __('Tags') }}</strong>
@endsection

@section('section_body')

    <form method="POST" action="{{ empty($name) ? '/admin/add_tag' : '/admin/update_tag' }}"
          enctype="multipart/form-data" class="space-y-6">
        {{ csrf_field() }}

        @if (!empty($name))
            <input type="hidden" name="id" value="{{ $id }}">
        @endif

        <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="name_en" class="block text-sm font-medium text-gray-700">English:</label>
                    <input id="name_en" type="text" name="name[en]" value="{{ $ogValue ? $ogValue->name->en ?? $ogValue->name : '' }}"
                           placeholder="{{ __('Tag Name') }}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label for="name_de" class="block text-sm font-medium text-gray-700">German:</label>
                    <input id="name_de" type="text" name="name[de]" value="{{ $ogValue ? $ogValue->name->de ?? $ogValue->name : '' }}"
                           placeholder="{{ __('Tag Name') }}"
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

            <div>
                <label for="" class="block text-sm font-medium text-gray-700"> Description:</label>
                <input id="description" type="text" name="description" value="{{@$ogValue->description}}"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>

            <hr/>

            <label for="">SEO</label>


            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="" class="block text-sm font-medium text-gray-700">H2</label>
                    <input id="" type="text" name="seo[h2]" value="{{@$ogValue->seo->h2}}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label for="" class="block text-sm font-medium text-gray-700">Keyword:</label>
                    <input id="" type="text" name="seo[keyword]" value="{{@$ogValue->seo->keyword}}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label for="" class="block text-sm font-medium text-gray-700">Meta Keyword:</label>
                    <input id="" type="text" name="seo[meta_keyword]" value="{{@$ogValue->seo->meta_keyword}}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label for="seo-desc" class="block text-sm font-medium text-gray-700">Meta Description:</label>
                    <input id="seo-desc" type="text" name="seo[desc]" value="{{@$ogValue->seo->desc}}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

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

            <div class="flex justify-end">
                <button type="submit"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {{ __('Save') }}
                </button>
            </div>
        </div>
    </form>

    <hr class="my-3"/>

    @if (count($categories) > 0)
        <table class="table border-collapse w-full bg-white text-stone-600 dataTable">
            <thead>
            <tr>
                <x-th>{{ __('ID') }}</x-th>
                <x-th>{{ __('Name') }}</x-th>
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
                        {{ $c->name }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Actions') }}</x-slot>
                        <div class="btn-group">
                            <a class="inline-flex mr-2" href="/admin/tag?update={{ $c->id }}">
                                <i class="fa-solid fa-pencil text-teal-600"></i>
                            </a>
                            <a href="/admin/tag?remove={{ $c->id }}"
                               onclick="return confirm('{{ __('Are you sure you want to remove this tag from database?')  }}');"
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
        {{ __('No Tags in database.') }}
    @endif

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
    </script>


    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    {{-- attention, dynamic because only needed on this page to save resources --}}
    <script>
         $(document).ready(function() {
             $('.dataTable').dataTable({ordering:false});
         });
    </script>
@endpush