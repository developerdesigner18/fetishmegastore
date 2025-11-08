@extends('admin.base')

@section('section_title')
    <strong>{{ __('Faqs') }}</strong>
@endsection
@push('adminExtraJS')
    <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>
@endpush

@section('section_body')

    <form method="POST" action="{{route('faq.update',['id' => $faq->id])}}"
          enctype="multipart/form-data">
        {{ csrf_field() }}
        <div class="bg-white rounded-lg shadow-sm p-3 text-stone-600">

            <x-label>{{ __("Question Eng") }}</x-label>
            <x-input id="question" class="block mt-0 w-full" type="text" value="{{$faq->question}}" name="question"
                     required/>


            <x-label>{{ __("Answer Eng") }}</x-label>
            <textarea name="answer" id="answer" class="w-full textarea" rows="20" required>{{$faq->answer}} </textarea>


            <x-label>{{ __("Question German") }}</x-label>
            <x-input id="question_de" class="block mt-0 w-full" type="text" value="{{$faq->question_de}}" name="question_de"
                     required/>


            <x-label>{{ __("Answer Eng") }}</x-label>
            <textarea name="answer_de" id="answer_de" class="w-full textarea" rows="20" required>{{$faq->answer_de}} </textarea>


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
