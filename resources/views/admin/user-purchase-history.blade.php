@extends('admin.base')

@section('section_title')
    <strong>{{ __(':type Management', ['type' => ucfirst($active)]) }}</strong>
@endsection

@section('section_body')

    @php
        $activeClass = 'px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-blue-700 border border-blue-700 transition-colors duration-300';

        $notActiveClass = 'px-4 py-2 rounded-lg font-semibold text-black bg-gray-400 border border-gray-500';
    @endphp


    <div class="p-3">


        <a href="?type=active" class="{{request()->get('type') == 'deleted' ? $notActiveClass : $activeClass}}">
            Active History
        </a>

        <!-- Inactive Button with Border -->
        <a href="?type=deleted" class="{{request()->get('type') == 'deleted' ? $activeClass : $notActiveClass}}">
            Removed History
        </a>
    </div>

    <table class="text-stone-600 table border-collapse w-full bg-white dataTable ">
        <thead>
        <tr>
            <x-th>{{ __('ID') }}</x-th>
            <x-th>{{ __('Video') }}</x-th>
            <x-th>{{ __('User') }}</x-th>
            <x-th>{{ __('Price') }}</x-th>
            @if(request()->get('type') == 'deleted')
                <x-th>{{ __('Removed At') }}</x-th>
            @else
                <x-th>{{ __('Purchased At') }}</x-th>
            @endif

        </tr>
        </thead>
        
        <tbody>
        @foreach ($data as $details)
       
            <tr>
                <td>
                    {{$details->id}}
                </td>
                <td>
                    {{$details->video->title ?? ''}}
                </td>
                <td>
                    {{$details->user->name ?? ''}}
                </td>
                <td>
                    {{$details->price}}
                </td>
                <td>
                    @if(request()->get('type') == 'deleted')
                        {{ $details->deleted_at_human }}
                    @else
                        {{ $details->created_at_human }}
                    @endif
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <div class="p-5">
        {{ $data->withQueryString()->links() }}
    </div>
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
        // $(document).ready(function() {
        //     $('.dataTable').dataTable({ordering:false});
        // });
    </script>
@endpush