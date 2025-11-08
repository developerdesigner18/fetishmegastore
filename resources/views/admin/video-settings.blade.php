@extends('admin.base')

@section('section_title')
    <strong>{{ __('Video Settings Configuration') }}</strong>
@endsection

@section('section_body')
    @include('admin.configuration-navi')
    <div class="bg-white rounded p-3 text-stone-600">
        <form method="POST" enctype="multipart/form-data">
            @csrf
            <div class="mt-5 flex md:flex-row flex-col md:space-x-5 space-y-10 md:space-y-0">
                <div class="md:w-2/3 w-full">
                    <dl>
                        <dt class="font-semibold text-stone-600">{{ __('Per Day User Limit') }}</dt>
                        <dd>
                            <x-input type="text" name="per_day_user_limit" value="{{ opt('per_day_user_limit') }}"
                                class="md:w-2/3 w-full" />
                        </dd>
                        <br>
                    </dl>
                    <dl>
                        <dt class="font-semibold text-stone-600">{{ __('Sign Up Bonus') }}</dt>
                        <dd>
                            <x-input type="text" name="sign_up_bonus" value="{{ opt('sign_up_bonus') }}"
                                class="md:w-2/3 w-full" />
                        </dd>
                        <br>
                    </dl>
                    <dl>
                        <dt class="font-semibold text-stone-600">{{ __(' Ads Image Upload') }}</dt>
                        <dd>
                            <x-input type="file" name="image" value="{{ opt('image') }}"
                                class="md:w-2/3 w-full" />
                        </dd>
                        <br>
                    </dl>
                    <dl>
                        <dt class="font-semibold text-stone-600">{{ __('Ads Url') }}</dt>
                        <dd>
                            <x-input type="text" name="img_url" value="{{ opt('img_url') }}"
                                class="md:w-2/3 w-full" />
                        </dd>
                        <br>
                    </dl>

                     <dl>
                        <dt class="font-semibold text-stone-600">{{ __('Minimum Token Required') }}</dt>
                        <dd>
                            <x-input type="text" name="min_token_req" value="{{ opt('min_token_req') }}"
                                class="md:w-2/3 w-full" />
                        </dd>
                        <br>
                    </dl>

                    <dl>
                        <dt class="font-semibold text-stone-600">{{ __('Video Row limit') }}</dt>
                        <dd>
                            <x-input type="text" name="video_row_limit" value="{{ opt('video_row_limit') }}"
                                class="md:w-2/3 w-full" />
                        </dd>
                        <br>
                    </dl>
                </div>


            </div>

            <div class="flex w-full my-3">
                <x-button>{{ __('Save Settings') }}</x-button>
            </div>
        </form>


    </div><!-- ./row -->
@endsection
