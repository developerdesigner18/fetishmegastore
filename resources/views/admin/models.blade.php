@extends('admin.base')

@section('section_title')
    <strong>{{ __('Models') }}</strong>
@endsection

@section('section_body')

    <div class="my-5 bg-gray-200 text-gray-500 font-semibold border-2 border-gray-300 p-3 rounded">
        {{ __('Here you will find available models.') }}
    </div>

    <div>
        <a href="/admin/model/new" class="px-5 py-3 bg-indigo-800 border border-transparent rounded font-black text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">Add New</a>

    </div>

    @if (count($models))

        <div class="flex items-center justify-end p-5"><!-- Modal toggle -->


            <form method="GET">
                <div class="flex items-center">
                    <x-input name="search" class="w-52 block mr-1" id="search" type="text"/>
                    <x-button>{{ __('Search') }}</x-button>
                </div>
            </form>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            @foreach($models as $v)

                <div class="mr-5 mb-5 border-2 rounded-lg">
                    <div class="relative">
{{--                        <a target="_blank" href={{route("model.page", [ "video"=> $v->id, "slug" => $v->slug ])}}--}}
{{--                class="font-semibold dark:text-gray-100 hover:text-gray-800 text-gray-600 dark:hover:text-gray-400">--}}
                        <img src="{{asset($v->imageUrl)}}" class="rounded-lg mb-3 " alt=""/>
{{--                        </a>--}}

                    </div>
                    <div class="flex items-start p-2">
{{--                        <div class="w-10 flex-shrink-0 mr-2">--}}
{{--                            <a target="_blank" href={{route("channel", ["user"=> $v->streamer->username]) }}>--}}
{{--                                <img src={{ $v->streamer->profile_picture}} class="w-10 h-10 rounded-full" />--}}
{{--                            </a>--}}
{{--                        </div>--}}
                        <div class="flex-grow">
                            <div>
                                {{$v->name}}

                            </div>

                        </div>
                        <div class="text-right p-5 w-10">
                            <a href="/admin/model/edit/{{ $v->id }}"><i
                                        class="fa-solid fa-pencil mr-2 text-teal-600"></i></a>
                            <a href="/admin/model?remove={{ $v->id }}"
                               onclick="return confirm('{{ __('Are you sure you want to remove this MODEL?')  }}')"><i
                                        class="fa-solid fa-trash text-red-400"></i></a>
                        </div>
                    </div>

                </div>
            @endforeach
        </div>
        </div>

        <div class="p-5">
            {{ $models->links() }}
        </div>

    @else
        <div class="bg-white p-3 rounded">
            @if(request()->filled('search'))
                {{ __('No models matching ":searchTerm"', ['searchTerm' => request('search')]) }}
                <a href="/admin/models" class="text-cyan-600 hover:underline">{{ __("Reset Search") }}</a>
            @else
                {{ __('No models available.') }}
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
        $('.dataTable').dataTable({ordering: false});
    </script>
@endpush