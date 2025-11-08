<?php

namespace App\Http\Controllers;

use App\Events\ConversationEvent;
use App\Models\PromoBanner;
use App\Models\PromoPreviewVideo;
use App\Models\Gallery;
use App\Models\Payouts;
use App\Models\AffiliateAccounts;
use App\Models\Page;
use Carbon\Carbon;
use App\Models\Video;
use App\Models\AffiliateTracks;
use App\Models\AffiliateCommission;
use App\Models\AffiliateTransactions;
use App\Models\ShortVideo;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File as FileFacade;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;


class AffiliateController extends Controller
{
    //     public function __construct()
    //     {
    //         $this->middleware('auth')
    //             ->except(['browseAudio', 'browse', 'videoPage','increaseViews']);
    //     }


   public function affiliateCommission(Request $request)
    {
        $user = Auth::user();
        $affiliateData = $this->getAffiliateData($user);
        $currency = (string) opt('currency');
        return Inertia::render('Videos/Affiliate/AffiliateDashboard', array_merge(
            $affiliateData,
            [
                'activeTab' => 'commission',
                'affiliateCode' => $user->affiliate_code,
                'currency' => $currency,
            ]
        ));
    }

    public function affiliateTracking(Request $request)
    {
        $user = Auth::user();
        $affiliateTrackHistory = AffiliateTracks::with('user')
            ->where('affiliate_code', $user->affiliate_code)
            ->where('affiliate_user_id', $user->id)
            ->latest()
            ->paginate(5);

        return Inertia::render('Videos/Affiliate/AffiliateDashboard', [
            'activeTab' => 'affiliateTracking',
            'affiliate_tracks' => $affiliateTrackHistory,
            'affiliateCode' => $user->affiliate_code,
        ]);
    }

    public function affiliatePromoBanner(Request $request)
    {
        $user = Auth::user();
        $promoBanners = $this->promoBannerIndex($request);

        return Inertia::render('Videos/Affiliate/AffiliateDashboard', [
            'activeTab' => 'promoBanner',
            'promo_banners' => $promoBanners,
            'affiliateCode' => $user->affiliate_code,
        ]);
    }

   public function affiliatePromoVideos(Request $request)
    {
        $user = Auth::user();
        $promoVideos = $this->promoVideo($request);

        return Inertia::render('Videos/Affiliate/AffiliateDashboard', [
            'activeTab' => 'promoVideos',
            'promo_videos' => $promoVideos,
            'affiliateCode' => $user->affiliate_code,
        ]);
    }

    public function affiliatePromoGallery(Request $request)
    {
        $user = Auth::user();
        $promoGallery = $this->galleryPromo($request);

        return Inertia::render('Videos/Affiliate/AffiliateDashboard', [
            'activeTab' => 'promoGallery',
            'promo_gallery' => $promoGallery,
            'affiliateCode' => $user->affiliate_code,
        ]);
    }


    public function affiliateGuide(Request $request)
    {
        $user = Auth::user();
        $affiliateGuide = $this->promoAffiliateGuide();

        return Inertia::render('Videos/Affiliate/AffiliateDashboard', [
            'activeTab' => 'affiliateGuide',
            'affiliate_guide' => $affiliateGuide,
        ]);
    }


     public function affiliateAccount(Request $request)
    {
        return Inertia::render('Videos/Affiliate/AffiliateDashboard', [
            'activeTab' => 'affiliateAccount',
            'affiliate_account' => $this->affiliateAccountTab(),
        ]);
    }


    public function withdrawal(Request $request)
    {
        $user = Auth::user();
        $lastTransaction = AffiliateTransactions::where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->first();
        $hasPendingRequest = Payouts::where('user_id', $user->id)
                                ->where('status', 'pending')
                                ->exists();
        $totalCommission = $lastTransaction ? (float)$lastTransaction->balance : 0;
        $minimumWithdrawalLimit = (float) opt('minimum_withdrawal_limit');
        $currency = (string) opt('currency');

        $withdrawalHistory = Payouts::where('user_id', $user->id)
        ->orderBy('id', 'desc')
        ->paginate(10)
        ->withQueryString();


        return Inertia::render('Videos/Affiliate/AffiliateDashboard', [
            'activeTab' => 'withdrawalCommission',
            'withdrawal_commission' => [
                'total_commission' => $totalCommission,
                'minimum_withdrawal_limit' => $minimumWithdrawalLimit,
                'has_pending_request' => $hasPendingRequest,
            ],
            'currency' => $currency,
            'withdrawal_history' => $withdrawalHistory, 
        ]);
    }

       


    public function affiliate(Request $request)
    {

        $user = Auth::user();
        $data = $this->getAffiliateData($user);

        return Inertia::render('Videos/Affiliate/Affiliate', $data);
    }


    public function requestAffiliateVendor(Request $request)
    {  

         if (!Auth::check()) {
            return redirect()->route('login')->send();
        }
        
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'You must be logged in.');
        }

        if ($user->is_affiliate_vendor == 1) {
            return back()->with('error', 'You have already submitted a request.');
        }

        $user->is_affiliate_vendor = 1;
        $user->save();

        return back()->with('success', 'Your request has been submitted successfully.');
    }


    private function getAffiliateData($user)
    {  

        if (!Auth::check()) {
            return redirect()->route('login')->send();
        }

        $commissions = AffiliateCommission::with('buyer')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate(5);

        $mappedCommissions = $commissions->getCollection()->map(function ($item, $index) use ($commissions) {
            return [
                'index' => ($commissions->currentPage() - 1) * $commissions->perPage() + $index + 1,
                'amount' => $item->token,
                'date' => $item->created_at->format('d M Y, h:i A'),
                'username' => $item->buyer ? str_replace('_', ' ', $item->buyer->name) : 'N/A',
                
            ];
        });

        return [
            'commissions' => $mappedCommissions,
            'pagination' => [
                'current_page' => $commissions->currentPage(),
                'last_page' => $commissions->lastPage(),
                'links' => $commissions->linkCollection(), // use linkCollection() not just links()
            ],
            'totalCommission' => $mappedCommissions->sum('amount'),
            'affiliateCode' => ($user->is_affiliate_vendor == 1 && $user->affiliate_vendor_verifiy == 1 && $user->affiliate_code)
                ? $user->affiliate_code
                : '',
        ];
    }


    private function promoBannerIndex(Request $request)
    {   
         if (!Auth::check()) {
            return redirect()->route('login')->send();
        }
        $query = PromoBanner::query();

        if ($request->filled('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        $perPage = 8;
        $currentPage = $request->input('page', 1);

        return $query->select('id', 'name', 'thumbnail', 'banner_image')
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'thumbnail' => asset($item->thumbnail),
                    'banner_image' => asset($item->banner_image),
                ];
        });
    }


   private function promoVideo(Request $request)
    {  
        if (!Auth::check()) {
                return redirect()->route('login')->send();
            }

        $perPage = 8;
        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        // Fetch data from PromoPreviewVideo
        $promoQuery = PromoPreviewVideo::query();

        if ($request->filled('search')) {
            $promoQuery->where('name', 'LIKE', '%' . $request->search . '%');
        }

        $promoVideos = $promoQuery
        ->select('id', 'name as title', 'slug', 'thumbnail', 'preview_videos', 'category_ids')
        // ->select('id', 'name as title', 'slug', 'thumbnail', 'preview_videos', 'category_ids')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($video) {
                return [
                    'source' => 'promo', // Add source to avoid ID conflicts
                    'id' => 'promo_' . $video->id,
                    'slug' => $video->slug,
                    'name' => $video->title,
                    //'thumbnail' => asset($video->thumbnail),
                    //'preview_videos' => asset($video->preview_videos ?? ''),
                    //'video' => asset($video->video ?? $video->preview_videos ?? ''),
                     'thumbnail' => $video->thumbnail,
                'preview_videos' => $video->preview_videos,
                'video' => $video->preview_videos, // same as preview
                    'category' => $video->category_names ?? '',
                ];
            });
        
        // Fetch data from ShortVideo
        $shortVideos = ShortVideo::where('is_promo_video', 1)
        ->select('id',  'slug', 'thumbnail', 'video', 'category_id')
        // ->select('id', 'slug', 'thumbnail', 'video', 'category_id')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($video) {
                return [
                    'source' => 'short', // Add source to avoid ID conflicts
                    'id' => 'short_' . $video->id,
                    'slug' => $video->slug,
                    'name' => $video->title_en,
                    //'thumbnail' => asset($video->thumbnail),
                    //'preview_videos' => asset($video->preview_videos ?? $video->video ?? ''),
                    //'video' => asset($video->video ?? $video->preview_videos ?? ''),
                    'thumbnail' => asset($video->thumbnail),
                'preview_videos' => asset($video->video), // create common key
                'video' => asset($video->video),
                    'category' => $video->category_names ?? '',
                ];
            });

        
        

            $combined = collect($promoVideos) // convert to Collection if array
                ->merge(collect($shortVideos)) // same here
                ->sortByDesc(function ($item) {
                    return intval(str_replace(['promo_', 'short_'], '', $item['id']));
                })
                ->values();

                // Slice for pagination
                $paginatedItems = $combined->slice(($currentPage - 1) * $perPage, $perPage)->values();

                $paginated = new LengthAwarePaginator(
                    $paginatedItems,
                    $combined->count(),
                    $perPage,
                    $currentPage,
                    [
                        'path' => LengthAwarePaginator::resolveCurrentPath(),
                        'pageName' => 'page',
                    ]
        );

        // Return in Inertia-compatible format
        return [
            'data' => $paginated->items(),
            'links' => $paginated->linkCollection(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ];
    }


    private function galleryPromo(Request $request)
    {   
         if (!Auth::check()) {
            return redirect()->route('login')->send();
        }
        $perPage = 8;
        $currentPage = $request->input('page', 1);

        $query = Gallery::query()
            ->where('is_promo_video', 1);

        if ($request->filled('search')) {
            $query->where('title', 'LIKE', '%' . $request->search . '%');
        }

        return $query->select('id', 'slug', 'title', 'thumbnail', 'images', 'category_id')
            ->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $currentPage);

            $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $combined->forPage($currentPage, $perPage),
            $combined->count(),
            $perPage,
            $currentPage,
            ['path' => url()->current()]
        );

        return $paginated;
    }



    public function newPromoSinglePage(Request $request, $id)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->send();
        }

        // Try PromoPreviewVideo first
        $video = PromoPreviewVideo::where('slug', $id)->first();
        if ($video) {
            return Inertia::render('Videos/PromoTools/PromoSingleVideo', [
                'video' => [
                    'name' => $video->name,
                    'slug' => $video->slug,
                    'preview_videos' => $video->preview_videos,
                    'video' => $video->preview_videos,
                    'thumbnail' => $video->thumbnail,
                    'category' => $video->category_names ?? __('No Category'),
                ],
                'url' => $request->fullUrl(),
            ]);
        }

        // Then try ShortVideo
        $shortVideo = ShortVideo::where('slug', $id)
            ->where('is_promo_video', 1)
            ->first();
        if ($shortVideo) {
            return Inertia::render('Videos/PromoTools/PromoSingleVideo', [
                'video' => [
                    'name' => $shortVideo->title_en,
                    'slug' => $shortVideo->slug,
                    'preview_videos' => asset($shortVideo->video),
                    'video' => asset($shortVideo->video),
                    'thumbnail' => asset($shortVideo->thumbnail),
                    'category' => $shortVideo->category_names ?? __('No Category'),
                ],
                'url' => $request->fullUrl(),
            ]);
        }

        return redirect()->route('short.videos.browse')
            ->with('message', 'Video not found or not available.');
    }


    public function galleryPromoSinglePage(Request $request, $id)
    {  
         if (!Auth::check()) {
            return redirect()->route('login')->send();
        } 
        $user = Auth::user();
        $affiliateCode = $user->affiliate_code ?? '';
        $gallery = Gallery::where('slug', $id)
            ->where('is_promo_video', 1)
            ->first();


        if (!$gallery) {
            return redirect()
                ->route('short.videos.browse')
                ->with('message', 'Gallery not found or not available.');
        }

        $images = is_array($gallery->images)
            ? $gallery->images
            : explode(',', $gallery->images);

        return Inertia::render('Videos/PromoTools/PromoSingleGallery', [
            'gallery' => [
                'name' => $gallery->name,
                'slug' => $gallery->slug,
                'images' => collect($images)->map(fn($img) => asset($img)),
                'thumbnail' => asset($gallery->thumbnail),
                'category' => $gallery->category_names ?? __('No Category'),
            ],
            'url' => $request->url(),
            'affiliate_code' => $affiliateCode ?? '',
        ]);
    }

    
    private function promoAffiliateGuide()
    {  
         if (!Auth::check()) {
            return redirect()->route('login')->send();
        }
        return Page::where('page_slug', 'affiliate-guide')->first();
    }


    private function affiliateAccountTab()
    {
        return AffiliateAccounts::where('user_id', Auth::id())->first();
    }


    public function saveAffiliateAccount(Request $request)
    {
        $user = Auth::user();

        $rules = [
            'type' => 'required|in:Individual,Company',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'tax_id' => 'nullable',
        ];

        if ($request->type === 'Company') {
            $rules['company_name'] = 'required';
            $rules['reg_no'] = 'nullable';
            $rules['status'] = 'required';
        }

        $validated = $request->validate($rules);

        $affiliateAccount = AffiliateAccounts::where('user_id', $user->id)->first();

        if ($affiliateAccount) {
            $affiliateAccount->update(array_merge($validated, ['user_id' => $user->id]));
        } else {
            AffiliateAccounts::create(array_merge($validated, ['user_id' => $user->id]));
        }

        return redirect()->route('affiliateAccount')->with('success', 'Affiliate account saved successfully.');
    }

    
   public function withdrawalRequest(Request $request)
    {
        $user = Auth::user();
        $minLimit = opt('minimum_withdrawal_limit');
        $totalCommission = AffiliateTransactions::where('user_id', $user->id)
                                                ->orderBy('id', 'desc')
                                                ->value('balance');

        $existingPending = Payouts::where('user_id', $user->id)
                                    ->where('status', 'pending')
                                    ->exists();

        if ($existingPending) {
            return redirect()->route('withdrawalCommission')
                ->with('error', 'You already have a pending withdrawal request.');
        }
        $rules = [
            'amount'        => ['required', 'numeric', 'min:' . $minLimit, 'max:' . $totalCommission],
            'payment_type'  => ['required', 'in:Paypal,Crypto,Wire'],
        ];
        if ($request->payment_type === 'Paypal') {
            $rules['email'] = ['required', 'email'];
        } elseif ($request->payment_type === 'Crypto') {
            $rules['wallet_address'] = ['required', 'string', 'max:255'];
        } elseif ($request->payment_type === 'Wire') {
            $rules['iban_code'] = ['nullable', 'string', 'max:255'];
            $rules['swift_code'] = ['nullable', 'string', 'max:255'];
        }

        $validated = $request->validate($rules);
        if ($request->payment_type === 'Wire' && !$request->iban_code && !$request->swift_code) {
            return redirect()->back()->withInput()->withErrors([
                'iban_code' => 'Either IBAN Code or SWIFT Code must be provided.',
                'swift_code' => 'Either IBAN Code or SWIFT Code must be provided.',
            ]);
        }
        $payoutData = [
            'user_id'       => $user->id,
            'amount'        => $request->amount,
            'status'        => 'pending',
            'approve_by'    => null,
            'approved_at'   => null,
            'payment_type'  => $request->payment_type,
        ];
        if ($request->payment_type === 'Paypal') {
            $payoutData['email'] = $request->email;
        } elseif ($request->payment_type === 'Crypto') {
            $payoutData['wallet_address'] = $request->wallet_address;
        } elseif ($request->payment_type === 'Wire') {
            $payoutData['iban_code'] = $request->iban_code;
            $payoutData['swift_code'] = $request->swift_code;
        }

        Payouts::create($payoutData);

        return redirect()->route('withdrawalCommission')->with('success', 'Withdrawal request added successfully.');
    }



    
   


}
