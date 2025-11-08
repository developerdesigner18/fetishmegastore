@extends('admin.base')

@section('section_title')
    <strong>{{ __('Ebooks Uploaded by Streamers') }}</strong>
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
    <div class="col-lg-12 my-5 bg-gray-200 text-gray-500 font-semibold border-2 border-gray-300 p-3 rounded flex justify-between items-center">
        {{ __('Here you will find an overview of the Ebooks uploaded by the streamers.') }}
        <x-button><a href="{{ route('admin.ebooks.create') }}" class="btn btn-sm btn-primary">
            {{ __('Upload New Ebook') }}
        </a></x-button>
    </div>
    @if (count($ebooks))
        <div class="items-center justify-center p-5">
            <form action="{{ route('admin.ebooks') }}" method="GET" class="flex flex-wrap gap-3 w-full">
                <div class="flex flex-col flex-1 min-w-[180px]">
                    <label>Tag: </label>
                    <select name="tag[]" class="form-control block" id="tagSelect" multiple>
                        <option value="">{{"Select Tags For Filter Ebook"}}</option>
                        @foreach($tag as $t)
                        <option value={{$t->name}} @if(in_array($t->name,request()->tag ?? [])) selected @endif>{{$t->name}}</option>
                        @endforeach
                    </select>
                </div>

                <div class="flex flex-col flex-1 min-w-[180px]">
                    <label>Ebook Category: </label>
                    <select name="category[]" class="form-control block" id="categorySelect" multiple>
                        <option value="">{{"Select Category For Ebook"}}</option>
                        @foreach($category as $c)
                        <option value={{$c->id}} @if(in_array($c->id,request()->category ?? [])) selected @endif>{{$c->category}}</option>
                        @endforeach
                    </select>
                </div>

                <div class="flex flex-col flex-1 min-w-[180px]">
                    <label>Model: </label>
                    <select name="model[]" class="form-control block" id="modelSelect" multiple>
                        <option value="">{{"Select Model For Ebook"}}</option>
                        @foreach($model as $m)
                        <option value={{$m->id}} @if(in_array($m->id,request()->model ?? [])) selected @endif>{{$m->name}}</option>
                        @endforeach
                    </select>
                </div>

                <div class="flex flex-col flex-1 min-w-[180px]">
                    <label>Channels: </label>
                    <select name="channels[]" class="form-control block" id="channelsSelect" multiple>
                        <option value="">{{"Select Channels For Ebook"}}</option>
                        @foreach($channles as $d)
                        <option value={{$d->id}} @if(in_array($d->id,request()->channels ?? [])) selected @endif>{{$d->username}}</option>
                        @endforeach
                    </select>
                </div>

                <div class="flex flex-col flex-1 min-w-[180px]">
                    <label style="color: transparent">Search</label>
                    <x-input name="search" class="form-control block" id="search" type="text" placeholder="Search for Ebook" />
                </div>

                <div class="flex flex-col min-w-[120px]">
                    <label style="color: transparent">Search</label>
                    <x-button>{{ __('Search') }}</x-button>
                </div>

                <div class="flex flex-col min-w-[120px]">
                    <label style="color: transparent">Clear</label>
                    <a href={{route("admin.ebooks")}}
                        <x-button>{{ __('Clear') }}</x-button>
                    </a>
                </div>
            </form>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            @foreach($ebooks as $v)
                <div class="mr-5 mb-5 border-2 rounded-lg">
                    <div class="relative bg-gray-400 text-center">
                        <i class="fa-solid fa-book text-white text-2xl mb-1 mt-1"></i>
                        <a target="_blank" href={{route("admin.ebooks", [ "ebook"=> $v->id, "slug" => $v->slug ])}}
                            class="font-semibold dark:text-gray-100 hover:text-gray-800 text-gray-600 dark:hover:text-gray-400">
                            <img src="{{asset('/'.$v->thumbnail)}}" class="mb-3 " alt="" />
                        </a>
                        <div class="absolute top-2 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1">
                            {{ $v->price < 1 ? __("Free") : $v->price . __(" tokens") }}
                        </div>
                    </div>
                    <div class="flex items-start p-2">
                        <div class="w-10 flex-shrink-0 mr-2">
                            @if(isset($v->streamer))
                                <a target="_blank" href="{{ route("channel", ["user" => $v->streamer->username]) }}">
                                    <img src="{{ $v->streamer->profile_picture ?? asset('images/no_image.png') }}" class="w-10 h-10 rounded-full" onerror="this.onerror=null; this.src='{{ asset('images/no_image.png') }}';">
                                </a>
                            @else
                                <img src="{{ asset('images/no_image.png') }}" class="w-10 h-10 rounded-full" />
                            @endif
                        </div>
                        <div class="flex-grow">
                            <div>
                                <h3 class="font-semibold text-lg">{{ $v->title }}</h3>
                                <div class="mt-1 text-xs text-gray-500 dark:text-gray-200">
                                    @if($v->streamer)
                                        <div>
                                            <a target="_blank" href="{{ route("channel", ["user" => $v->streamer->username]) }}">
                                                {{ '@' . $v->streamer->username }}
                                            </a>
                                        </div>
                                    @endif
                                    <div class="mt-1">
                                        {{ $v->views === 1 ? __("1 view") : __(":viewsCount views", ["viewsCount" => $v->views]) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-right p-5 w-10">
                            <a href="{{ route('admin.ebooks.edit', ['ebook' => $v->id]) }}" class="text-teal-600 hover:text-teal-800" title="Edit">
                                <i class="fa-solid fa-pencil"></i>
                            </a>
                            <a href="{{ route('admin.ebooks') }}?remove={{ $v->id }}" onclick="return confirm('{{ __('Are you sure you want to remove this Ebook?') }}')" class="text-red-400 hover:text-red-600 ml-2" title="Remove">
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="p-5">
            {{ $ebooks->links() }}
        </div>
    @else
        <div class="bg-white p-3 rounded">
            @if(request()->filled('search'))
            {{ __('No ebooks matching ":searchTerm"', ['searchTerm' => request('search')]) }}
            <a href="/admin/ebooks" class="text-cyan-600 hover:underline">{{ __("Reset Search") }}</a>
            @else
            {{ __('No ebooks uploaded by streamers.') }}
            <a href="/admin/ebooks" class="text-cyan-600 hover:underline">{{ __("Reset Search") }}</a>
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
        $('.dataTable').dataTable({
            ordering: false
        });

        var settings = {};
        new TomSelect('#tagSelect', settings);
        new TomSelect('#categorySelect', settings);
        new TomSelect('#modelSelect', settings);
        new TomSelect('#channelsSelect', settings);
    </script>
@endpush