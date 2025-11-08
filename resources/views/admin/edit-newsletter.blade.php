@extends('admin.base')

@section('section_title')
    <strong>{{ __('NewsLetter') }}</strong>
@endsection
@push('adminExtraJS')
    <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>
     <script type="text/javascript">
        tinymce.init({
            selector: '.textarea',
            plugins: 'image code link lists',
            images_upload_url: '/admin/cms/upload-image',
            toolbar: 'code | formatselect fontsizeselect | insertfile a11ycheck | numlist bullist | bold italic | forecolor backcolor | template codesample | alignleft aligncenter alignright alignjustify | bullist numlist | link image tinydrive',
            promotion: false
        });
    </script>
@endpush

@section('section_body')

    <form method="POST" action="{{route('newsletter.update',['id' => $newsletter->id])}}"
          enctype="multipart/form-data">
        {{ csrf_field() }}
        <div class="bg-white rounded-lg shadow-sm p-3 text-stone-600">

            <x-label>{{ __("Title") }}</x-label>
            <x-input id="title" class="block mt-0 w-full" type="text" value="{{$newsletter->title}}" name="title"
                     required/>

            <x-textarea name="description" class="w-full textarea" rows="20">{{ clean($newsletter->description) }}</x-textarea>
           
           

            <hr class="mt-3"/>

            <div class="ml-3">
                <x-button>{{ __('Save') }}</x-button>
            </div>
        </div>
    </form>

    <hr class="my-3"/>

    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
@endsection
@push('adminExtraJS')
@endpush
