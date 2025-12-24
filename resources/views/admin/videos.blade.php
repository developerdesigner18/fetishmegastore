@extends('admin.base')

@section('section_title')
    <div class="flex justify-between items-center">
        <strong>{{ __('Videos Uploaded by Streamers') }}</strong>
        <a href="{{ route('admin.videos.create') }}" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
            <i class="fa-solid fa-plus mr-2"></i>{{ __('Create New Video') }}
        </a>
    </div>
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
<div class="my-5 bg-gray-200 text-gray-500 font-semibold border-2 border-gray-300 p-3 rounded">
    {{ __('Here you will find an overview of the videos uploaded by the streamers.') }}
</div>

@if (count($videos))

<div class="items-center justify-center p-5">
    <form method="GET" class="flex flex-wrap gap-3 w-full">
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Tag: </label>
            <select name="tag[]" class="form-control block" id="tagSelect" multiple>

                @foreach($tag as $t)
                    <option value={{$t->name}} @if(in_array($t->name,request()->tag ?? [])) selected @endif>{{$t->name}}</option>
                @endforeach

            </select>
        </div>
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Vedio category: </label>
            <select name="category[]" class="form-control block" id="categorySelect" multiple>

                @foreach($category as $c)
                    <option value={{$c->id}} @if(in_array($c->id,request()->category ?? [])) selected @endif>{{$c->category}}</option>
                @endforeach

            </select>
        </div>
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Model: </label>
            <select name="model[]" class="form-control block" id="modelSelect" multiple>

                @foreach($model as $m)
                    <option value={{$m->id}} @if(in_array($m->id,request()->model ?? [])) selected @endif>{{$m->name}}</option>
                @endforeach
            </select>
        </div>

        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Channels: </label>
            <select name="channels[]" class="form-control block" id="channelsSelect" multiple>

                @foreach($channles as $d)
                    <option value={{$d->id}} @if(in_array($d->id,request()->channels ?? [])) selected @endif>{{$d->username}}</option>
                @endforeach
            </select>
        </div>
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label style="color: transparent">Search</label>
            <x-input name="search" class="form-control block" id="search" type="text" />

        </div>
        <div class="flex flex-col min-w-[120px]">
            <label style="color: transparent">Search</label>
            <x-button>{{ __('Search') }}</x-button>
        </div>
    </form>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    @foreach($videos as $v)
    <div class="mr-5 mb-5 border-2 rounded-lg">
        <div class="relative">
            <a target="_blank" href={{route("video.page", [ "video"=> $v->id, "slug" => $v->slug ])}}
                class="font-semibold dark:text-gray-100 hover:text-gray-800 text-gray-600 dark:hover:text-gray-400">
                <img src="{{$v->thumbnail}}" class="rounded-lg mb-3 " alt="" />
            </a>
            <div
                class="absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1">
                {{ $v->price < 1 ? __("Free") : $v->price . __(" tokens") }} </div>
        </div>
        <div class="flex items-start p-2">
            <div class="w-10 flex-shrink-0 mr-2">
                <a target="_blank" href={{route("channel", ["user"=> $v->streamer->username]) }}>
                    <img src={{ $v->streamer->profile_picture}} class="w-10 h-10 rounded-full" />
                </a>
            </div>
            <div class="flex-grow">
                <div>
                    {{$v->title}}
{{--                    <div class="text-gray-600 text-sm">--}}
{{--                        <a target="_blank"--}}
{{--                            href="{{ route('videos.browse', ['videocategory' => $v->category->id, 'slug' => '-' . $v->category->slug]) }}">--}}
{{--                            <i class="fa-solid fa-tags"></i>--}}
{{--                            {{ $v->category->category }}--}}
{{--                        </a>--}}
{{--                    </div>--}}
                </div>
                <div class="mt-1.5 text-xs text-gray-500 dark:text-gray-200">
                    <div>
                        <a target="_blank" href={{route("channel", ["user"=> $v->streamer->username]) }}>
                            {{ '@' . $v->streamer->username}}
                        </a>
                    </div>
                    <div class="mt-1">
                        {{$v->views === 1
                        ? __("1 view")
                        : __(":viewsCount views", ["viewsCount" => $v->views])}}
                    </div>
                </div>
            </div>
            <div class="text-right p-5 w-10">
                <a href="/admin/videos/edit/{{ $v->id }}"><i class="fa-solid fa-pencil mr-2 text-teal-600"></i></a>
                <a href="/admin/videos?remove={{ $v->id }}"
                    onclick="return confirm('{{ __('Are you sure you want to remove this VIDEO?')  }}')"><i
                        class="fa-solid fa-trash text-red-400"></i></a>
            </div>
        </div>

    </div>
    @endforeach
</div>
</div>

<div class="p-5">
    {{ $videos->links() }}
</div>

@else
<div class="bg-white p-3 rounded">
    @if(request()->filled('search'))
    {{ __('No videos matching ":searchTerm"', ['searchTerm' => request('search')]) }}
    <a href="/admin/videos" class="text-cyan-600 hover:underline">{{ __("Reset Search") }}</a>
    @else
    {{ __('No videos uploaded by streamers.') }}
    @endif
</div>
@endif
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
    $('.dataTable').dataTable({ordering:false});

    var settings = {};
    new TomSelect('#tagSelect',settings);
    new TomSelect('#categorySelect',settings);
    new TomSelect('#modelSelect',settings);
    new TomSelect('#channelsSelect',settings);

</script>
</script>

@endpush