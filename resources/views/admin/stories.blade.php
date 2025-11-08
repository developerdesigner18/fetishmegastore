@extends('admin.base')

@section('section_title')
    <strong>{{ __('Stories') }}</strong>
@endsection

@section('section_body')

    <div>
        <a href="{{route('story.add.view')}}"><x-button>Add Story</x-button></a>

    </div>
    <hr class="my-3"/>

    @if (count($blogs) > 0)

        <table class="table border-collapse w-full bg-white text-stone-600 dataTable">
            <thead>
            <tr>
                <x-th>{{ __('ID') }}</x-th>
                <x-th>{{ __('Image') }}</x-th>
                <x-th>{{ __('Title') }}</x-th>
                <x-th>{{ __('Actions') }}</x-th>
            </tr>
            </thead>
            <tbody>
            @foreach ($blogs as $c)
                <tr>
                    <x-td>
                        <x-slot name="field">{{ __('ID') }}</x-slot>
                        {{ $c->id }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Image') }}</x-slot>
                        <img src="{{asset($c->image)}}" alt="{{ $c->image }}" height="100px" width="100px">
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Title') }}</x-slot>
                        {{ $c->title }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Actions') }}</x-slot>
                        <div class="btn-group">
                            <a class="inline-flex mr-2" href="{{route('story.edit.view',['id' => $c->id])}}">
                                <i class="fa-solid fa-pencil text-teal-600"></i>
                            </a>
                            <a href="{{route('story.delete',['id' => $c->id])}}"
                               onclick="return confirm('{{ __('Are you sure you want to remove this story from database?')  }}');"
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
        {{ __('No Stories in database.') }}
    @endif

@endsection

@push('adminExtraJS')
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    {{-- attention, dynamic because only needed on this page to save resources --}}
    <script>
         $(document).ready(function() {
             $('.dataTable').dataTable({ordering:false});
         });
    </script>
@endpush