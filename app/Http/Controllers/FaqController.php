<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        
        $faq = new Faq();

        if ($request->filled('search')) {
            $userrequest['search'] = $request->search;
            $faq = $faq->where('question', 'LIKE', '%' . $request->search . '%');
        }

        // Get current page from request, default to 1
        $currentPage = $request->input('page', 1);
        $perPage = 10; // You can adjust this number

        // Paginate the results
        $faq = $faq->inRandomOrder()->paginate($perPage, ['*'], 'page', $currentPage);

        return Inertia::render('Faqs', compact('faq'));
    }

    // public function indexInfo($slug)
    // {
    //     $exploreImage = asset('images/explore.png');
    //     $blog = Blog::where('slug', $slug)->first();
    //     if ($blog) {
    //         $categoryIds = explode(',', $blog->category_id);
    //         $tagIds = explode(',', $blog->tag_id);
    //         $tagNames = Tag::whereIn('id', $tagIds)->pluck('name')->toArray();
    //         $videos = Video::query();
    //         if (!empty($categoryIds)) {
    //             $videos->orWhereIn('category_id', $categoryIds);
    //         }
    //         if (!empty($tagNames)) {
    //             $videos->orWhere(function ($query) use ($tagNames) {
    //                 foreach ($tagNames as $tagName) {
    //                     $query->orWhereRaw("FIND_IN_SET(?, tags)", [$tagName]);
    //                 }
    //             });
    //         }
    //         $videos = $videos->inRandomOrder()->take(8)->get();

    //         //dd($videos);
    //     }

    //     $currentLocale = app()->getLocale();
    //     $seo = json_decode($blog->seo);
        
    //     $imgUrl = '';
    //     if (!empty($seo->og_image_url)) {
    //         $imgUrl =  $seo->og_image_url;
    //     } else if (!empty($blog->thumbnail)) {
    //         $imgUrl =  $blog->thumbnail;
    //     }

    //     $videoUrl = '';
    //     if (!empty($seo->cust_url)) {
    //         $videoUrl =  $seo->cust_url;
    //     } else if (!empty($video->slug)) {
    //         $videoUrl =  url('blog', $blog->slug);
    //     }
    //     $seoDetail['title'] = $seo->h2 ?? '';
    //     $seoDetail['keyword'] = $seo->keyword ?? '';
    //     $seoDetail['meta_keyword'] = $seo->meta_keyword ?? '';
    //     $seoDetail['desc'] = $seo->desc ?? '';
    //     if ($currentLocale == 'de') {
    //         $seoDetail['title'] = $seo->de->h2 ?? '';
    //         $seoDetail['keyword'] = $seo->de->keyword ?? '';
    //         $seoDetail['meta_keyword'] = $seo->de->meta_keyword ?? '';
    //         $seoDetail['desc'] = $seo->de->desc ?? '';
    //     }
    //     $seoDetail['meta_robot'] = $seo->meta_robot ?? '';
    //     $seoDetail['og_title'] = $seo->og_title ?? '';
    //     $seoDetail['og_desc'] = $seo->og_desc ?? '';
    //     $seoDetail['cust_url'] = $videoUrl;
    //     $seoDetail['og_image_url'] = $imgUrl;
    //     $seoDetail['json_id'] = $seo->json_id ?? '';
    //     $seo = $seoDetail;
       
    //     return Inertia::render('StorySingle', compact('blog', 'exploreImage', 'videos','seo'));
    // }


    public function adminIndex()
    {
        $faqs = Faq::orderBy('id', 'asc')->get();
        return view('admin.faqs', compact('faqs'));
    }


    public function updateOrder(Request $request)
    {
        $faq = Faq::findOrFail($request->id);
        $faq->order_by = (int) $request->order_by;
        $faq->save();

        return response()->json(['success' => true, 'message' => 'Order updated']);
    }



    public function createFaq()
    {
        return view('admin.add-faq');
    }

    public function editFaq($id)
    {
        $faq = Faq::find($id);
        return view('admin.edit-faq', compact('faq'));
    }

    public function addFaq(Request $request)
    {
        //prd($request->all());
        $validator = Validator::make($request->all(), [
            'question' => 'required',
            'question_de' => 'required',
            'answer' => 'required',
            'answer_de' => 'required',
            //'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $faq = new Faq();
            $faq->question = $request->question;
             $faq->question_de = $request->question_de;
            $faq->answer = $request->answer;
             $faq->answer_de = $request->answer_de;
             $faq->status = 1;
            //$faq->slug = Str::slug($request->question['en']);
            //$faq->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $faq->save();
            return redirect()->route('faq.index')->with('msg', __('Faqs Added Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function updateFaq(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'question' => 'required',
            'question_de' => 'required',
            'answer' => 'required',
            'answer_de' => 'required',
            //'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $faq = Faq::where('id', $id)->first();
            $faq->question = $request->question;
            $faq->question_de = $request->question_de;
            $faq->answer =   $request->answer;
            $faq->answer_de = $request->answer_de;
            $faq->status = 1;
            //$faq->slug = Str::slug($request->question['en']);
            //$faq->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $faq->save();

            return redirect()->route('faq.index')->with('msg', __('Faqs Updated Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function deleteFaq($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();
        return redirect()->route('faq.index')->with('msg', __('Faqs Deleted Successfully!'));
    }
}
