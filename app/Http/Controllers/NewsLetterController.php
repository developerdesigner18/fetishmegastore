<?php

namespace App\Http\Controllers;

use App\Models\NewsLetter;
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

class NewsLetterController extends Controller
{
    // public function index(Request $request)
    // {
        
    //     $newsletter = new NewsLetter();

    //     if ($request->filled('search')) {
    //         $userrequest['search'] = $request->search;
    //         $newsletter = $newsletter->where('title', 'LIKE', '%' . $request->search . '%');
    //     }

    //     // Get current page from request, default to 1
    //     $currentPage = $request->input('page', 1);
    //     $perPage = 10; // You can adjust this number

    //     // Paginate the results
    //     $newsletter = $newsletter->inRandomOrder()->paginate($perPage, ['*'], 'page', $currentPage);

    //     return Inertia::render('Faqs', compact('newsletter'));
    // }

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
        $newsletter = NewsLetter::orderBy('id', 'asc')->get();
        return view('admin.newsletter.newsletter', compact('newsletter'));
    }


    // public function updateOrder(Request $request)
    // {
    //     $faq = Faq::findOrFail($request->id);
    //     $faq->order_by = (int) $request->order_by;
    //     $faq->save();

    //     return response()->json(['success' => true, 'message' => 'Order updated']);
    // }



    public function createNewsletter()
    {
        return view('admin.newsletter.add-newsletter');
    }

    public function editNewsletter($id)
    {
        $newsletter = NewsLetter::find($id);
        return view('admin.newsletter.edit-newsletter', compact('newsletter'));
    }

    public function addNewsletter(Request $request)
    {
        //prd($request->all());
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'required',
            //'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $newsletter = new NewsLetter();
            $newsletter->title = $request->title;
            $newsletter->description = $request->description;
            //$newsletter->status = 1;
            $newsletter->save();
            return redirect()->route('newsletter.index')->with('msg', __('NewsLetter Added Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function updateNewsletter(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'required',
            //'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $newsletter = NewsLetter::where('id', $id)->first();
            $newsletter->title = $request->title;
            $newsletter->description = $request->description;
            //$newsletter->status = 1;
            $newsletter->save();

            return redirect()->route('newsletter.index')->with('msg', __('NewsLetter Updated Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function deleteNewsletter($id)
    {
        $newsletter = NewsLetter::findOrFail($id);
        $newsletter->delete();
        return redirect()->route('newsletter.index')->with('msg', __('NewsLetter Deleted Successfully!'));
    }


    public function adminEmailTemplating(Request $request)
    {
        $newsletters = NewsLetter::get();
        return view('admin.emailTemplating', compact('newsletters'));
    }

    public function getFilteredUsers(Request $request)
    {
        $filter = $request->input('filter');

        $users = match ($filter) {
            'all' => User::select('id', 'name', 'email')->where('is_admin', 'no')->where('is_subscribe',1)->latest()->get(),

            'streamers' => User::select('id', 'name', 'email')->where('is_admin', 'no')->where('is_subscribe',1)->where('is_streamer', 'yes')->get(),


            'affiliate' => User::select('id', 'name', 'email')
            ->whereNotNull('affiliate_code')
            ->whereNotNull('affiliate_user')
            ->get(),

           'no_tokens' => User::select('id', 'name', 'email')
            ->where('is_streamer', 'no')
            ->where('is_admin', 'no')
            ->where('is_subscribe', 1)
            ->where(function ($query) {
                $query->where('tokens', 0)
                    ->orWhereNull('tokens');
            })
            ->get(),

            default => collect(),
        };

        return response()->json($users);
    }


   /* public function sendNewsletter(Request $request)
    {
        $request->validate([
            'newsletter_id' => 'required|exists:newsletters,id',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $newsletter = NewsLetter::findOrFail($request->newsletter_id);
        $users = User::whereIn('id', $request->user_ids)->get();

        foreach ($users as $user) {
            \Mail::to($user->email)->send(new \App\Mail\NewsletterMail($newsletter,$user));
        }

        return back()->with('msg', __('Email(s) sent successfully.'));
    }*/

        public function sendNewsletter(Request $request)
        {
            $request->validate([
                'newsletter_id' => 'required|exists:newsletters,id',
                'user_ids' => 'required|array',
                'user_ids.*' => 'exists:users,id',
            ]);

            $newsletter = NewsLetter::findOrFail($request->newsletter_id);

            // Chunk users in batches of 50
            collect($request->user_ids)->chunk(50)->each(function ($chunk) use ($newsletter) {
                SendNewsletterJob::dispatch($newsletter, $chunk->toArray());
            });

            return response()->json(['message' => 'Emails are being sent in background.']);
        }



     public function unsubscribeStatus(){
        
         $users = User::where('is_subscribe', 0)->paginate(15);

         $active = 'Unsubscribe Users';

        return view('admin.newsletter.unsubscribe-list', compact('users', 'active'));
    }


    public function updateUserSubscriptionStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'status' => 'required|in:0,1',
        ]);

        $user = User::findOrFail($request->id);
        $user->is_subscribe = $request->status;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => $request->status == 1 ? 'User subscribed successfully.' : 'User unsubscribed.',
        ]);
    }

    


}
