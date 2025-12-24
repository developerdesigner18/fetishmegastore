<?php

namespace App\Http\Controllers;

use App\Models\ContentWatchHistory;
use App\Models\Models;
use App\Models\PurchaseHistory;
use App\Models\ShortVideo;
use App\Models\PreviewSales;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\App;
use App\Models\Video;
use App\Models\TokenPack;
use App\Models\TokenSale;
use App\Models\VideoCategories;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class ShortVideoController extends Controller
{
    public function shortVideos(Request $request)
    {

        $active = 'short-videos';
        $videos = ShortVideo::orderByDesc('id');
         
        if ($request->filled('search')) {
            $videos->where('title', 'LIKE', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $videos->where(function ($query) use ($request) {
                foreach ($request->category as $key => $categoryId) {
                    if ($key == 0) {
                        $query->where('category_id', 'LIKE', "%{$categoryId}%");
                    } else {
                        $query->orWhere('category_id', 'LIKE', "%{$categoryId}%");
                    }
                }
            });
        }


        if ($request->filled('tag')) {
            foreach ($request->tag as $key => $tag) {
                if ($key == 0) {
                    $videos->where('tags', 'LIKE', "%{$tag}%");
                } else {
                    $videos->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            }
        }

        if ($request->filled('model')) {
            foreach ($request->model as $key => $model) {
                if ($key == 0) {
                    $videos->where('model_id', 'LIKE', "%{$model}%");
                } else {
                    $videos->orWhere('model_id', 'LIKE', "%{$model}%");
                }
            }
        }

        if ($request->filled('channels')) {
            $videos->whereIn('user_id', $request->channels);
        }

        $tag = Tag::all();
        $category = VideoCategories::all();
        $model = Models::all();
        $channels = User::select('username','name','id')->where('is_streamer', 'yes')->get();

        $videos = $videos->paginate(9);
         
        return view('admin.short-videos', compact('active', 'videos', 'tag', 'category', 'model','channels'));
    }

    public function searchShortVideos(Request $request)
    {
        $query = $request->input('query');

        $videos = ShortVideo::where('title', 'LIKE', "%{$query}%")
            ->orWhere('slug', 'LIKE', "%{$query}%")
            ->paginate(9);

        return response()->json([
            'videos' => view('admin.partials.short-videos-list', compact('videos'))->render()
        ]);
    }

    public function addVideo(Request $request)
    {
        $active = 'videos';
        $video_categories = VideoCategories::orderBy('category')->get();

        $tags = Tag::orderBy('id', 'desc')->get();

        $model = Models::orderBy('id', 'desc')->get();

        $imageDirectory = public_path('short-videos');
        $availableVideos = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
               foreach ($availableVideos as $videoDeatils) {
                   $array = [];
                   $array['label'] = $videoDeatils->getFilename();
                   $array['value'] = 'short-videos/'.$videoDeatils->getFilename();
                   $fileNames[] = $array;
               }

        //        $imageDirectory = public_path('videos');
        ////        $directories = File::directories($imageDirectory);
        //        $availableVideos = \Illuminate\Support\Facades\File::files($imageDirectory);
        //        $fileNames = [];
        foreach ($availableVideos as $videoDeatils) {

            $checkString = 'short-videos/' . $videoDeatils->getFilename();
            $checkIfThatVideoAlreadyAssigned = ShortVideo::where('video', $checkString)->exists();

            if ($checkIfThatVideoAlreadyAssigned) {
                continue;
            }

            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = 'short-videos/' . $videoDeatils->getFilename();
            $fileNames[] = $array;
        }

        $shortVideo = Video::select('id', 'title')->get();
        $systemVideo = [];

        foreach ($shortVideo as $details) {
            // $systemVideo[] = ['label' => $details->title, 'value' => $details->id];
            $title = json_decode($details->getRawOriginal('title'));
            $val = App::currentLocale();
            $systemVideo[] = ['label' => $title, 'value' => $details->id];
        }
        $streamer = User::select('id', 'username')->where('is_streamer', 'yes')->get();
        $supportedLocales = getSupportedLocales();
        // dd($video_categories, $shortVideo, $systemVideo);

        return view('admin.add-short-video', compact('active', 'video_categories', 'tags', 'model', 'fileNames', 'systemVideo', 'streamer','supportedLocales'));
    }

    public function saveVideo(Request $request)
    {
        $request->merge([
            'is_promo_video' => $request->has('is_promo_video') ? $request->is_promo_video : 0
        ]);

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'required',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
            'category_id' => 'required',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        $disk = env('FILESYSTEM_DISK', 'public');
        Storage::disk($disk)->makeDirectory('short-videos');
        Storage::disk($disk)->makeDirectory('short-videos/thumbnail');

        $thumbFile = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnail = Image::make($request->file('thumbnail'))->stream();
            $thumbFile = 'short-videos/thumbnail/' . uniqid() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            $thumbFile = $thumbFile;
        }

        DB::beginTransaction();
        try {
            $titleData = ['en' => $request->title];
            if ($request->filled('title_lang') && $request->filled('title_de')) {
                $titleData[$request->title_lang] = $request->title_de;
            }

            // Step 2: Description ke liye dynamic array banayein
            $descriptionData = ['en' => $request->description];
            if ($request->filled('description_lang') && $request->filled('description')) {
                $descriptionData[$request->description_lang] = $request->description_de;
            }
            // dd($request->all(), $titleData, $descriptionData);

            // $blog = new ShortVideo();
            // $blog->is_promo_video = $request->is_promo_video;
            // $blog->title = $titleData;
            // $blog->user_id = $request->user_id;
            // $blog->title_lang = $request->title_lang;
            // $blog->description = $descriptionData;
            // $blog->description_lang = $request->description_lang;
            // $blog->slug = Str::slug($request->title);
            // $blog->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            // $blog->model_id = !empty($request->model_id) ? implode(',', $request->model_id) : null;
            // $blog->tags = !empty($request->tags) ? implode(',', $request->tags) : null;
            // $blog->video_id = $request->video_id;
            // $blog->type = 'short-video';
            //$blog->price = $request->price ?? 0;

            // if ($request->hasFile('thumbnail')) {
            //     $thumbnail = Image::make($request->file('thumbnail'))->stream();
            //     $thumbFile = 'short-videos/thumbnail/' . uniqid() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
            //     Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            //     Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            //     $blog->thumbnail = $thumbFile;
            // }
            // $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            // dd($blog);
            // $blog->save();
            // $blog = new ShortVideo();

            $shortVideo =ShortVideo::create([
                'user_id' => $request->user_id,
                'title' => json_encode($titleData),
                'slug' => Str::slug($request->title) . '-' . uniqid(),
                'thumbnail' => $thumbFile,
                'video' => $request->video,
                'type' => 'short-video',
                'category_id' => implode(',', $request->category_id),
                'model_id' => $request->model_id ? implode(',', $request->model_id) : null,
                'tags' => implode(',', $request->tags),
                'description' =>json_encode($descriptionData),
                'seo' => $request->has('seo') ? json_encode($request->seo) : null,
                'title_lang' => $request->title_lang,
                'description_lang' => $request->description_lang,
                'video_id' => $request->video_id ?? null,
                'views' => ShortVideo::RandomViews(),
            ]);
            createGif($shortVideo->id);
            DB::commit();

        } catch (\Exception $exception) {
            DB::rollBack();
            if ($thumbFile && Storage::disk($disk)->exists('short-videos/thumbnail/' . $thumbFile)) {
                Storage::disk($disk)->delete('short-videos/thumbnail/' . $thumbFile);
            }
            Log::error("ShortVideo Save Failed: " . $exception->getMessage() . " for user " . $request->user_id);
            return back()->withErrors(['error' => 'An error occurred while saving the short video. Please try again.']);
        }
        return redirect()->route('short.videos.index')->with('msg', __('Short Video Added Successfully!'));
    }

    public function updateVideo(Request $request)
    {
        // dd($request->all());
        $request->merge([
            'is_promo_video' => $request->has('is_promo_video') ? $request->is_promo_video : 0
        ]);

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'title' => 'required',
            'description' => 'required',
            'thumbnail' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg',

            //            'video' => 'sometimes|mimes:mp4,mkv,3gp',
            //'video' => 'sometimes',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }
        $titleData = ['en' => $request->title];
        if ($request->filled('title_lang') && $request->filled('title_de')) {
            $titleData[$request->title_lang] = $request->title_de;
        }

        // Step 2: Description ke liye dynamic array banayein
        $descriptionData = ['en' => $request->description];
        if ($request->filled('description_lang') && $request->filled('description')) {
            $descriptionData[$request->description_lang] = $request->description_de;
        }
        // dd($request->all(), $titleData, $descriptionData);

        try {

            $blog = ShortVideo::find($request->id);
            $blog->is_promo_video = $request->is_promo_video;
            $blog->title = $titleData;
            $blog->title_lang = $request->title_lang;
            $blog->user_id = $request->user_id;
            $blog->description = $descriptionData;
            $blog->description_lang = $request->description_lang;
            $blog->slug = Str::slug($request->title);
            $blog->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $blog->model_id = !empty($request->model_id) ? implode(',', $request->model_id) : null;
            $blog->tags = !empty($request->tags) ? implode(',', $request->tags) : null;
            $blog->video_id = $request->video_id;
            $blog->type = 'short-video';

            $hasNewthumbnail = false;
            $hasNewVideo = false;
            if ($request->hasFile('thumbnail')) {
                $originalThumbnail = DB::table('short_videos')->find($request->id)->thumbnail;
                $thumbnail = Image::make($request->file('thumbnail'))->stream();
                $thumbFile = 'short-videos/thumbnail/' . uniqid() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $blog->thumbnail = $thumbFile;
                $hasNewthumbnail = true;
            }

            //            if($request->hasFile('video')){
            //                $originalVideo = DB::table('short_videos')->find($request->id)->video;
            //                $fileName = uniqid() . '.' . $request->file('video')->getClientOriginalExtension();
            //                $filePath = 'short-videos/' . $fileName;
            //
            //                // Save the file
            //                Storage::disk(env('FILESYSTEM_DISK'))->put($filePath, file_get_contents($request->file('video')));
            //
            //                // Set the visibility of the file to public
            //                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($filePath, 'public');
            //
            //                // Save the file path to the blog video
            //                $blog->video = $filePath;
            //                $hasNewVideo = true;
            //            }
            $blog->video = $request->video;
            $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $blog->save();

            if ($hasNewthumbnail && $blog) {
                unlink(public_path($originalThumbnail));
            }

            //            if($hasNewVideo && $blog){
            //                unlink(public_path($originalVideo));
            //            }

            return redirect()->route('short.videos.index')->with('msg', __('Short Video updated Successfully!'));
        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }
    }

    public function editVideo(Request $request, $id)
    {
        $video = ShortVideo::find($id);

        if (!$video) {
            return redirect()->route('short.videos.index')->with('msg', __('Short video not exist!'));
        }
        $active = 'videos';
        $video_categories = VideoCategories::orderBy('category')->get();

        $tags = Tag::orderBy('id', 'desc')->get();
        $ogValue = DB::table('short_videos')->find($video->id);

        $isJson = Str::isJson($ogValue->title);

        if (!$isJson) {
            $ogValue->title = $ogValue->title;
            $ogValue->description = $ogValue->description;
        } else {
            $ogValue->title = json_decode($ogValue->title);
            $ogValue->description = json_decode($ogValue->description);
        }

        $model = Models::orderBy('id', 'desc')->get();

        $imageDirectory = public_path('short-videos');
        $availableVideos = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
        foreach ($availableVideos as $videoDeatils) {
            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = 'short-videos/' . $videoDeatils->getFilename();
            $fileNames[] = $array;
        }

        $video->video = explode('/', $video->video)[1];

        $shortVideo = Video::select('id', 'title')->get();
        $systemVideo = [];

        foreach ($shortVideo as $details) {
            // $systemVideo[] = ['label' => $details->title, 'value' => $details->id];
            $title = json_decode($details->getRawOriginal('title'));
            $val = App::currentLocale();
            $systemVideo[] = ['label' => $title, 'value' => $details->id];
        }
        $streamer = User::select('id', 'username')->where('is_streamer', 'yes')->get();

        $supportedLocales = getSupportedLocales();

        // $decodedTitle = json_decode($video->title, true) ?? [];
        // $video->title_en_val = $decodedTitle['en'] ?? '';
        // $video->selectedLang = $video->title_lang ?? '';
        // $video->title_de_val = $video->selectedLang && isset($decodedTitle[$video->selectedLang])
        //     ? $decodedTitle[$video->selectedLang]
        //     : '';

        // // Decode description JSON
        // $decodedDescription = json_decode($video->description, true) ?? [];
        // $video->description_en_val = $decodedDescription['en'] ?? '';
        // $video->selectedDescriptionLang = $video->description_lang ?? '';
        // $video->description_de_val = $video->selectedDescriptionLang && isset($decodedDescription[$video->selectedDescriptionLang])
        //     ? $decodedDescription[$video->selectedDescriptionLang] : '';
        // dd($video->title, $video->video, $video);

        if ($video->title_lang === null || trim($video->title_lang) === "") {
            $video->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($video->description_lang === null || trim($video->description_lang) === "") {
            $ogValue->description_lang = "de";
            $video->description_lang = "de";
        }
        // dd($video->title_lang, $video->description_lang, $video);
        return view('admin.edit-short-video', compact('active', 'video_categories', 'tags', 'video', 'ogValue', 'model', 'fileNames', 'systemVideo', 'streamer','supportedLocales'));
    }

    public function deleteVideo($id)
    {
        $shortVideo = ShortVideo::find($id);

        if (!$shortVideo) {
            return redirect()->route('short.videos.index')->with('msg', __('Short Video Not Found!'));
        }

        $originalVideo = $shortVideo->video;
        $originalThumbnail = $shortVideo->thumbnail;

        if (file_exists(public_path($originalThumbnail))) {
            unlink(public_path($originalThumbnail));
        }

        if (file_exists(public_path($originalVideo))) {
            unlink(public_path($originalVideo));
        }

        $shortVideo->delete();

        return redirect()->route('short.videos.index')->with('msg', __('Short Video Deleted Successfully!'));
    }

    public function browse(Request $request)
    {
      
        $watchVideos = collect();

        if (auth()->check()) {
            $slugs = session('unauth_viewed_videos', []);

            if (!empty($slugs)) {
                // Get videos from both Video and ShortVideo tables
                $videos = Video::whereIn('slug', $slugs)->get();
                $shortVideos = ShortVideo::whereIn('slug', $slugs)->get();

                // Merge collections
                $watchVideos = $videos->merge($shortVideos);

                foreach ($watchVideos as $watchVideo) {
                    $videoId = $watchVideo->id;
                    $videoType = $watchVideo instanceof ShortVideo ? 'short-video' : 'video';

                    $alreadyExists = ContentWatchHistory::where('user_id', auth()->id())
                        ->where('video_id', $videoId)
                        ->first();

                    if (!$alreadyExists) {
                        ContentWatchHistory::create([
                            'user_id' => auth()->id(),
                            'IP' => request()->ip() ?? '',
                            'type' => $videoType,
                            'video_id' => $videoId,
                            'date' => Carbon::today()->format('Y-m-d'),
                        ]);
                    }
                }

                session()->forget('unauth_viewed_videos');
            }
        }

        $userrequest['page'] = $request->get("page", 1);

        $userrequest['sort'] = $request->get('sort', 'Recently');

        $whereUser = User::where('is_streamer_verified', 'yes')->where('is_streamer', 'yes')->pluck('id')->toArray();

        //        array_push($whereUser,null);

        $videos = ShortVideo::where(function ($q) use ($whereUser) {
            $q->whereIn('user_id', $whereUser)->orWhere('user_id', null);
        });


        $randomvideos = (array)ShortVideo::where(function ($q) use ($whereUser) {
            $q->whereIn('user_id', $whereUser)->orWhere('user_id', null);
        })->inRandomOrder()->paginate(12)->toArray();


        switch ($request->sort) {
            case 'Most':
                $videos = $videos->orderByDesc('views');
                break;

            case 'Recently':
                $videos = $videos->orderByDesc('id');
                break;

            case 'Older':
                $videos = $videos->orderBy('created_at');
                break;

            case 'Highest':
                $videos = $videos->orderByDesc('price');
                break;

            case 'Lowest':
                $videos = $videos->orderBy('price');
                break;

            case 'Only Free':
                $videos = $videos->where('price', 0)->orderByDesc('views');
                break;
            case 'Latest':
            default:
                $videos = $videos->orderByDesc('id');
                break;
        }


        // if keyword
        if ($request->filled('search')) {
            $randomvideos = [];
            $userrequest['search'] = $request->search;

            $videos->where('title', 'LIKE', '%' . $request->search . '%');
        }

        // case categories
        $userrequest['selectedCategories'] = [];
        if ($request->filled('selectedCategories')) {
            $randomvideos = [];
            $userrequest['selectedCategories'] = $request->selectedCategories;
            //            dd($request->selectedCategories);
            $videos->where(function ($query) use ($request) {
                foreach ($request->selectedCategories as $key => $categoryId) {
                    if ($key == 0) {
                        $query->where('category_id', 'LIKE', "%{$categoryId}%");
                    } else {
                        $query->orWhere('category_id', 'LIKE', "%{$categoryId}%");
                    }
                }
            });
        }

        // case tags
        $userrequest['selectedTags'] = [];
        if ($request->filled('selectedTags')) {
            $randomvideos = [];
            $userrequest['selectedTags'] = $request->selectedTags;
            $videos->whereRaw('FIND_IN_SET(?, tags)', [implode(',', $request->selectedTags)]);
            //            foreach ($request->selectedTags as $key => $tag) {
            //                if ($key == 0) {
            //                    $videos->where('tags', 'LIKE', "%{$tag}%");
            //                } else {
            //                    $videos->orWhere('tags', 'LIKE', "%{$tag}%");
            //                }
            //            }
        }
        $userrequest['selectedModels'] = [];
        if ($request->filled('selectedModels')) {
            $randomvideos = [];
            $userrequest['selectedModels'] = $request->selectedModels;
            foreach ($request->selectedModels as $key => $model) {
                if ($key == 0) {
                    $videos->where('model_id', 'LIKE', "%{$model}%");
                } else {
                    $videos->orWhere('model_id', 'LIKE', "%{$model}%");
                }
            }

            //            $videos->whereIn('model_id', $request->selectedModels);

        }

        // fetch videos
        $videos = $videos->paginate(6)->appends($request->query())->toArray();

        // the image
        $exploreImage = asset('images/browse-videos-icon.png');

        // all video categories
        $categories = VideoCategories::orderBy('category')->get();

        // assing to simple category
        $category = $categories;

        $tags = Tag::orderBy('name')->get();

        $models = Models::orderBy('name')->get();


        // render the view

        $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse Short Videos';


        return Inertia::render('Videos/BrowseShortVideos', compact('userrequest', 'videos', 'category', 'exploreImage', 'categories', 'tags', 'models', 'headTitle', 'randomvideos','watchVideos'));
    }

    // public function shortVideoPage(Request $request, $id)
    // {

    //     //$video = ShortVideo::where('slug', $id)->first();
    //     $shortVideo = ShortVideo::where('slug', $id)->first();

    //         $freeVideo = Video::where('slug', $id)
    //             ->where(function ($query) {
    //                 $query->where('price', 0)->orWhereNull('price');
    //             })->first();

    //         $video = collect([$shortVideo, $freeVideo])->filter()->first();

    //         // If no video found
    //         if (!$video) {
    //             return redirect()->route('short.videos.browse')->with('message', 'Video not found or not available.');
    //         }

    //         // Determine type based on model class
    //         //$type = $video instanceof ShortVideo ? 'short-video' : 'video';

    //         // Count how many times this specific video was watched today
    //         $checkTheTodayWatchTime = ContentWatchHistory::where(function ($q) use ($request) {
    //                 $q->where('IP', $request->ip());
    //             })
    //             ->where('date', Carbon::today()->format('Y-m-d'))
    //             // ->where('type', $type)
    //             ->where('video_id', $video->id)
    //             ->count();

    //         // Count distinct videos watched today of this type
    //         $checkTodayPreviewWatched = ContentWatchHistory::where(function ($q) use ($request) {
    //                 $q->where('IP', $request->ip());
    //             })
    //             ->where('date', Carbon::today()->format('Y-m-d'))
    //             // ->where('type', $type)
    //             ->distinct('video_id')
    //             ->count('video_id');

    //     //        $video->increment('views');

    //     $tags = is_object($video) && property_exists($video, 'tags') && is_array($video->tags) ? $video->tags : [];

    //     $videotags = [];
    //     foreach ($tags as $tag) {
    //         $item = Tag::where('id', $tag)->first();
    //         $videotags[] = $item->id;

    //     }
    //     $video->tags = $videotags;
    //     $relatedvideos = ShortVideo::where(function ($query) use ($videotags) {
    //         foreach ($videotags as $tag) {
    //             $query->orWhereRaw("FIND_IN_SET(?, tags)", [$tag]);
    //         }
    //     })->paginate(8)->appends($request->query());

    //     $url = $request->url();

    //     if ($request->has('page') && $request->page != 1 && $request->page != null) {
    //         return $relatedvideos;
    //     }

    //     $fullVideo = null;
    //     $slug = null;
    //     if ($video->video_id) {
    //         $fullVideo = DB::table('videos')->select('slug')->where('id', $video->video_id)->first();
    //         $slug = $fullVideo->slug;
    //     }

    //     //        add entry on the view history
    //     //        validate this for more than 5th time view

    //    $canBePlayed = true;
    //    $popupMessage = null;
    //    $minTokenReq = (int) opt('min_token_req');
    //    $perDayUserLimit = (int) opt('per_day_user_limit');
    //    $userToken = 0;
    //     if(auth()->check()){
    //         $userToken =     auth()->user()->tokens;
    //     }
    //     if (($checkTheTodayWatchTime >= $perDayUserLimit|| $checkTodayPreviewWatched >= $perDayUserLimit) &&  $userToken < $minTokenReq) {
    //         $canBePlayed = false;
    //         $popupMessage = __("You've reached your preview watch limit for today.");

    //     } else {
    //         // Save the view only if under limit
    //         ContentWatchHistory::create([
    //             'user_id' => auth()->user()->id ?? null,
    //             'IP' => $request->ip(),
    //             'type' => 'short-video',
    //             'video_id' => $video->id,
    //             'date' => Carbon::today()->format('Y-m-d'),
    //         ]);
    //     }
    //       $video->canBePlayed = $canBePlayed;
    //     return Inertia::render('Videos/SingleShortVideo', compact('video', 'relatedvideos', 'url', 'slug','popupMessage'));
    // }

    public function shortVideoPage(Request $request, $id)
    {

        // dd($request->all(), $id);
        if (!auth()->check()) {
            $viewed = session()->get('unauth_viewed_videos', []);

            if (!in_array($id, $viewed)) {
                $viewed[] = $id;
                session()->put('unauth_viewed_videos', $viewed);
            }
        }


        if (session()->has('unauth_viewed_videos')) {
            $slugs = session('unauth_viewed_videos');
            //prd($slugs);
        }


        $shortVideo = ShortVideo::where('slug', $id)->first();

        $freeVideo = Video::where('slug', $id)
            ->where(function ($query) {
                $query->where('price', 0)->orWhereNull('price');
            })->first();

        $video = collect([$shortVideo, $freeVideo])->filter()->first();

        if (!$video) {
            return redirect()->route('short.videos.browse')->with('message', 'Video not found or not available.');
        }

        // Tags processing
        $tags = is_object($video) && property_exists($video, 'tags') && is_array($video->tags) ? $video->tags : [];

        $videotags = [];
        foreach ($tags as $tag) {
            $item = Tag::find($tag);
            if ($item) {
                $videotags[] = $item->id;
            }
        }
        $video->tags = $videotags;

        $relatedvideos = ShortVideo::where(function ($query) use ($videotags) {
            foreach ($videotags as $tag) {
                $query->orWhereRaw("FIND_IN_SET(?, tags)", [$tag]);
            }
        })->inRandomOrder()->paginate(8)->appends($request->query());

        if ($request->has('page') && $request->page != 1 && $request->page != null) {
            return $relatedvideos;
        }

        $slug = null;
        if ($video->video_id) {
            $fullVideo = DB::table('videos')->select('slug')->where('id', $video->video_id)->first();
            $slug = $fullVideo->slug ?? null;
        }

        // View permission logic
        $canBePlayed = true;
        $popupMessage = null;
        $minTokenReq = (int) opt('min_token_req', 1); // default fallback
        $perDayUserLimit = (int) opt('per_day_user_limit', 3);
        $userToken = 0;
        $isLoggedIn = auth()->check();

        // Count video views
        $today = Carbon::today()->format('Y-m-d');
        $ip = $request->ip();

        if (auth()->check()) {
            if ($video->price == 0.00) {
                $user = auth()->user();
                $today = Carbon::today()->format('Y-m-d');
                $minTokenPackTokens = TokenPack::min('tokens');
                $userTotalTokens = $user->tokens ?? 0;
           
            //$hasPurchasedMinTokenOrMore = $userTotalTokens >= $minTokenPackTokens; // default fallback
                // $checkTodayPreviewWatched = ContentWatchHistory::where('date', Carbon::today()->format('Y-m-d'))
                //     ->where('IP', $request->ip())
                //     ->where('user_id', auth()->id())  
                //     ->where('type', 'gallery')
                //     ->where('is_pre_login', 1) 
                //     ->count();
                    $watchCount = ContentWatchHistory::where('date', $today)
                                    ->where('IP', $request->ip())
                                    ->where('user_id', $user->id)
                                    ->where('type', 'short-video')
                                    ->where('is_pre_login', 1)
                                    ->count();
                    
                 $userToken = $user->tokens ?? 1;
                if ($watchCount >= $perDayUserLimit && $userToken <= 1) {
                    $canBePlayed = false;
                    $popupMessage = __("You've reached your daily watch limit. Buy a token pack to continue watching.");
                }else {
                        // Add current gallery view to history
                        ContentWatchHistory::create([
                            'user_id' => $user->id,
                            'IP' => $request->ip(),
                            'video_id' => $shortVideo->id,
                            'type' => 'short-video',
                            'date' => $today,
                            'is_pre_login' => 1,
                        ]);
                    }

                }
        }
        $currentLocale = app()->getLocale();
        $seo = json_decode($video->seo);
        $imgUrl = '';
        if (!empty($seo->og_image_url)) {
            $imgUrl =  $seo->og_image_url;
        } else if (!empty($video->thumbnail)) {
            $imgUrl =  $video->thumbnail;
        }

        $videoUrl = '';
        if (!empty($seo->cust_url)) {
            $videoUrl =  $seo->cust_url;
        } else if (!empty($video->slug)) {
            $videoUrl =  url('single-video', $video->slug);
        }
        $seoDetail['title'] = $seo->h2 ?? '';
        $seoDetail['keyword'] = $seo->keyword ?? '';
        $seoDetail['meta_keyword'] = $seo->meta_keyword ?? '';
        $seoDetail['desc'] = $seo->desc ?? '';
        if ($currentLocale == 'de') {
            $seoDetail['title'] = $seo->de->h2 ?? '';
            $seoDetail['keyword'] = $seo->de->keyword ?? '';
            $seoDetail['meta_keyword'] = $seo->de->meta_keyword ?? '';
            $seoDetail['desc'] = $seo->de->desc ?? '';
        }
        $seoDetail['meta_robot'] = $seo->meta_robot ?? '';
        $seoDetail['og_title'] = $seo->og_title ?? '';
        $seoDetail['og_desc'] = $seo->og_desc ?? '';
        $seoDetail['cust_url'] = $videoUrl;
        $seoDetail['og_image_url'] = $imgUrl;
        $seoDetail['json_id'] = $seo->json_id ?? '';
        // prd($seoDetail);
        // dd($video);

        return Inertia::render('Videos/SingleShortVideo', [
            'video' => $video,
            'relatedvideos' => $relatedvideos,
            'url' => $request->url(),
            'slug' => $slug,
            'popupMessage' => $popupMessage ?? '',
             'canBePlayed' => $canBePlayed,
            'userLoginID' => auth()->id() ?? null,
            'auth' => [
                'user' => auth()->user(),
            ],
             'seo' => $seoDetail,
        ]);
    }

    public function increaseViews(ShortVideo $shortVideo, Request $request) // Parameter ka naam 'shortVideo' (camelCase)
    {
        $sessionName = ip2long($request->ip()) . '_' . $shortVideo->id . '_short_video_viewed';
        $shortVideo->increment('views');
        $request->session()->put($sessionName, date('Y-m-d H:i:s'));
        Log::info("Views INCREASED for Short Video ID: {$shortVideo->id} by IP: {$request->ip()}");
        return response()->json(['result' => 'INCREASED', 'session' => $sessionName]);
    }

    public function unlockVideo(ShortVideo $video, Request $request)
    {

        if ($video->canBePlayed) {
            return back()->with('message', __('You already have access to this video'));
        }

        return Inertia::render('Videos/PreviewUnlock', compact('video'));
    }

    public function purchaseVideo(ShortVideo $video, Request $request)
    {


        // check if user already bought
        if ($video->canBePlayed) {
            return back()->with('message', __('You already have access to this video'));
        }

        // record order
        $videoSale = new PreviewSales();
        $videoSale->video_id = $video->id;
        $videoSale->user_id = $request->user()->id;
        $videoSale->price = $video->price;
        $videoSale->save();

        if ($videoSale) {
            $addpurchasehistory = new PurchaseHistory();
            $addpurchasehistory->type = 'preview';
            $addpurchasehistory->video_id = $video->id;
            $addpurchasehistory->user_id = auth()->user()->id;
            $addpurchasehistory->ip = $request->ip();
            $addpurchasehistory->save();
        }

        // subtract from user balance
        $request->user()->decrement('tokens', $video->price);

        // NO NEED FOR PREVIEW
        // notify streamer of this sale (on platform)
        //        $video->streamer->notify(new NewVideoSale($videoSale));

        //        Notify User that video successfully purchased
        //        $request->user()->notify(new VideoPurchasedMail($videoSale));

        //        Mail::to($request->user()->email)->send(new VideoPurchasedMail($videoSale));

        // redirect to my videos
        return redirect(route('short.video.single.page', ['id' => $video->slug]))->with('message', __("Thank you, you can now play the preview!"));
    }

    public function myVideos(Request $request)
    {
        $videos = $request->user()
            ->purchasedPreviews();

        if ($request->has('search_term')) {
            $videos->where('title', 'LIKE', '%' . $request->search_term . '%');
        }

        $videos = $videos->paginate(4);

        return Inertia::render('Videos/OrderedPreviews', compact('videos'));
    }
}
