@extends('admin.base')

@section('section_title')
    <strong>{{ __('Models') }}</strong>
@endsection
@section('extra_bottom')

    @if ($errors)
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
@endsection
@section('section_body')



    <div>


        <form class="p-4 md:p-5" action="{{route('admin.add.video')}}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type model name" required="">
                </div>
                <div class="col-span-2">
                    <label for="age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                    <input type="number" name="age" id="age" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required="">
                </div>
                <div class="col-span-2">
                    <label for="size" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Size</label>
                    <input type="text" name="size" id="size" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required="">
                </div>
                <div class="col-span-2">
                    <label for="shoe_size" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Shoe Size</label>
                    <input type="text" name="shoe_size" id="shoe_size" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required="">
                </div>
                <div class="col-span-2">
                    <label for="country" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                    <input type="text" name="country" id="country" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required="">
                </div>
                <div class="col-span-2">
                    <label for="weight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Weight</label>
                    <input type="text" name="weight" id="weight" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required="">
                </div>

                <div class="col-span-2">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
                    <input type="text" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="">
                </div>

                <div class="col-span-2">
                    <label for="website" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website URL</label>
                    <input type="text" name="website" id="website" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="">
                </div>

                <div class="col-span-2">
                    <label for="insta_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instagram URL</label>
                    <input type="text" name="insta_url" id="insta_url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="">
                </div>

                <div class="col-span-2">
                    <label for="twitter_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Twitter URL</label>
                    <input type="text" name="twitter_url" id="twitter_url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="">
                </div>

                <div class="col-span-2">
                    <label for="facebook_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Facebook URL</label>
                    <input type="text" name="facebook_url" id="facebook_url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="">
                </div>

                <div class="col-span-1 sm:col-span-1">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thumbnail Photo</label>
                    <input type="file" name="photo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" id="" required>
                </div>

                <div class="col-span-1 sm:col-span-1">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gallery Photos (Max 10 - Min 8)</label>
                    <input type="file" name="photos[]" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" id="" multiple>
                </div>
                <div class="col-span-1">
                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea id="description" rows="4" name="description" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write model description here"></textarea>
                </div>
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
            <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-1" style="background-color: blueviolet;">
                <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                Add new Model
            </button>
        </form>

    </div>


@endsection

@section('extra_bottom')
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
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
    {{-- attention, dynamic because only needed on this page to save resources --}}
    <script>
        $('.dataTable').dataTable({ordering: false});
    </script>
@endpush