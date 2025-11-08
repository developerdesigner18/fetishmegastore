@extends('admin.base')

@section('section_title')
    <strong>{{ __('Promo Preview Videos') }}</strong>
@endsection

@push('adminExtraCSS')
    {{-- Select2 CSS --}}
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
@endpush

@push('adminExtraJS')
    {{-- TinyMCE --}}
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
    </script>

    {{-- jQuery and Select2 --}}
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script>
        $(document).ready(function () {
            $('#category_id').select2({
                placeholder: "Select Categories",
                allowClear: true
            });
        });
    </script>
    <script>
    document.getElementById('preview_videos').addEventListener('change', function () {
        const file = this.files[0];
        if (file && file.size > 10 * 1024 * 1024) { // 10MB
            alert("Video must be less than 10MB.");
            this.value = ""; // Clear the input
        }
    });
</script>

@endpush

@section('section_body')
    <form method="POST" action="{{ route('PreviewVideos.store') }}" enctype="multipart/form-data">
        {{ csrf_field() }}
        <div class="bg-white rounded-lg shadow-sm p-3 text-stone-600">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {{-- Name --}}
                <div>
                    <x-label for="name">{{ __("Name") }}</x-label>
                    <x-input id="name" class="block mt-0 w-full" type="text" name="name" required />
                </div>

                {{-- Category (Multi-select) --}}
                <div>
                    <x-label for="category_id">{{ __("Categories") }}</x-label>
                    <select name="category_id[]" id="category_id" multiple class="block w-full rounded-md border-gray-300 shadow-sm">
                        @foreach($category as $cat)
                            <option value="{{ $cat->id }}">{{ $cat->category }}</option>
                        @endforeach
                    </select>

                </div>

                {{-- Thumbnail --}}
                <div>
                    <x-label for="thumbnail">{{ __("Thumbnail Image") }}</x-label>
                    <x-input id="thumbnail" class="block mt-0 w-full" type="file" name="thumbnail" accept="image/*" />
                </div>

                {{-- preview_videos --}}
                <div>
                <x-label for="preview_videos">{{ __("Video File (Max: 10MB)") }}</x-label>
                <x-input id="preview_videos" class="block mt-0 w-full" type="file" name="preview_videos" accept="video/*" />
                </div>
            </div>

            {{-- Description (full width) --}}
            <div class="mt-4">
                <x-label for="description">{{ __("Description") }}</x-label>
                <x-textarea id="description" name="description" class="w-full textarea" rows="12"></x-textarea>
            </div>

            {{-- Status --}}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <x-label for="status">{{ __("Status") }}</x-label>
                    <select name="status" id="status" class="block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>
            </div>

            <hr class="mt-4" />
            <div class="ml-3">
                <x-button>{{ __('Save') }}</x-button>
            </div>
        </div>
    </form>
@endsection
