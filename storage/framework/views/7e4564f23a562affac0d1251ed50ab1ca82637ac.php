<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" prefix="og: https://ogp.me/ns#">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#7c3aed">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Resource Hints for Performance -->
    <link rel="dns-prefetch" href="//www.googletagmanager.com">
    <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>

    <link rel="shortcut icon" type="image/png" href="<?php echo e(asset(opt('favicon', 'favicon.png'))); ?>" sizes="128x128"/>
    <meta name="robots" content="index, follow">
    <title inertia>
        <?php if(request()->route() && request()->route()->getName() == 'home'): ?>
            <?php echo e(\Illuminate\Support\Str::limit('Exclusive Fetish Videos and Premium Content',65, '')); ?>

        <?php else: ?>
            <?php echo e(\Illuminate\Support\Str::limit(opt('seo_title'), 65, '')); ?>

        <?php endif; ?>
    </title>

    <link rel="canonical" href="<?php echo e(url()->current()); ?>">

    <?php
        $appCurrentLocale = app()->currentLocale() ?? 'en';
    ?>


    

    
    

    

    <?php if(request()->route() && request()->route()->getName() == 'channel'): ?>
        <?php
            $streamUser = \App\Models\User::whereUsername(request()->user)->firstOrFail();
        ?>
        <meta property="og:title"
              content="<?php echo e(__(" :channelName channel (:handle)", ['channelName'=> $streamUser->name,'handle' => '@' . $streamUser->username])); ?>"/>
        <meta property="og:url" content="<?php echo e(route('channel', ['user' => $streamUser->username])); ?>"/>
        <meta property="og:image" content="<?php echo e($streamUser->cover_picture); ?>"/>
        <meta property="og:type" content="profile"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="<?php echo e(__(" :channelName channel (:handle)", ['channelName'=> $streamUser->name,'handle' => '@' . $streamUser->username])); ?>"/>
        <meta name="twitter:image" content="<?php echo e($streamUser->cover_picture); ?>"/>
    <?php endif; ?>

    <?php if(request()->route() && request()->route()->getName() == 'video.single.page'): ?>

        <?php


            $videoModel = \App\Models\Video::whereSlug(request()->route('id'))->first();

            $metaTitle = $videoModel->title;
            if (\Illuminate\Support\Str::length($metaTitle) > 65) {
                $metaTitle = Str::limit($metaTitle, 65, '');
            }

            // Safely cast seoDetails to array
            $seoDetails = json_decode(json_encode($videoModel->seoDetails), true);

            $langSeo = $seoDetails[$appCurrentLocale] ?? $seoDetails;
            $seokeyword = '';

            if (is_array($langSeo) && !empty($langSeo['keyword'])) {
                $seokeyword = $langSeo['keyword'];
            } else {
                $seokeyword = $videoModel->categoryNames . ', ' . (!empty($videoModel->tags) ? implode(', ', $videoModel->tags) : '');
            }
        ?>


        <meta name="title" content="<?php echo e(@$langSeo->h2 ?? @$metaTitle); ?>"/>
        <meta name="description" content="<?php echo e(@$langSeo->desc ?? @$videoModel->description); ?>"/>
        <meta name="keywords" content="<?php echo e(@$seokeyword); ?>"/>
        <meta name="robots" content="<?php echo e(@$videoModel->seoDetails->meta_robot); ?>">
        <meta property="og:title" content="<?php echo e(@$videoModel->seoDetails->meta_robotog_title); ?>">
        <meta property="og:description" content="<?php echo e(@$videoModel->seoDetails->og_desc); ?>">
        <meta property="og:image" content="<?php echo e(@$videoModel->seoDetails->og_image_url); ?>">

    <?php elseif(request()->route() && request()->route()->getName() == 'channel'): ?>
        <?php
            $channnleModel =  \App\Models\User::whereUsername(request()->route('user'))
            ->withCount(['followers', 'subscribers', 'videos'])
            ->firstOrFail();

        ?>
        <meta name="description"
              content="<?php echo e(\Illuminate\Support\Str::limit($channnleModel->about ?? get_page_description(), 60, '')); ?>"/>
        <meta name="keywords" content="<?php echo e($channnleModel->headline ?? get_page_keywords()); ?>"/>
    <?php elseif(request()->route() && request()->route()->getName() == 'page'): ?>
        <?php
            $pageModel = \App\Models\Page::where('id',request()->route('page')->id)->first();

        ?>
        <meta name="description"
              content="<?php echo e(\Illuminate\Support\Str::limit( $pageModel->page_title ?? get_page_description(), 60, '')); ?>"/>
        <meta name="keywords" content="<?php echo e($pageModel->page_slug ?? get_page_keywords()); ?>"/>
    <?php elseif(request()->route() && request()->route()->getName() == 'category'): ?>
        <?php
            $categoryDesc = \App\Models\VideoCategories::whereSlug(request()->route('id'))->first();

        ?>
        <meta name="description"
              content="<?php echo e(\Illuminate\Support\Str::limit($categoryDesc->seo_desc ?? get_page_description(),60,'')); ?>"/>
        <meta name="keywords" content="<?php echo e($categoryDesc->seo_keyword ?? get_page_keywords()); ?>"/>
    <?php elseif(request()->route() && request()->route()->getName() == 'model'): ?>
        <?php
            $modelDetails = \App\Models\Models::whereSlug(request()->route('id'))->first();
            $seoDetails = $modelDetails->seo ? json_decode($modelDetails->seo) : null;
        ?>
        <meta name="description" content="<?php echo e(@$seoDetails->desc); ?>"/>
        <meta name="keywords" content="<?php echo e(@$seoDetails->keyword); ?>"/>
    <?php elseif(request()->route() && request()->route()->getName() == 'tag'): ?>
        <?php
            $tagDetails = \App\Models\Tag::whereSlug(request()->route('id'))->first();
            $seoDetails = $tagDetails->seo ? json_decode($tagDetails->seo) : null;

        ?>
        <meta name="description" content="<?php echo e(@$seoDetails->desc); ?>"/>
        <meta name="keywords" content="<?php echo e(@$seoDetails->keyword); ?>"/>
    <?php elseif(request()->route() && request()->route()->getName() == 'web.blog.info'): ?>
        <?php
            $blogDetails = \App\Models\Blog::where('slug',request()->route('slug'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        ?>

        <meta name="title" content="<?php echo e(@$langSeo->h2); ?>"/>
        <meta name="description" content="<?php echo e(@$langSeo->desc); ?>"/>
        <meta name="keywords" content="<?php echo e(@$langSeo->keyword); ?>"/>
        <meta name="robots" content="<?php echo e(@$seoDetails->meta_robot); ?>">
        <meta property="og:title" content="<?php echo e(@$seoDetails->meta_robotog_title); ?>">
        <meta property="og:description" content="<?php echo e(@$seoDetails->og_desc); ?>">
        <meta property="og:image" content="<?php echo e(@$seoDetails->og_image_url); ?>">
    <?php elseif(request()->route() && request()->route()->getName() == 'web.glossar.info'): ?>
        <?php
            $blogDetails = \App\Models\Glossar::where('slug',request()->route('slug'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        ?>

        <meta name="title" content="<?php echo e(@$langSeo->h2); ?>"/>
        <meta name="description" content="<?php echo e(@$langSeo->desc); ?>"/>
        <meta name="keywords" content="<?php echo e(@$langSeo->keyword); ?>"/>
        <meta name="robots" content="<?php echo e(@$seoDetails->meta_robot); ?>">
        <meta property="og:title" content="<?php echo e(@$seoDetails->meta_robotog_title); ?>">
        <meta property="og:description" content="<?php echo e(@$seoDetails->og_desc); ?>">
        <meta property="og:image" content="<?php echo e(@$seoDetails->og_image_url); ?>">
    <?php elseif(request()->route() && request()->route()->getName() == 'web.story.info'): ?>
        <?php
            $blogDetails = \App\Models\Story::where('slug',request()->route('slug'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        ?>

        <meta name="title" content="<?php echo e(@$langSeo->h2); ?>"/>
        <meta name="description" content="<?php echo e(@$langSeo->desc); ?>"/>
        <meta name="keywords" content="<?php echo e(@$langSeo->keyword); ?>"/>
        <meta name="robots" content="<?php echo e(@$seoDetails->meta_robot); ?>">
        <meta property="og:title" content="<?php echo e(@$seoDetails->meta_robotog_title); ?>">
        <meta property="og:description" content="<?php echo e(@$seoDetails->og_desc); ?>">
        <meta property="og:image" content="<?php echo e(@$seoDetails->og_image_url); ?>">
    <?php elseif(request()->route() && request()->route()->getName() == 'short.video.single.page'): ?>
        <?php
            $blogDetails = \App\Models\ShortVideo::where('slug',request()->route('id'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        ?>

        <meta name="title" content="<?php echo e(@$langSeo->h2); ?>"/>
        <meta name="description" content="<?php echo e(@$langSeo->desc); ?>"/>
        <meta name="keywords" content="<?php echo e(@$langSeo->keyword); ?>"/>
        <meta name="robots" content="<?php echo e(@$seoDetails->meta_robot); ?>">
        <meta property="og:title" content="<?php echo e(@$seoDetails->meta_robotog_title); ?>">
        <meta property="og:description" content="<?php echo e(@$seoDetails->og_desc); ?>">
        <meta property="og:image" content="<?php echo e(@$seoDetails->og_image_url); ?>">
    <?php elseif(request()->route() && request()->route()->getName() == 'single.gallery'): ?>
        <?php
            $blogDetails = \App\Models\Gallery::where('slug',request()->route('slug'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        ?>

        <meta name="title" content="<?php echo e(@$langSeo->h2); ?>"/>
        <meta name="description" content="<?php echo e(@$langSeo->desc); ?>"/>
        <meta name="keywords" content="<?php echo e(@$langSeo->keyword); ?>"/>
        <meta name="robots" content="<?php echo e(@$seoDetails->meta_robot); ?>">
        <meta property="og:title" content="<?php echo e(@$seoDetails->meta_robotog_title); ?>">
        <meta property="og:description" content="<?php echo e(@$seoDetails->og_desc); ?>">
        <meta property="og:image" content="<?php echo e(@$seoDetails->og_image_url); ?>">
    <?php else: ?>
        <meta name="description" content="<?php echo e(\Illuminate\Support\Str::limit(get_page_description(),60,'')); ?>"/>
        <meta name="keywords" content="<?php echo e(get_page_keywords()); ?>"/>
    <?php endif; ?>

    
    <?php
        $lcpUrl = null;
        $props = $page['props'] ?? [];
        $getThumb = function($list) {
             if (isset($list['data']) && is_array($list['data']) && count($list['data']) > 0) return $list['data'][0]['thumbnail'] ?? null;
             if (is_array($list) && count($list) > 0 && isset($list[0]['thumbnail'])) return $list[0]['thumbnail'];
             return null;
        };

        // Logic to match BrowseVideos.jsx: Random videos are shown only on first page with no filters
        $isFirstPage = true;
        if (isset($props['videos']['current_page']) && $props['videos']['current_page'] > 1) {
            $isFirstPage = false;
        }

        $hasFilter = false;
        $req = $props['userrequest'] ?? [];
        if (!empty($req['search']) || !empty($req['selectedCategories']) || !empty($req['selectedTags']) || !empty($req['selectedModels'])) {
            $hasFilter = true;
        }

        if ($isFirstPage && !$hasFilter && !empty($props['randomvideos'])) {
            $lcpUrl = $getThumb($props['randomvideos']);
        }

        if (!$lcpUrl && !empty($props['recommendedVideo'])) {
             $lcpUrl = $getThumb($props['recommendedVideo']);
        }

        if (!$lcpUrl && !empty($props['videos'])) {
             $lcpUrl = $getThumb($props['videos']);
        }
    ?>
    <?php if($lcpUrl): ?>
        <link rel="preload" as="image" href="<?php echo e($lcpUrl); ?>" fetchpriority="high" />
    <?php endif; ?>

    <!-- Fonts - Optimized with font-display swap -->
    <link rel="preload" href="<?php echo e(asset('fonts/nunito/fonts.css')); ?>" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" type="text/css" href="<?php echo e(asset('fonts/nunito/fonts.css')); ?>"/></noscript>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" media="print" onload="this.media='all'" />

    <script>
        window.PUSHER_KEY = '<?php echo e(env('PUSHER_APP_KEY')); ?>';
        window.PUSHER_CLUSTER = '<?php echo e(env('PUSHER_APP_CLUSTER')); ?>';
    </script>

    <!-- Google tag (gtag.js) - Optimized Loading -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1E0LGK5Q3D"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'G-1E0LGK5Q3D', {
            'send_page_view': false
        });

        // Send pageview after page is interactive
        window.addEventListener('load', function() {
            gtag('event', 'page_view');
        });
    </script>

    <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "Fetish Mega Store",
              "url": "https://fetishmegastore.com/",
              "logo": "https://fetishmegastore.com/images/2050291934669e45796c22d.jpg",
              "description": "Your one-stop shop for all fetish and BDSM products.",
              "sameAs": [
                "https://www.facebook.com/fetishmegastore",
                "https://www.instagram.com/fetishmegastore",
                "https://twitter.com/fetishmegastore"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "email": "support@fetishmegastore.com"
              }
            },
            {
              "@type": "WebSite",
              "name": "Fetish Mega Store",
              "url": "https://fetishmegastore.com/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://fetishmegastore.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          ]
        }
    </script>


    <!-- Scripts -->
    <?php echo app('Tightenco\Ziggy\BladeRouteGenerator')->generate(); ?>
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"]); ?>
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>

</head>

<body class="font-sans antialiased">
<!-- Skip to main content link for accessibility -->
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-indigo-600 focus:text-white">Skip to main content</a>

<h1 hidden="hidden"><?php echo e(get_seo_h2_tag()); ?></h1>
<h2 hidden="hidden"><?php echo e(get_seo_h2_tag()); ?></h2>
<div id="main-content" class="min-h-screen flex flex-col flex-auto flex-shrink-0" role="main">

    <?php if (isset($component)) { $__componentOriginalb013490f51a30cb3b5995d67d274073c1a17ea7b = $component; } ?>
<?php $component = App\View\Components\Translations::resolve([] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('Translations'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(App\View\Components\Translations::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalb013490f51a30cb3b5995d67d274073c1a17ea7b)): ?>
<?php $component = $__componentOriginalb013490f51a30cb3b5995d67d274073c1a17ea7b; ?>
<?php unset($__componentOriginalb013490f51a30cb3b5995d67d274073c1a17ea7b); ?>
<?php endif; ?>
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
    <div id="modal-root"></div>
</div>
</body>

</html><?php /**PATH /var/www/vhosts/fetishmegastore.com/httpdocs/resources/views/app.blade.php ENDPATH**/ ?>