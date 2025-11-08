<?php

namespace App\Http\Controllers;

use App\Models\PromoPreviewVideo;
use Illuminate\Support\Facades\Mail;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;
use App\Jobs\SendNewsletterJob;

class PromoPreviewVideosController extends Controller
{
    public function index()
    {
        $promo_videos = PromoPreviewVideo::orderBy('id', 'desc')->paginate(10);
        return view('admin.promoPreviewVideo.promovideolist', compact('promo_videos'));
    }

    public function createPreviewVideos()
    {
        $category = VideoCategories::orderBy('category')->get();
        return view('admin.promoPreviewVideo.add-promoPreviewVideos', compact('category'));
    }

    public function editPreviewVideos($id)
    {
        $promo_videos = PromoPreviewVideo::findOrFail($id);
        $category = VideoCategories::orderBy('category')->get();
        return view('admin.promoPreviewVideo.edit-promoPreviewVideos', compact('promo_videos', 'category'));
    }

    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $i = 1;

        while (PromoPreviewVideo::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $i;
            $i++;
        }
        return $slug;
    }

    public function storePreviewVideos(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|array',
            'category_id.*' => 'nullable|integer|exists:video_categories,id',
            'status' => 'required|in:0,1',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'preview_videos' => 'nullable|file|max:10240|mimetypes:video/mp4,WebM,video/avi,video/mpeg,video/quicktime,video/x-ms-wmv,application/octet-stream',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first())->withInput();
        }

        try {
            $promo_videos = new PromoPreviewVideo();
            $promo_videos->name = $request->name;
            $promo_videos->description = $request->description;
             $promo_videos->slug = $this->generateUniqueSlug($request->name);
            $promo_videos->status = (int)$request->status;
            $promo_videos->category_ids = $request->filled('category_id') ? implode(',', $request->category_id) : null;

            // Thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $thumb = $request->file('thumbnail');
                $thumbName = Str::random(10) . '_thumb.' . $thumb->getClientOriginalExtension();
                $thumb->move(public_path('promo-videos/thumbnail/'), $thumbName);
                $promo_videos->thumbnail = 'promo-videos/thumbnail/' . $thumbName;
            }

            // Preview video upload
            if ($request->hasFile('preview_videos')) {
                $video = $request->file('preview_videos');

                if ($video->getSize() > 10 * 1024 * 1024) {
                    return back()->with('msg', 'Video must be less than 10MB.')->withInput();
                }

                $videoName = Str::random(10) . '_video.' . $video->getClientOriginalExtension();
                $video->move(public_path('promo-videos/videos/'), $videoName);
                $promo_videos->preview_videos = 'promo-videos/videos/' . $videoName;
            }

            $promo_videos->save();
            return redirect()->route('promoPreviewVideos.index')->with('msg', 'Promo videos added successfully!');
        } catch (\Exception $e) {
            return back()->with('msg', 'Error: ' . $e->getMessage())->withInput();
        }
    }

    public function updatePreviewVideos(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|array',
            'category_id.*' => 'nullable|integer|exists:video_categories,id',
            'status' => 'required|in:0,1',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
             'preview_videos' => 'nullable|mimes:mp4,WebM,avi,mpeg,mov,wmv|max:10240',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first())->withInput();
        }

        try {
            $promo_videos = PromoPreviewVideo::findOrFail($id);

            $promo_videos->name = $request->name;
            $promo_videos->description = $request->description;
            $promo_videos->status = (int) $request->status;
            $promo_videos->category_ids  = $request->has('category_id') ? implode(',', $request->category_id) : null;

            if ($request->hasFile('thumbnail')) {
                $thumbnail = $request->file('thumbnail');
                $thumbnailName = Str::random(10) . '_thumb.' . $thumbnail->getClientOriginalExtension();
                $thumbnailPath = 'promo-videos/thumbnail/';
                $thumbnail->move(public_path($thumbnailPath), $thumbnailName);
                $promo_videos->thumbnail = $thumbnailPath . $thumbnailName;
            }

            if ($request->hasFile('preview_videos')) {
                $video = $request->file('preview_videos');
                $videoName = Str::random(10) . '_video.' . $video->getClientOriginalExtension();
                $videoPath = 'promo-videos/videos/';
                $video->move(public_path($videoPath), $videoName);
                $promo_videos->preview_videos = $videoPath . $videoName;
            }

            $promo_videos->save();

            return redirect()->route('promoPreviewVideos.index')->with('msg', __('Promo Videos Updated Successfully!'));
        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage())->withInput();
        }
    }

    public function deletePreviewVideos($id)
    {
        $promo_videos = PromoPreviewVideo::findOrFail($id);
        $promo_videos->delete();
        return redirect()->route('promoPreviewVideos.index')->with('msg', __('Promo Videos Deleted Successfully!'));
    }

    public function toggleStatus($id)
    {
        $promo = PromoPreviewVideo::findOrFail($id);
        $promo->status = $promo->status == 1 ? 0 : 1;
        $promo->save();
        return redirect()->back()->with('msg', 'Status updated successfully!');
    }
}