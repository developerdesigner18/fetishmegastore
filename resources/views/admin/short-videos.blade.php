@extends('admin.base')

@section('section_title')
    <strong>{{ __('Videos Uploaded by Streamers') }}</strong>
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
<div class="my-5 text-gray-500 font-semibold p-3 rounded">
    <a href="{{ route('add.short.videos') }}" class="float-end px-5 py-3 bg-indigo-800 border border-transparent rounded font-black text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
        Add Short Video
    </a>
</div>
@if (count($videos))
<div class="items-center justify-center p-5">
    <form method="GET" class="flex flex-wrap gap-3 w-full">
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Video category: </label>
            <select name="category[]" class="form-control block" id="categorySelect" multiple>
                @foreach($category as $c)
                    <option value="{{ $c->id }}" @if(in_array($c->id, request()->category ?? [])) selected @endif>
                        {{ $c->category }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Tags: </label>
            <select name="tag[]" class="form-control block" id="tagSelect" multiple>
                @foreach($tag as $t)
                    <option value="{{ $t->id }}" @if(in_array($t->id, request()->tag ?? [])) selected @endif>
                        {{ $t->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Model: </label>
            <select name="model[]" class="form-control block" id="modelSelect" multiple>
                @foreach($model as $m)
                    <option value="{{ $m->id }}" @if(in_array($m->id, request()->model ?? [])) selected @endif>
                        {{ $m->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="flex flex-col flex-1 min-w-[180px]"> 
            <label>Streamer: </label>
            <select name="channels[]" class="form-control block" id="channelsSelect" multiple>
                @foreach($channels as $d)
                    <option value="{{ $d->id }}" @if(in_array($d->id, request()->channels ?? [])) selected @endif>
                        {{ $d->username }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="flex flex-col flex-1 min-w-[180px]">
            <label style="color: transparent">Search</label>
            <x-input name="search" class="form-control block" id="videoSearch" type="text" />
        </div>

        <div class="flex flex-col min-w-[120px]">
            <label style="color: transparent">Search</label>
            <x-button>{{ __('Search') }}</x-button>
        </div>
    </form>
</div>

@else
<div class="bg-white p-3 rounded">
    @if(request()->filled('search'))
        {{ __('No videos matching ":searchTerm"', ['searchTerm' => request('search')]) }}
        <a href="/admin/short-videos" class="text-cyan-600 hover:underline">{{ __("Reset Search") }}</a>
    @else
        {{ __('No videos uploaded by streamers.') }}
    @endif
</div>
@endif



<div id="videosContainer">
    @include('admin.partials.short-videos-list', ['videos' => $videos])
</div>
@endsection

@section('extra_bottom')
@if ($errors->any())
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

<script>
    $('.dataTable').dataTable({ ordering: false });

    var settings = {};
    new TomSelect('#categorySelect', settings);
    new TomSelect('#tagSelect',settings);
    new TomSelect('#modelSelect', settings);
    new TomSelect('#channelsSelect', settings);
</script>

<script>
    $(document).ready(function() {
        $('#videoSearch').on('keyup', function() {
            let query = $(this).val();

            $.ajax({
                url: "{{ route('search.short.videos') }}",
                type: 'GET',
                data: { query: query },
                success: function(data) {
                    $('#videosContainer').html(data.videos);
                }
            });
        });
    });
</script>
@endpush
