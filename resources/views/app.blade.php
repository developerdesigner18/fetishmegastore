<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/png" href="{{ asset(opt('favicon', 'favicon.png')) }}" sizes="128x128"/>
    <meta name="robots" content="index, follow">
    <title inertia>
        @if(request()->route() && request()->route()->getName() == 'home')
            {{\Illuminate\Support\Str::limit('Exclusive Fetish Videos and Premium Content',65, '')}}
        @else
            {{ \Illuminate\Support\Str::limit(opt('seo_title'), 65, '') }}
        @endif
    </title>

    <link rel="canonical" href="{{ url()->current() }}">

    @php
        $appCurrentLocale = app()->currentLocale() ?? 'en';
    @endphp


    {{--    @if(request()->route() && request()->route()->getName() == 'home')--}}

    {{--        <meta name="description" content="{{ opt('seo_desc')  }}"/>--}}
    {{--        <meta name="keywords" content="{{ opt('seo_keys')  }}"/>--}}

    {{--    @endif--}}

    @if(request()->route() && request()->route()->getName() == 'channel')
        @php
            $streamUser = \App\Models\User::whereUsername(request()->user)->firstOrFail();
        @endphp
        <meta property="og:title"
              content="{{ __(" :channelName channel (:handle)", ['channelName'=> $streamUser->name,'handle' => '@' . $streamUser->username]) }}"/>
        <meta property="og:url" content="{{ route('channel', ['user' => $streamUser->username]) }}"/>
        <meta property="og:image" content="{{ $streamUser->cover_picture }}"/>
    @endif

    @if(request()->route() && request()->route()->getName() == 'video.single.page')

       @php
    

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
@endphp


        <meta name="title" content="{{ @$langSeo->h2 ?? @$metaTitle }}"/>
        <meta name="description" content="{{ @$langSeo->desc ?? @$videoModel->description  }}"/>
        <meta name="keywords" content="{{@$seokeyword}}"/>
        <meta name="robots" content="{{ @$videoModel->seoDetails->meta_robot }}">
        <meta property="og:title" content="{{@$videoModel->seoDetails->meta_robotog_title}}">
        <meta property="og:description" content="{{@$videoModel->seoDetails->og_desc}}">
        <meta property="og:image" content="{{@$videoModel->seoDetails->og_image_url}}">

    @elseif(request()->route() && request()->route()->getName() == 'channel')
        @php
            $channnleModel =  \App\Models\User::whereUsername(request()->route('user'))
            ->withCount(['followers', 'subscribers', 'videos'])
            ->firstOrFail();

        @endphp
        <meta name="description"
              content="{{ \Illuminate\Support\Str::limit($channnleModel->about ?? get_page_description(), 60, '') }}"/>
        <meta name="keywords" content="{{ $channnleModel->headline ?? get_page_keywords() }}"/>
    @elseif(request()->route() && request()->route()->getName() == 'page')
        @php
            $pageModel = \App\Models\Page::where('id',request()->route('page')->id)->first();

        @endphp
        <meta name="description"
              content="{{ \Illuminate\Support\Str::limit( $pageModel->page_title ?? get_page_description(), 60, '') }}"/>
        <meta name="keywords" content="{{ $pageModel->page_slug ?? get_page_keywords() }}"/>
    @elseif(request()->route() && request()->route()->getName() == 'category')
        @php
            $categoryDesc = \App\Models\VideoCategories::whereSlug(request()->route('id'))->first();

        @endphp
        <meta name="description"
              content="{{ \Illuminate\Support\Str::limit($categoryDesc->seo_desc ?? get_page_description(),60,'') }}"/>
        <meta name="keywords" content="{{ $categoryDesc->seo_keyword ?? get_page_keywords() }}"/>
    @elseif(request()->route() && request()->route()->getName() == 'model')
        @php
            $modelDetails = \App\Models\Models::whereSlug(request()->route('id'))->first();
            $seoDetails = $modelDetails->seo ? json_decode($modelDetails->seo) : null;
        @endphp
        <meta name="description" content="{{ @$seoDetails->desc}}"/>
        <meta name="keywords" content="{{ @$seoDetails->keyword}}"/>
    @elseif(request()->route() && request()->route()->getName() == 'tag')
        @php
            $tagDetails = \App\Models\Tag::whereSlug(request()->route('id'))->first();
            $seoDetails = $tagDetails->seo ? json_decode($tagDetails->seo) : null;

        @endphp
        <meta name="description" content="{{ @$seoDetails->desc}}"/>
        <meta name="keywords" content="{{ @$seoDetails->keyword}}"/>
    @elseif(request()->route() && request()->route()->getName() == 'web.blog.info')
        @php
            $blogDetails = \App\Models\Blog::where('slug',request()->route('slug'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        @endphp

        <meta name="title" content="{{ @$langSeo->h2 }}"/>
        <meta name="description" content="{{ @$langSeo->desc }}"/>
        <meta name="keywords" content="{{@$langSeo->keyword}}"/>
        <meta name="robots" content="{{ @$seoDetails->meta_robot }}">
        <meta property="og:title" content="{{@$seoDetails->meta_robotog_title}}">
        <meta property="og:description" content="{{@$seoDetails->og_desc}}">
        <meta property="og:image" content="{{@$seoDetails->og_image_url}}">
    @elseif(request()->route() && request()->route()->getName() == 'web.glossar.info')
        @php
            $blogDetails = \App\Models\Glossar::where('slug',request()->route('slug'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        @endphp

        <meta name="title" content="{{ @$langSeo->h2 }}"/>
        <meta name="description" content="{{ @$langSeo->desc }}"/>
        <meta name="keywords" content="{{@$langSeo->keyword}}"/>
        <meta name="robots" content="{{ @$seoDetails->meta_robot }}">
        <meta property="og:title" content="{{@$seoDetails->meta_robotog_title}}">
        <meta property="og:description" content="{{@$seoDetails->og_desc}}">
        <meta property="og:image" content="{{@$seoDetails->og_image_url}}">
    @elseif(request()->route() && request()->route()->getName() == 'web.story.info')
        @php
            $blogDetails = \App\Models\Story::where('slug',request()->route('slug'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        @endphp

        <meta name="title" content="{{ @$langSeo->h2 }}"/>
        <meta name="description" content="{{ @$langSeo->desc }}"/>
        <meta name="keywords" content="{{@$langSeo->keyword}}"/>
        <meta name="robots" content="{{ @$seoDetails->meta_robot }}">
        <meta property="og:title" content="{{@$seoDetails->meta_robotog_title}}">
        <meta property="og:description" content="{{@$seoDetails->og_desc}}">
        <meta property="og:image" content="{{@$seoDetails->og_image_url}}">
    @elseif(request()->route() && request()->route()->getName() == 'short.video.single.page')
        @php
            $blogDetails = \App\Models\ShortVideo::where('slug',request()->route('id'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        @endphp

        <meta name="title" content="{{ @$langSeo->h2 }}"/>
        <meta name="description" content="{{ @$langSeo->desc }}"/>
        <meta name="keywords" content="{{@$langSeo->keyword}}"/>
        <meta name="robots" content="{{ @$seoDetails->meta_robot }}">
        <meta property="og:title" content="{{@$seoDetails->meta_robotog_title}}">
        <meta property="og:description" content="{{@$seoDetails->og_desc}}">
        <meta property="og:image" content="{{@$seoDetails->og_image_url}}">
    @elseif(request()->route() && request()->route()->getName() == 'single.gallery')
        @php
            $blogDetails = \App\Models\Gallery::where('slug',request()->route('slug'))->first();
            $seoDetails = $blogDetails->seo ? json_decode($blogDetails->seo) : null;
            $langSeo = $seoDetails->$appCurrentLocale ?? $seoDetails;
        @endphp

        <meta name="title" content="{{ @$langSeo->h2 }}"/>
        <meta name="description" content="{{ @$langSeo->desc }}"/>
        <meta name="keywords" content="{{@$langSeo->keyword}}"/>
        <meta name="robots" content="{{ @$seoDetails->meta_robot }}">
        <meta property="og:title" content="{{@$seoDetails->meta_robotog_title}}">
        <meta property="og:description" content="{{@$seoDetails->og_desc}}">
        <meta property="og:image" content="{{@$seoDetails->og_image_url}}">
    @else
        <meta name="description" content="{{ \Illuminate\Support\Str::limit(get_page_description(),60,'')  }}"/>
        <meta name="keywords" content="{{ get_page_keywords()  }}"/>
    @endif

    <!-- Fonts -->
    <link rel="stylesheet" type="text/css" href="{{ asset('fonts/nunito/fonts.css') }}"/>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

    <script>
        window.PUSHER_KEY = '{{ env('PUSHER_APP_KEY') }}';
        window.PUSHER_CLUSTER = '{{ env('PUSHER_APP_CLUSTER') }}';
    </script>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1E0LGK5Q3D"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'G-1E0LGK5Q3D');
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
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead

</head>

<body class="font-sans antialiased ">

<h1 hidden="hidden">{{get_seo_h2_tag()}}</h1>
<h2 hidden="hidden">{{get_seo_h2_tag()}}</h2>
<div class="min-h-screen flex flex-col flex-auto flex-shrink-0">

    <x-Translations/>
    @inertia
    <div id="modal-root"></div>
</div>
</body>

</html>