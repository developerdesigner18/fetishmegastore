<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\Video;
use App\Models\Tag;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\ContentWatchHistory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use DB;
use Intervention\Image\Facades\Image;

class StoryController extends Controller
{
    public function index(Request $request)
    {

        $exploreImage = asset('images/explore.png');
        $blog = new Story();

        if ($request->filled('search')) {
            $userrequest['search'] = $request->search;
            $blog = $blog->where('title', 'LIKE', '%' . $request->search . '%');
        }

        // case categories
        $userrequest['selectedCategories'] = [];
        if ($request->filled('selectedCategories')) {
            $randomvideos = [];
            $userrequest['selectedCategories'] = $request->selectedCategories;
//            dd($request->selectedCategories);
            $blog = $blog->whereRaw('FIND_IN_SET(?, category_id)', [$request->selectedCategories]);
        }

        // case tags
        $userrequest['selectedTags'] = [];
        if ($request->filled('selectedTags')) {
            $randomvideos = [];
            $userrequest['selectedTags'] = $request->selectedTags;
            $blog = $blog->whereRaw('FIND_IN_SET(?, tag_id)', [$request->selectedTags]);
        }

        $categories = VideoCategories::orderBy('category')->get();

        $tags = Tag::orderBy('name')->get();

        $blog = $blog->inRandomOrder()->get();

        return Inertia::render('Stories', compact('blog','exploreImage','userrequest','tags','categories'));
    }

    public function indexInfo($slug,Request $request)
{

    $exploreImage = asset('images/explore.png');
    $blog = Story::where('slug', $slug)->first();
    if ($blog) {
        $categoryIds = explode(',', $blog->category_id);
        $tagIds = explode(',', $blog->tag_id);
        $tagNames = Tag::whereIn('id', $tagIds)->pluck('name')->toArray();
        $videos = Video::query();
        if (!empty($categoryIds)) {
            $videos->orWhereIn('category_id', $categoryIds);
        }
        if (!empty($tagNames)) {
            $videos->orWhere(function ($query) use ($tagNames) {
                foreach ($tagNames as $tagName) {
                    $query->orWhereRaw("FIND_IN_SET(?, tags)", [$tagName]);
                }
            });
        }
        $videos = $videos->inRandomOrder()->take(8)->get();
  
        //dd($videos);
    }

        $canBePlayed = true;
        $popupMessage = null;

        if (auth()->check()) {
                $user = auth()->user();
                $today = Carbon::today()->format('Y-m-d');
                $minTokenReq = (int) opt('min_token_req', 1); // default fallback
                // $checkTodayPreviewWatched = ContentWatchHistory::where('date', Carbon::today()->format('Y-m-d'))
                //     ->where('IP', $request->ip())
                //     ->where('user_id', auth()->id())  
                //     ->where('type', 'gallery')
                //     ->where('is_pre_login', 1) 
                //     ->count();
                    $watchCount = ContentWatchHistory::where('date', $today)
                                    ->where('IP', $request->ip())
                                    ->where('user_id', $user->id)
                                    ->where('type', 'story')
                                    ->where('is_pre_login', 1)
                                    ->count();
                    
                $userToken = $user->tokens ?? 1;
                if ($watchCount >= 3) {
                    $canBePlayed = false;
                    $popupMessage = __("You've reached your daily watch limit. Buy a token pack to continue watching.");
                }else {
                        // Add current gallery view to history
                        ContentWatchHistory::create([
                            'user_id' => $user->id,
                            'IP' => $request->ip(),
                            'video_id' => $blog->id,
                            'type' => 'story',
                            'date' => $today,
                            'is_pre_login' => 1,
                        ]);
                    }
        }
    $currentLocale = app()->getLocale();
        $seo = json_decode($blog->seo);
        
        $imgUrl = '';
        if (!empty($seo->og_image_url)) {
            $imgUrl =  $seo->og_image_url;
        } else if (!empty($blog->thumbnail)) {
            $imgUrl =  $blog->thumbnail;
        }

        $videoUrl = '';
        if (!empty($seo->cust_url)) {
            $videoUrl =  $seo->cust_url;
        } else if (!empty($video->slug)) {
            $videoUrl =  url('blog', $blog->slug);
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
        $seo = $seoDetail;

            return Inertia::render('StorySingle', [
            'blog' => $blog,
            'exploreImage' => $exploreImage,
            'videos' => $videos,
            'seo' => $seo,
            'popupMessage' => $popupMessage ?? '',
            'userLoginID' => auth()->id() ?? null,
            'url' => url()->current(),
            'slug' => $slug,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);

}

    
    public function adminIndex()
    {
        $blogs = Story::orderBy('id', 'desc')->get();
        return view('admin.stories', compact('blogs'));
    }

    public function createStory()
    {

        $categories = VideoCategories::orderBy('id','desc')->get();

        $tags = Tag::orderBy('id','desc')->get();


        return view('admin.add-story',compact('categories','tags'));
    }
    public function editStory($id)
    {
        $blog = Story::find($id);
        $categories = VideoCategories::orderBy('id','desc')->get();

        $tags = Tag::orderBy('id','desc')->get();

        return view('admin.edit-story',compact('blog','categories','tags'));
    }

    public function addStory(Request $request)
    {

        $validator = Validator::make($request->all(),[
            'title' => 'required',
            'description' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]) ;

        if($validator->fails()){
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $blog = new Story();
            $blog->title = json_encode($request->title);
            $blog->description = json_encode($request->description);
            $blog->slug = Str::slug($request->title['en']);
            $blog->category_id = !empty($request->category_id) ? implode(',',$request->category_id) : null;
            $blog->tag_id = !empty($request->tags) ? implode(',',$request->tags) : null;

            if($request->hasFile('image')){
                $thumbnail = Image::make($request->file('image'))->stream();
                $thumbFile = 'stories/' . uniqid() . '.' . $request->file('image')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $blog->image = $thumbFile;
            }
            $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $blog->save();

            return redirect()->route('story.index')->with('msg', __('Story Added Successfully!'));

        }catch (\Exception $exception){
            return back()->with('msg', $exception->getMessage());
        }

    }
    public function updateStory(Request $request,$id)
    {

        $validator = Validator::make($request->all(),[
            'title' => 'required',
            'description' => 'required',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg',
        ]) ;

        if($validator->fails()){
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $blog = Story::where('id',$id)->first();
            $blog->title = json_encode($request->title);
            $blog->description = json_encode($request->description);
            $blog->slug = Str::slug($request->title['en']);
            $blog->category_id = !empty($request->category_id) ? implode(',',$request->category_id) : null;
            $blog->tag_id = !empty($request->tags) ? implode(',',$request->tags) : null;

            if($request->hasFile('image')){
                $thumbnail = Image::make($request->file('image'))->stream();
                $thumbFile = 'blogs/' . uniqid() . '.' . $request->file('image')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $blog->image = $thumbFile;
            }
            $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $blog->save();

            return redirect()->route('story.index')->with('msg', __('Story Updated Successfully!'));

        }catch (\Exception $exception){
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function deleteStory($id){
        $blog = Story::find($id)->delete();
        return redirect()->route('story.index')->with('msg', __('Story Deleted Successfully!'));
    }
}
