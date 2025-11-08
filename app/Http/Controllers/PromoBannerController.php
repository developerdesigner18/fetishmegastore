<?php

namespace App\Http\Controllers;

use App\Models\PromoBanner;
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

class PromoBannerController extends Controller
{
    

    public function index()
    {   
        
         $promo_banners = PromoBanner::orderBy('id', 'desc')->paginate(10);
        return view('admin.promobanner.promoBanner', compact('promo_banners'));
    }

    public function createPromoBanner()
    {   
        $category = VideoCategories::orderBy('category')->get();
        return view('admin.promobanner.add-promoBanner', compact('category'));
    }

    public function editPromoBanner($id)
    {
        $promo_banners = PromoBanner::findOrFail($id);
        $category = VideoCategories::orderBy('category')->get();
        return view('admin.promobanner.edit-promoBanner', compact('promo_banners', 'category'));
    }


    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $i = 1;

        while (PromoBanner::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $i;
            $i++;
        }

        return $slug;
    }

    public function storePromoBanner(Request $request)
    {
        // Validation with custom messages
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'description'  => 'required|string',
            'category_id'  => 'nullable|array',
            'category_id.*'=> 'nullable|integer|exists:video_categories,id',
            'status'       => 'required|in:0,1',
            'thumbnail'    => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // 2 MB
            //'banner_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096', // 4 MB
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $promo_banners = new PromoBanner();
            $promo_banners->name = $request->name;
            $promo_banners->slug = $this->generateUniqueSlug($request->name);
            $promo_banners->description = $request->description;
            $promo_banners->status = (int) $request->status;
            $promo_banners->category_ids = $request->has('category_id')
                ? implode(',', $request->category_id)
                : null;

            // Handle thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $thumbnail = $request->file('thumbnail');
                $thumbnailName = Str::random(10) . '_thumb.' . $thumbnail->getClientOriginalExtension();
                $thumbnailPath = 'promo-banners/thumbnail/';

                // Create directory if missing
                if (!file_exists(public_path($thumbnailPath))) {
                    mkdir(public_path($thumbnailPath), 0777, true);
                }

                $thumbnail->move(public_path($thumbnailPath), $thumbnailName);
                $promo_banners->thumbnail = $thumbnailPath . $thumbnailName;
            }

            // Handle banner upload
            if ($request->hasFile('banner_image')) {
                $banner = $request->file('banner_image');
                $bannerName = Str::random(10) . '_banner.' . $banner->getClientOriginalExtension();
                $bannerPath = 'promo-banners/banners/';

                // Create directory if missing
                if (!file_exists(public_path($bannerPath))) {
                    mkdir(public_path($bannerPath), 0777, true);
                }

                $banner->move(public_path($bannerPath), $bannerName);
                $promo_banners->banner_image = $bannerPath . $bannerName;
            }

            $promo_banners->save();

            return redirect()->route('promoTools.index')
                ->with('msg', __('Promo banner added successfully!'));

        } catch (\Exception $exception) {
            return redirect()->back()
                ->with('msg', __('Error: ') . $exception->getMessage())
                ->withInput();
        }
    }

    public function updatePromoBanner(Request $request, $id)
    {  
       
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'array',
            'category_id.*' => 'integer|exists:video_categories,id',
            'status' => 'required|in:0,1',
            'thumbnail' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            //'banner_image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:4096',
        ]);

         if ($validator->fails()) {
        return redirect()->back()
            ->withErrors($validator)
            ->withInput();
        }

        try {
            $promo_banners = PromoBanner::findOrFail($id);

            $promo_banners->name = $request->name;
            $promo_banners->description = $request->description;
            $promo_banners->status = (int) $request->status;
            $promo_banners->category_ids  = $request->has('category_id')
                ? implode(',', $request->category_id)
                : null;

            if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $thumbnailName = Str::random(10) . '_thumb.' . $thumbnail->getClientOriginalExtension();
            $thumbnailPath = 'promo-banners/thumbnail/';

            // Ensure directory exists
            if (!file_exists(public_path($thumbnailPath))) {
                mkdir(public_path($thumbnailPath), 0777, true);
            }

            $thumbnail->move(public_path($thumbnailPath), $thumbnailName);
            $promo_banners->thumbnail = $thumbnailPath . $thumbnailName;
        }

        // Handle banner upload
        if ($request->hasFile('banner_image')) {
            $banner = $request->file('banner_image');
            $bannerName = Str::random(10) . '_banner.' . $banner->getClientOriginalExtension();
            $bannerPath = 'promo-banners/banners/';

            // Ensure directory exists
            if (!file_exists(public_path($bannerPath))) {
                mkdir(public_path($bannerPath), 0777, true);
            }

            $banner->move(public_path($bannerPath), $bannerName);
            $promo_banners->banner_image = $bannerPath . $bannerName;
        }

            $promo_banners->save();

            return redirect()->route('promoTools.index')
                ->with('msg', __('Promo Banner Updated Successfully!'));

            } catch (\Exception $exception) {
            return redirect()->back()
                ->with('msg', __('Error: ') . $exception->getMessage())
                ->withInput();
        }
    }


    public function deletePromoBanner($id, Request $request)
    {
        $promo_banners = PromoBanner::findOrFail($id);
        $promo_banners->delete();
        $page = $request->query('page', 1);
        return redirect()->route('promoTools.index', ['page' => $page])
                        ->with('msg', __('Promo Banner Deleted Successfully!'));
    }


    public function toggleStatus($id)
    {
        $promo = PromoBanner::findOrFail($id);
        $promo->status = $promo->status == 1 ? 0 : 1;
        $promo->save();

        return redirect()->back()->with('msg', 'Status updated successfully!');
    }



}
