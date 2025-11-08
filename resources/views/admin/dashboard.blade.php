@extends('admin.base')

@push('adminExtraCSS')
    <link rel="stylesheet" type="text/css" href="{{ asset('css/morris.css') }}"/>
@endpush

@section('extra_top')
    <div class="md:flex items-center">

        <div class="rounded-lg bg-yellow-400 text-white px-10 py-3 border-2 border-white shadow-md">
            <h1 class="text-2xl font-bold text-center">{{ $allUsers }}</h1>
            <h2 class="text-xl text-center">
                @if ($allUsers == 1)
                    {{ __('User') }}
                @else
                    {{ __('Users') }}
                @endif
            </h2>
        </div>

        <div class="rounded-lg md:ml-5 bg-blue-400 text-white px-10 py-3 border-2 border-white shadow-md">
            <h1 class="text-2xl font-bold text-center">{{ $allStreamers }}</h1>
            <h2 class="text-xl text-center">
                {{ __('Streamers') }}
            </h2>
        </div>

        <div class="rounded-lg md:ml-5 bg-green-500 text-white px-10 py-3 border-2 border-white shadow-md">
            <h1 class="text-2xl font-bold text-center">{{ __('Tokens Sold') }}</h1>
            <h2 class="text-xl text-center">
                {{ $tokensSold }}
            </h2>
        </div>

        <div class="rounded-lg md:ml-5 bg-rose-500 text-white px-10 py-3 border-2 border-white shadow-md">
            <h1 class="text-2xl font-bold text-center">{{ __('Earnings') }}</h1>
            <h2 class="text-xl text-center">
                {{ opt('payment-settings.currency_symbol') . $tokensAmount }}
            </h2>
        </div>

    </div>

    <div class="w-full bg-white mt-10 rounded p-3">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border"><strong>{{ __('Past 30 Days') }}</strong></div>
                <div class="box-body">
                    <!-- LINE CHART -->
                    <div class="chart-responsive">
                        <div class="chart" id="past-30-days"></div>

                    </div><!-- subscription earnings -->
                </div>
            </div>
        </div>
        @endsection

        @section('section_title')
            <strong>{{ __('Dashboard Stats') }}</strong>

            <div class="float-end">
                <a href="javascript:void(0);" class="focus:outline-none text-white bg-indigo-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onclick="generateSiteMap(this)">
                    Generate Sitemap
                </a>
            </div>
        @endsection

        @section('section_body')
        @endsection

        @push('adminExtraJS')
            <script src="{{ asset('js/jquery.min.js') }}"></script>
            <script src="{{ asset('js/morris.min.js') }}"></script>
            <script src="{{ asset('js/raphael-min.js') }}"></script>

            {{-- attention, this is dynamically appended as it contains data from database --}}
            <script>
                window.addEventListener('DOMContentLoaded', (event) => {
                    new Morris.Line({
                        // ID of the element in which to draw the chart.
                        element: 'past-30-days',
                        // Chart data records -- each entry in this array corresponds to a point on
                        // the chart.
                        data: [
                                @if (isset($earnings) and count($earnings))
                                @foreach ($earnings as $d)
                            {
                                date: '{{ $d['date'] }}',
                                amount: '{{ $d['amount'] }}',
                                tokens: '{{ $d['tokens'] }}',
                            },
                                @endforeach
                                @else
                            {
                                date: '{{ date('jS F Y') }}',
                                amount: 0,
                                tokens: 0,
                            }
                            @endif
                        ],
                        // The name of the data record attribute that contains x-values.
                        xkey: 'date',
                        // A list of names of data record attributes that contain y-values.
                        ykeys: ['tokens', 'amount'],
                        // Labels for the ykeys -- will be displayed when you hover over the
                        // chart.
                        labels: ['{{ __("Amount")  }}', '{{__("Tokens")  }}']
                    });
                });

                function generateSiteMap(element) {
                    // Disable the button to prevent multiple clicks
                    element.setAttribute("disabled", "true");
                    element.innerText = "Generating...";

                    fetch("{{ route('admin.generate.sitemap') }}", {
                        method: "POST",
                        headers: {
                            "X-CSRF-TOKEN": "{{ csrf_token() }}",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({})
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message);
                            element.removeAttribute("disabled");
                            element.innerText = "Generate Sitemap";
                        })
                        .catch(error => {
                            console.error("Error:", error);
                            alert("Something went wrong!");
                            element.removeAttribute("disabled");
                            element.innerText = "Generate Sitemap";
                        });
                }
            </script>
    @endpush