@extends('admin.base')

@section('section_title')
    <strong>{{ __('Stories') }}</strong>
@endsection

@section('section_body')
<style>
img.rounded-lg.mb-3 {
    min-width: 336px;
    max-width: 336px;
    min-height: 180px;
    max-height: 180px;
}
</style>
    <div>
        <a href="{{route('gallery.add.view')}}"><x-button>Add Gallery</x-button></a>

    </div>
    <hr class="my-3"/>

    @if (count($gallery))

        <div class="items-center justify-center p-5">

        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            @foreach($gallery as $v)
                <div class="mr-5 mb-5 border-2 rounded-lg">
                    <div class="relative">
                        @if($v->is_promo_video == 1)
                            <div class="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg z-10">
                                promo gallery
                            </div>
                        @endif
                        <a target="_blank" href="#" class="font-semibold dark:text-gray-100 hover:text-gray-800 text-gray-600 dark:hover:text-gray-400">
                            <img src="{{$v->thumbnail}}" class="rounded-lg mb-3" alt="" />
                        </a>
                    </div>
                    <div class="flex items-start p-2">
                        <div class="flex-grow">
                            <div>
                                {{$v->title}}
                            </div>
                            <div class="mt-1.5 text-xs text-gray-500 dark:text-gray-200">
                                <div class="mt-1">
                                    {{$v->views === 1
                                    ? __("1 view")
                                    : __(":viewsCount views", ["viewsCount" => $v->views])}}
                                </div>
                            </div>
                        </div>
                        <div class="text-right p-5 w-10">
                            <a href="{{route('gallery.edit.view',['id' => $v->id])}}"><i class="fa-solid fa-pencil mr-2 text-teal-600"></i></a>
                            <a href="{{route('delete.gallery',['id' => $v->id])}}"
                               onclick="return confirm('{{ __('Are you sure you want to remove this Gallery?')  }}')"><i
                                        class="fa-solid fa-trash text-red-400"></i></a>
                        </div>
                    </div>

                </div>
            @endforeach
        </div>
        </div>

        <div class="p-5">
            {{ $gallery->links() }}
        </div>

    @else
        <div class="bg-white p-3 rounded">
            @if(request()->filled('search'))
                {{ __('No gallery matching ":searchTerm"', ['searchTerm' => request('search')]) }}
                <a href="{{route('short.videos.index')}}" class="text-cyan-600 hover:underline">{{ __("Reset Search") }}</a>
            @else
                {{ __('No gallery uploaded.') }}
            @endif
        </div>
    @endif

@endsection