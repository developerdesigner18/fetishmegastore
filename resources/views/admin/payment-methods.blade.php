@extends('admin.base')

@section('section_title')
    <strong>{{ __('Payment Methods') }}</strong>
@endsection

@section('section_body')

    <div>
        <a href="{{route('payment_method.add.view')}}"><x-button>Add Payment Method</x-button></a>

    </div>
    <hr class="my-3"/>

    @if (count($payment_method) > 0)

        <table class="table border-collapse w-full bg-white text-stone-600">
            <thead>
            <tr>
                <x-th>{{ __('ID') }}</x-th>
                <x-th>{{ __('Name') }}</x-th>
                <x-th>{{ __('Environment') }}</x-th>
                <x-th>{{ __('Actions') }}</x-th>
            </tr>
            </thead>
            <tbody>
            @foreach ($payment_method as $c)
                <tr>
                    <x-td>
                        <x-slot name="field">{{ __('ID') }}</x-slot>
                        {{ $c->id }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Name') }}</x-slot>
                        {{ $c->name }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Environment') }}</x-slot>
                        {{ $c->environment }}
                    </x-td>
                    <x-td>
                        <x-slot name="field">{{ __('Actions') }}</x-slot>
                        <div class="btn-group">
                            <a class="inline-flex mr-2" href="{{route('payment_method.edit.view',['id' => $c->id])}}">
                                <i class="fa-solid fa-pencil text-teal-600"></i>
                            </a>
                            <a href="{{route('payment_method.delete',['id' => $c->id])}}"
                               onclick="return confirm('{{ __('Are you sure you want to remove this Payment Method from database?')  }}');"
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
        {{ __('No Payment Method in database.') }}
    @endif

@endsection