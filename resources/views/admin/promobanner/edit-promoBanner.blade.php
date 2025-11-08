@extends('admin.base')

@section('section_title')
    <strong>{{ __('Edit Promo Banner') }}</strong>
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
            relative_urls: false,
            remove_script_host: false
        });


        // document.querySelector('#thumbnail').addEventListener('change', function() {
        //     const file = this.files[0];
        //     if (file && file.size > 2 * 1024 * 1024) { // 2 MB
        //         alert("You can only upload a thumbnail image up to 2MB (2048 KB).");
        //         this.value = ""; // clear the file input
        //     }
        // });
    </script>

    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script>
        $(document).ready(function () {
            $('#category_id').select2({
                placeholder: "Select Categories",
                allowClear: true
            });
        });
    </script>
@endpush

@section('section_body')
    <form method="POST" action="{{ route('promoTools.update', ['id' => $promo_banners->id]) }}" enctype="multipart/form-data">
        @csrf
        <div class="bg-white rounded-lg shadow-sm p-3 text-stone-600">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {{-- Name --}}
                <div>
                    <x-label for="name">{{ __("Name") }}</x-label>
                    <x-input id="name" class="block mt-0 w-full" type="text" name="name" value="{{ $promo_banners->name }}" required />
                </div>

                {{-- Category --}}
                            <select name="category_id[]" id="category_id" multiple class="block w-full rounded-md border-gray-300 shadow-sm">
                @foreach($category as $cat)
                    <option value="{{ $cat->id }}" {{ in_array($cat->id, explode(',', $promo_banners->category_ids ?? '')) ? 'selected' : '' }}>
                        {{ $cat->category }}
                    </option>
                @endforeach
            </select>


                {{-- Status --}}
                <div>
                    <x-label for="status">{{ __("Status") }}</x-label>
                    <select name="status" id="status" class="block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="1" @if($promo_banners->status == '1') selected @endif>Active</option>
                        <option value="0" @if($promo_banners->status == '0') selected @endif>Inactive</option>
                    </select>
                </div>

                {{-- Thumbnail --}}
                <div>
                    <x-label for="thumbnail">{{ __("Thumbnail Image") }}</x-label>
                    <x-input id="thumbnail" class="block mt-0 w-full" type="file" name="thumbnail" accept="image/*" />
                    @if($promo_banners->thumbnail)
                        <img src="{{ asset($promo_banners->thumbnail) }}" alt="Thumbnail" class="mt-2 h-20 rounded shadow" />
                    @endif
                </div>

                {{-- Banner Image --}}
                <div>
                    <x-label for="banner_image">{{ __("Banner Image") }}</x-label>
                    <x-input id="banner_image" class="block mt-0 w-full" type="file" name="banner_image" accept="image/*" />
                    @if($promo_banners->banner_image)
                        <img src="{{ asset($promo_banners->banner_image) }}" alt="Banner Image" class="mt-2 h-20 rounded shadow" />
                    @endif
                </div>
            </div>

            {{-- Description --}}
            <div class="mt-4">
                <x-label for="description">{{ __("Description") }}</x-label>
                <x-textarea id="description" name="description" class="w-full textarea" rows="12">{{ clean($promo_banners->description) }}</x-textarea>
            </div>

            <hr class="mt-4" />
            <div class="ml-3">
                <x-button>{{ __('Update') }}</x-button>
            </div>
        </div>
    </form>
@endsection
