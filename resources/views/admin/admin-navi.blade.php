<div class="
            fixed
            flex flex-col
            top-14
            left-0
            w-14
            hover:w-64
            md:w-64
            bg-zinc-800
            h-full
            text-white
            transition-all
            duration-300
            border-none
            z-10
            sidebar
        ">
    <div class="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
        <ul class="flex flex-col py-4 space-y-1">
            <li class="px-5 hidden md:block">
                <div class="flex flex-row items-center h-8">
                    <div class="
                                text-sm
                                font-light
                                tracking-wide
                                text-gray-400
                                uppercase
                            ">
                        {{ __('TWITCHER :version', ['version' => TWITCHER_VERSION]) }}
                    </div>
                </div>
            </li>
            <li>
                <a class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                   href="/admin">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-dashboard"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{__("Dashboard")}}</span>
                </a>
            </li>

            <li>
                <a href="{{route('paypal-method.index')}}"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-blog"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Paypal Methods') }}</span></a>
            </li>



            <!-- withdrawal -->
             <li x-data="{ open: {{ Route::is('withdrawal.*') ? 'true' : 'false' }} }" class="relative">
                <a href="#" @click.prevent="open = !open"
                    class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600
                            {{ Route::is('withdrawal.*') ? 'text-white bg-gray-600 border-gray-800' : 'text-white-600 hover:text-white-800 border-transparent' }}
                            border-l-4 pr-6">
                        <span class="inline-flex justify-center items-center ml-4">
                            <i class="fas fa-newspaper"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Withdrawal Manage') }}</span>
                    <svg class="w-4 h-4 ml-auto mr-4 transform transition-transform duration-200"
                        :class="{ 'rotate-90': open }"
                        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </a>

                <!-- Submenu -->
                <ul x-show="open" x-transition
                    class="mt-1 ml-8 bg-gray-700 rounded shadow-lg z-50 overflow-hidden">
                    <li>
                        <a href="{{ route('withdrawal.index') }}"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                {{ request()->routeIs('withdrawal.index') ? 'bg-gray-800 font-semibold' : '' }}">
                            Withdrawal List
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('withdrawal.approved') }}"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                {{ request()->routeIs('withdrawal.approved') ? 'bg-gray-800 font-semibold' : '' }}">
                            Approved List
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('withdrawal.reject') }}"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                {{ request()->routeIs('withdrawal.reject') ? 'bg-gray-800 font-semibold' : '' }}">
                            Reject List
                        </a>
                    </li>
                </ul>
            </li>



            <li>
                <a class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                   href="{{route('users.purchase.history')}}">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-money-bill"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{__("User Purchase History")}}</span>
                </a>
            </li>
            <li>
                <a href="/admin/streamers"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-headset"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Streamers') }}</span></a>
            </li>
            <li>
                <a href="/admin/submitted_vouchers"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">

                        <i class="fa-solid fa-ticket"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('User Submitted Voucher') }}</span></a>
            </li>
            {{--            <li>--}}
            {{--                <a href="/admin/streamers-videos" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">--}}
            {{--                    <span class="inline-flex justify-center items-center ml-4">--}}
            {{--                        <i class="fa-solid fa-video"></i>--}}
            {{--                    </span>--}}
            {{--                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Streamer Videos') }}</span></a>--}}
            {{--            </li>--}}
            <li>
                <a href="/admin/users"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-users"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Users') }}</span></a>
            </li>

             <!-- Affiliate -->
             <li x-data="{ open: {{ Route::is('affiliate.*') ? 'true' : 'false' }} }" class="relative">
                <a href="#" @click.prevent="open = !open"
                    class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600
                            {{ Route::is('affiliate.*') ? 'text-white bg-gray-600 border-gray-800' : 'text-white-600 hover:text-white-800 border-transparent' }}
                            border-l-4 pr-6">
                        <span class="inline-flex justify-center items-center ml-4">
                            <i class="fas fa-newspaper"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Affiliate') }}</span>
                    <svg class="w-4 h-4 ml-auto mr-4 transform transition-transform duration-200"
                        :class="{ 'rotate-90': open }"
                        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </a>

                <!-- Submenu -->
                <ul x-show="open" x-transition
                    class="mt-1 ml-8 bg-gray-700 rounded shadow-lg z-50 overflow-hidden">
                    <li>
                        <a href="{{ route('affiliate.index') }}"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                {{ request()->routeIs('affiliate.index') ? 'bg-gray-800 font-semibold' : '' }}">
                            Affiliate List
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('affiliate.affiliatePending') }}"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                {{ request()->routeIs('affiliate.affiliatePending') ? 'bg-gray-800 font-semibold' : '' }}">
                            Affiliate Pending
                        </a>
                    </li>
                </ul>
            </li>



            
            <li>
                <a href="/admin/models"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-child"></i>
                        <i class="fa-solid fa-child"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Models') }}</span></a>
            </li>
            <li>
                <a href="/admin/token-sales"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-bank"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Token Sales') }}</span></a>
            </li>
            <li>
                <a href="{{route('blog.index')}}"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-blog"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Blogs') }}</span></a>
            </li>

            

            {{-- <li>
                <a href="{{route('glossar.index')}}"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-shop"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Glossar') }}</span></a>
            </li> --}}
            <li>
                <a href="{{route('story.index')}}"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa fa-commenting"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Stories') }}</span></a>
            </li>

            <li>
                <a href="/admin/token-packs"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-box-open"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Token Packages') }}</span></a>
            </li>

            <li>
                <a href="/admin/payout-requests"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-shop"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Payout Requests') }}</span></a>
            </li>
            <li>
                <a href="/admin/audios"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-music"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Audios') }}</span>
                </a>
            </li>
            <li>
                <a href="/admin/ebooks"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-book"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Ebooks') }}</span>
                </a>
            </li>
            <li>
                <a href="/admin/videos"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-film"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Videos') }}</span></a>
            </li>
            <li>
                <a href="/admin/recommended-videos"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-star"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Recommended Videos') }}</span></a>
            </li>
            <li>
                <a href="{{route('short.videos.index')}}"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                         <i class="fa-solid fa-video"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Previews') }}</span></a>
            </li>

            <li>
                <a href="{{route('admin.gallery.index')}}"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                         <i class="fa-solid fa-image"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Gallery') }}</span></a>
            </li>


            <!-- prmo Tools Banner -->
        <li x-data="{ open: @json(Route::is('promoTools.*') || Route::is('promoPreviewVideos.*')) }" class="relative">
    <a href="#" @click.prevent="open = !open"
       class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600
              {{ Route::is('promoTools.*') || Route::is('promoPreviewVideos.*') ? 'text-white bg-gray-600 border-gray-800' : 'text-white-600 hover:text-white-800 border-transparent' }}
              border-l-4 pr-6">
        <span class="inline-flex justify-center items-center ml-4">
            <i class="far fa-address-card"></i>
        </span>
        <span class="ml-2 text-sm tracking-wide truncate">{{ __('Promo Tools') }}</span>
        <svg class="w-4 h-4 ml-auto mr-4 transform transition-transform duration-200"
             :class="{ 'rotate-90': open }"
             fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </a>
    <ul x-show="open" x-transition
        class="mt-1 ml-8 bg-gray-700 rounded shadow-lg z-50 overflow-hidden">
        <li>
            <a href="{{ route('promoTools.index') }}"
               class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                      {{ request()->routeIs('promoTools.index') ? 'bg-gray-800 font-semibold' : '' }}">
                Promo Banner
            </a>
        </li>
        <li>
            <a href="{{ route('promoPreviewVideos.index') }}"
               class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                      {{ request()->routeIs('promoPreviewVideos.index') ? 'bg-gray-800 font-semibold' : '' }}">
                Promo Preview Videos
            </a>
        </li>
    </ul>
</li>

             <!-- End prmo Tools Banner -->

             {{-- newslatters --}}
        <li x-data="{ open: {{ Route::is('newsletter.*') ? 'true' : 'false' }} }" class="relative">
            <a href="#" @click.prevent="open = !open"
                class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600
                        {{ Route::is('newsletter.*') ? 'text-white bg-gray-600 border-gray-800' : 'text-white-600 hover:text-white-800 border-transparent' }}
                        border-l-4 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fas fa-newspaper"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Newsletter Systems') }}</span>
                    <svg class="w-4 h-4 ml-auto mr-4 transform transition-transform duration-200"
                        :class="{ 'rotate-90': open }"
                        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
            </a>
            <ul x-show="open" x-transition
                class="mt-1 ml-8 bg-gray-700 rounded shadow-lg z-50 overflow-hidden">
                <li>
                    <a href="{{ route('newsletter.index') }}"
                    class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                            {{ request()->routeIs('newsletter.index') ? 'bg-gray-800 font-semibold' : '' }}">
                        Template List
                    </a>
                </li>
                <li>
                    <a href="{{ route('EmailTemplating.admin') }}"
                    class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                            {{ request()->routeIs('newsletter.create') ? 'bg-gray-800 font-semibold' : '' }}">
                        Email Templating
                    </a>
                </li>
                <li>
                    <a href="{{ route('newsletter.unsubscribeStatus') }}"
                    class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                            {{ request()->routeIs('newsletter.unsubscribeStatus') ? 'bg-gray-800 font-semibold' : '' }}">
                        Unsubscribe Users
                    </a>
                </li>
            </ul>
        </li>
            {{-- endnewslatter --}}



           <li>
                <a href="{{ route('tracks.index') }}"
                class="relative flex flex-row items-center h-11 focus:outline-none 
                        {{ request()->routeIs('tracks.index') ? 'bg-gray-800 text-white border-gray-800' : 'hover:bg-gray-600 text-white-600 hover:text-white-800 border-transparent hover:border-gray-800' }} 
                        border-l-4 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa fa-commenting"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Affiliate Tracks') }}</span>
                </a>
            </li>


            <li>
                <a href="{{route('faq.index')}}"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-blog"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Faqs') }}</span></a>
            </li>

            <li>
                <a href="/admin/subscriptions"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-user-check"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Subscriptions') }}</span></a>
            </li>
            <li>
                <a href="/admin/requested-videos"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-comment-dots"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('User Request For Video') }}</span></a>
            </li>
            <li>
                <a href="/admin/streamer-bans"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-ban"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Streamer Bans') }}</span></a>
            </li>
            <li>
                <a href="/admin/categories"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Streamer Categories') }}</span></a>
            </li>
            <li>
                <a href="/admin/video-categories"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Video Categories') }}</span></a>
            </li>
            <li>
                <a href="/admin/tag"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Tags') }}</span></a>
            </li>
            <li>
                <a href="/admin/glossar"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Glossar') }}</span></a>
            </li>
            <li>
                <a href="/admin/adBlocks"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Ad Block') }}</span></a>
            </li>
            <li>
                <a href="/admin/cms"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-bookmark"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Pages Manager') }}</span></a>
            </li>


            <li>
                <a href="/admin/configuration"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa pull-right hidden-xs showopacity fa-cog"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('App Configuration') }}</span></a>
            </li>

            <li>
                <a href="/admin/mailconfiguration"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-at"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Mail Server') }}</span>
                </a>
            </li>
            <li>
                <a href="/admin/cloud"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-cloud"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Cloud Storage') }}</span></a>
            </li>
            <li>
                <a href="/admin/config-logins"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-user-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">{{ __('Admin Logins') }}</span></a>
            </li>

        </ul>
        <p class="mb-14 px-5 py-3 hidden md:block text-center text-xs">
            <a href="{{ env('APP_URL') }}" target="_blank">{{ str_ireplace(['http://', 'https://'], ['', ''],
                env('APP_URL')) }}</a>
        </p>
    </div>
</div>
@push('adminExtraJS')
<script src="//unpkg.com/alpinejs" defer></script>

@endpush