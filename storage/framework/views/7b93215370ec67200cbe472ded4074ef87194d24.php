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
                        <?php echo e(__('TWITCHER :version', ['version' => TWITCHER_VERSION])); ?>

                    </div>
                </div>
            </li>
            <li>
                <a class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                   href="/admin">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-dashboard"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__("Dashboard")); ?></span>
                </a>
            </li>

            <li>
                <a href="<?php echo e(route('paypal-method.index')); ?>"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-blog"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Paypal Methods')); ?></span></a>
            </li>



            <!-- withdrawal -->
             <li x-data="{ open: <?php echo e(Route::is('withdrawal.*') ? 'true' : 'false'); ?> }" class="relative">
                <a href="#" @click.prevent="open = !open"
                    class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600
                            <?php echo e(Route::is('withdrawal.*') ? 'text-white bg-gray-600 border-gray-800' : 'text-white-600 hover:text-white-800 border-transparent'); ?>

                            border-l-4 pr-6">
                        <span class="inline-flex justify-center items-center ml-4">
                            <i class="fas fa-newspaper"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Withdrawal Manage')); ?></span>
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
                        <a href="<?php echo e(route('withdrawal.index')); ?>"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                <?php echo e(request()->routeIs('withdrawal.index') ? 'bg-gray-800 font-semibold' : ''); ?>">
                            Withdrawal List
                        </a>
                    </li>
                    <li>
                        <a href="<?php echo e(route('withdrawal.approved')); ?>"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                <?php echo e(request()->routeIs('withdrawal.approved') ? 'bg-gray-800 font-semibold' : ''); ?>">
                            Approved List
                        </a>
                    </li>
                    <li>
                        <a href="<?php echo e(route('withdrawal.reject')); ?>"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                <?php echo e(request()->routeIs('withdrawal.reject') ? 'bg-gray-800 font-semibold' : ''); ?>">
                            Reject List
                        </a>
                    </li>
                </ul>
            </li>



            <li>
                <a class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                   href="<?php echo e(route('users.purchase.history')); ?>">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-money-bill"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__("User Purchase History")); ?></span>
                </a>
            </li>
            <li>
                <a href="/admin/streamers"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-headset"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Streamers')); ?></span></a>
            </li>
            <li>
                <a href="/admin/submitted_vouchers"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">

                        <i class="fa-solid fa-ticket"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('User Submitted Voucher')); ?></span></a>
            </li>
            
            
            
            
            
            
            
            <li>
                <a href="/admin/users"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-users"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Users')); ?></span></a>
            </li>

             <!-- Affiliate -->
             <li x-data="{ open: <?php echo e(Route::is('affiliate.*') ? 'true' : 'false'); ?> }" class="relative">
                <a href="#" @click.prevent="open = !open"
                    class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600
                            <?php echo e(Route::is('affiliate.*') ? 'text-white bg-gray-600 border-gray-800' : 'text-white-600 hover:text-white-800 border-transparent'); ?>

                            border-l-4 pr-6">
                        <span class="inline-flex justify-center items-center ml-4">
                            <i class="fas fa-newspaper"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Affiliate')); ?></span>
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
                        <a href="<?php echo e(route('affiliate.index')); ?>"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                <?php echo e(request()->routeIs('affiliate.index') ? 'bg-gray-800 font-semibold' : ''); ?>">
                            Affiliate List
                        </a>
                    </li>
                    <li>
                        <a href="<?php echo e(route('affiliate.affiliatePending')); ?>"
                        class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                                <?php echo e(request()->routeIs('affiliate.affiliatePending') ? 'bg-gray-800 font-semibold' : ''); ?>">
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
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Models')); ?></span></a>
            </li>
            <li>
                <a href="/admin/token-sales"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-bank"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Token Sales')); ?></span></a>
            </li>
            <li>
                <a href="<?php echo e(route('blog.index')); ?>"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-blog"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Blogs')); ?></span></a>
            </li>

            

            
            <li>
                <a href="<?php echo e(route('story.index')); ?>"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa fa-commenting"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Stories')); ?></span></a>
            </li>

            <li>
                <a href="/admin/token-packs"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-box-open"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Token Packages')); ?></span></a>
            </li>

            <li>
                <a href="/admin/payout-requests"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-shop"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Payout Requests')); ?></span></a>
            </li>
            <li>
                <a href="/admin/audios"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-music"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Audios')); ?></span>
                </a>
            </li>
            <li>
                <a href="/admin/ebooks"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-book"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Ebooks')); ?></span>
                </a>
            </li>
            <li>
                <a href="/admin/videos"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-film"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Videos')); ?></span></a>
            </li>
            <li>
                <a href="/admin/recommended-videos"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-star"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Recommended Videos')); ?></span></a>
            </li>
            <li>
                <a href="<?php echo e(route('short.videos.index')); ?>"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                         <i class="fa-solid fa-video"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Previews')); ?></span></a>
            </li>

            <li>
                <a href="<?php echo e(route('admin.gallery.index')); ?>"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                         <i class="fa-solid fa-image"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Gallery')); ?></span></a>
            </li>


            <!-- prmo Tools Banner -->
        <li x-data="{ open: <?php echo json_encode(Route::is('promoTools.*') || Route::is('promoPreviewVideos.*'), 15, 512) ?> }" class="relative">
    <a href="#" @click.prevent="open = !open"
       class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600
              <?php echo e(Route::is('promoTools.*') || Route::is('promoPreviewVideos.*') ? 'text-white bg-gray-600 border-gray-800' : 'text-white-600 hover:text-white-800 border-transparent'); ?>

              border-l-4 pr-6">
        <span class="inline-flex justify-center items-center ml-4">
            <i class="far fa-address-card"></i>
        </span>
        <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Promo Tools')); ?></span>
        <svg class="w-4 h-4 ml-auto mr-4 transform transition-transform duration-200"
             :class="{ 'rotate-90': open }"
             fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </a>
    <ul x-show="open" x-transition
        class="mt-1 ml-8 bg-gray-700 rounded shadow-lg z-50 overflow-hidden">
        <li>
            <a href="<?php echo e(route('promoTools.index')); ?>"
               class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                      <?php echo e(request()->routeIs('promoTools.index') ? 'bg-gray-800 font-semibold' : ''); ?>">
                Promo Banner
            </a>
        </li>
        <li>
            <a href="<?php echo e(route('promoPreviewVideos.index')); ?>"
               class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                      <?php echo e(request()->routeIs('promoPreviewVideos.index') ? 'bg-gray-800 font-semibold' : ''); ?>">
                Promo Preview Videos
            </a>
        </li>
    </ul>
</li>

             <!-- End prmo Tools Banner -->

             
        <li x-data="{ open: <?php echo e(Route::is('newsletter.*') ? 'true' : 'false'); ?> }" class="relative">
            <a href="#" @click.prevent="open = !open"
                class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600
                        <?php echo e(Route::is('newsletter.*') ? 'text-white bg-gray-600 border-gray-800' : 'text-white-600 hover:text-white-800 border-transparent'); ?>

                        border-l-4 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fas fa-newspaper"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Newsletter Systems')); ?></span>
                    <svg class="w-4 h-4 ml-auto mr-4 transform transition-transform duration-200"
                        :class="{ 'rotate-90': open }"
                        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
            </a>
            <ul x-show="open" x-transition
                class="mt-1 ml-8 bg-gray-700 rounded shadow-lg z-50 overflow-hidden">
                <li>
                    <a href="<?php echo e(route('newsletter.index')); ?>"
                    class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                            <?php echo e(request()->routeIs('newsletter.index') ? 'bg-gray-800 font-semibold' : ''); ?>">
                        Template List
                    </a>
                </li>
                <li>
                    <a href="<?php echo e(route('EmailTemplating.admin')); ?>"
                    class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                            <?php echo e(request()->routeIs('newsletter.create') ? 'bg-gray-800 font-semibold' : ''); ?>">
                        Email Templating
                    </a>
                </li>
                <li>
                    <a href="<?php echo e(route('newsletter.unsubscribeStatus')); ?>"
                    class="block px-4 py-2 text-sm text-white hover:bg-gray-600
                            <?php echo e(request()->routeIs('newsletter.unsubscribeStatus') ? 'bg-gray-800 font-semibold' : ''); ?>">
                        Unsubscribe Users
                    </a>
                </li>
            </ul>
        </li>
            



           <li>
                <a href="<?php echo e(route('tracks.index')); ?>"
                class="relative flex flex-row items-center h-11 focus:outline-none 
                        <?php echo e(request()->routeIs('tracks.index') ? 'bg-gray-800 text-white border-gray-800' : 'hover:bg-gray-600 text-white-600 hover:text-white-800 border-transparent hover:border-gray-800'); ?> 
                        border-l-4 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa fa-commenting"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Affiliate Tracks')); ?></span>
                </a>
            </li>


            <li>
                <a href="<?php echo e(route('faq.index')); ?>"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-blog"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Faqs')); ?></span></a>
            </li>

            <li>
                <a href="/admin/subscriptions"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-user-check"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Subscriptions')); ?></span></a>
            </li>
            <li>
                <a href="/admin/requested-videos"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-comment-dots"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('User Request For Video')); ?></span></a>
            </li>
            <li>
                <a href="/admin/streamer-bans"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-ban"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Streamer Bans')); ?></span></a>
            </li>
            <li>
                <a href="/admin/categories"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Streamer Categories')); ?></span></a>
            </li>
            <li>
                <a href="/admin/video-categories"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Video Categories')); ?></span></a>
            </li>
            <li>
                <a href="/admin/tag"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Tags')); ?></span></a>
            </li>
            <li>
                <a href="/admin/glossar"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Glossar')); ?></span></a>
            </li>
            <li>
                <a href="/admin/adBlocks"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Ad Block')); ?></span></a>
            </li>
            <li>
                <a href="/admin/cms"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-bookmark"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Pages Manager')); ?></span></a>
            </li>


            <li>
                <a href="/admin/configuration"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa pull-right hidden-xs showopacity fa-cog"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('App Configuration')); ?></span></a>
            </li>

            <li>
                <a href="/admin/mailconfiguration"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-at"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Mail Server')); ?></span>
                </a>
            </li>
            <li>
                <a href="/admin/cloud"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-cloud"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Cloud Storage')); ?></span></a>
            </li>
            <li>
                <a href="/admin/config-logins"
                   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                        <i class="fa-solid fa-user-tag"></i>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate"><?php echo e(__('Admin Logins')); ?></span></a>
            </li>

        </ul>
        <p class="mb-14 px-5 py-3 hidden md:block text-center text-xs">
            <a href="<?php echo e(env('APP_URL')); ?>" target="_blank"><?php echo e(str_ireplace(['http://', 'https://'], ['', ''],
                env('APP_URL'))); ?></a>
        </p>
    </div>
</div>
<?php $__env->startPush('adminExtraJS'); ?>
<script src="//unpkg.com/alpinejs" defer></script>

<?php $__env->stopPush(); ?><?php /**PATH /var/www/vhosts/fetishmegastore.com/httpdocs/resources/views/admin/admin-navi.blade.php ENDPATH**/ ?>