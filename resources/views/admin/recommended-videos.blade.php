@extends('admin.base')

@section('section_title')
    <strong>{{ __('Tags') }}</strong>
@endsection

@section('section_body')
    @if (count($errors) > 0)
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li style="color: red">{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    <form method="POST" action="/admin/add_recommended"
          enctype="multipart/form-data" class="space-y-6">
        {{ csrf_field() }}
        <div class="bg-white shadow-md rounded-lg p-6 space-y-4">

            <div>
                <label for="name_en" class="block text-sm font-medium text-gray-700">Select Video to add in recommended
                    list</label>
                <select name="video_id" class="form-control w-100 block mr-1" id="categorySelect">
                    <option value="">Please select</option>
                    @foreach($allVideos as $c)
                        <option value={{$c->id}}>{{$c->title ?? ''}}</option>
                    @endforeach
                </select>
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

    @if (count($recommendedVideos) > 0)
        <table class="table border-collapse w-full bg-white text-stone-600">
            <thead>
            <tr>
                <x-th>{{ __('ID') }}</x-th>
                <x-th>{{ __('Title') }}</x-th>
                <x-th>{{ __('Actions') }}</x-th>
            </tr>
            </thead>
            <tbody>
            @foreach ($recommendedVideos as $c)
                <tr>
                    <x-td>
                        <x-slot name="field">{{ __('ID') }}</x-slot>
                        {{ $c->id ?? '' }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Title') }}</x-slot>
                        {{ $c->video->title ?? '' }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Actions') }}</x-slot>
                        <div class="btn-group">
                            <a href="/admin/recommended-videos?remove={{ $c->id }}"
                               onclick="return confirm('{{ __('Are you sure you want to remove this recommended video from list?')  }}');"
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
        {{ __('No Recommended videos in database.') }}
    @endif


@endsection


@push('adminExtraJS')
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
    <script>
        var settings = {};
        new TomSelect('#categorySelect', settings);
    </script>
@endpush