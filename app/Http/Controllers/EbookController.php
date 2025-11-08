<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Events\ConversationEvent;
use App\Mail\EbookPurchasedMail;
use App\Models\AdBlock;
use App\Models\Gallery;
use App\Models\EbookSales;
use App\Models\Models;
use App\Models\TextFile;
use App\Models\PurchaseHistory;
use App\Models\RecommendedVideo;
use App\Models\Tag;
use App\Models\Ebook;
use App\Models\VideoCategories;
use App\Notifications\NewEbookSale;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File as FileFacade;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EbookController extends Controller
{
    public function myEbook(Request $request)
    {
        $audio = $request->user()->purchasedEbook()->with('streamer');

        if ($request->has('search_term')) {
            $audio->where('title', 'LIKE', '%' . $request->search_term . '%');
        }

        $audio = $audio->paginate(4);
        // dd($audio);

        return Inertia::render('Videos/OrderedEbook', compact('audio'));
    }

    public function ebookManager(Request $request)
    {
        $ebook = $request->user()->ebooks()->orderByDesc('id')->paginate(9);
        return Inertia::render('Ebook/MyEbook', compact('ebook'));
    }

    public function uploadEbook(Request $request)
    {
        Gate::authorize('channel-settings');

        $ebook = [
            'id' => null,
            'title' => '',
            'category_id' => '',
            'price' => 0,
            'free_for_subs' => 'no',
        ];

        $audioDirectory = public_path('ebook');

        $availableAudio = \Illuminate\Support\Facades\File::files($audioDirectory);

        $fileNames = [];
        foreach ($availableAudio as $audioDetails) {
            $checkString = 'ebook/' . $audioDetails->getFilename();
            $checkIfThatAudioAlreadyAssigned = Ebook::where('ebook', $checkString)->exists();

            if ($checkIfThatAudioAlreadyAssigned) {
                continue;
            }

            // Prepare file name data
            $fileNames[] = [
                'label' => $audioDetails->getFilename(),
                'value' => $audioDetails->getFilename(),
            ];
        }

        // Fetch tags
        $tags = Tag::orderBy('name', 'asc')->get()->map(function ($tagDetails) {
            return [
                'label' => $tagDetails->name,
                'value' => $tagDetails->name,
            ];
        });

        // Fetch models
        $models = Models::orderBy('id', 'desc')->get()->map(function ($modelDetails) {
            return [
                'label' => $modelDetails->name,
                'value' => $modelDetails->id,
            ];
        });

        // Fetch categories
        $categories = VideoCategories::orderBy('category')->get()->map(function ($catDetails) {
            return [
                'label' => $catDetails->category,
                'value' => $catDetails->id,
            ];
        });

        $supportedLocales = getSupportedLocales();
        $ogValue = [
            'title' => [],
            'description' => [],
            'description_lang' => null,
            'title_lang' => null,
        ];
        // Render the view with the necessary data
        return Inertia::render('Videos/Partials/UploadEbook', compact('ebook', 'ogValue', 'categories', 'fileNames', 'tags', 'models','supportedLocales'));
    }

    public function editEbook(Ebook $ebook)
    {
        // if (auth()->user()->is_streamer == 'yes') {
        //     return to_route('ebook.list')->with('message', __('You cannot edit the video'));
        // }

        // Ensure the user has permission to edit the ebook
        // Gate::authorize('channel-settings');

        // Define the directory where ebook files are stored
        $imageDirectory = public_path('ebook');
        $availableAudio = \Illuminate\Support\Facades\File::files($imageDirectory);

        $fileNames = collect(\Illuminate\Support\Facades\File::files(public_path('ebook')))
        ->map(fn($file) => ['label' => $file->getFilename(), 'value' => $file->getFilename()])
        ->all();

        $tags = Tag::orderBy('name', 'asc')->get()->map(fn($t) => ['label' => $t->name, 'value' => $t->name])->all();
        $models = Models::orderBy('id', 'desc')->get()->map(fn($m) => ['label' => $m->name, 'value' => $m->id])->all();
        $categories = VideoCategories::orderBy('category')->get()->map(fn($c) => ['label' => $c->category, 'value' => $c->id])->all();

        $selectedCategoryIds = !empty($ebook->category_id) ? explode(',', $ebook->category_id) : [];
        $selectedModelIds = !empty($ebook->model_id) ? explode(',', $ebook->model_id) : [];
        $selectedTagNames = !empty($ebook->tags) ? explode(',', $ebook->tags) : [];

        $supportedLocales = getSupportedLocales();

        $ogValue = new \stdClass();
        $ogValue->title = json_decode($ebook->getRawOriginal('title'));
        $ogValue->description = json_decode($ebook->getRawOriginal('description'));
        $ogValue->description_lang = $ebook->description_lang;
        $ogValue->title_lang = $ebook->title_lang;
        // dd(gettype($ogValue), $ogValue, $ebook);

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            // $video->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            // $video->description_lang = "de";
        }

        // dd($ogValue->title_lang, $ogValue->description_lang, $ogValue, $ogValue);
        return Inertia::render('Videos/Partials/UploadEbook', compact('ebook', 'ogValue', 'categories', 'fileNames', 'tags', 'models', 'supportedLocales',
        'selectedCategoryIds', 'selectedModelIds', 'selectedTagNames'));
    }

    public function saveEbook(Request $request)
    {
        // Gate::authorize('channel-settings');
        $request->validate([
            'title_en' => 'required|min:2',
            'title_lang_val' => 'required|min:2',
            'price' => 'required|numeric',
            'free_for_subs' => 'required|in:yes,no',
            'thumbnail' => 'required|mimes:png,jpg',
            'category_id' => 'required|array',
            'description_en' => 'required',
            'description_lang_val' => 'required',
            'tag.*' => 'required',
        ]);
        DB::beginTransaction();
        try {
            $disk = env('FILESYSTEM_DISK', 'public');
            $thumbFile = null;
            $ebookPath = null;

            // Thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
                $thumbFileName = 'thumbnails/' . uniqid() . '-' . Auth::user()->id . '.' . $request->file('thumbnail')->getClientOriginalExtension();
                Storage::disk($disk)->put($thumbFileName, $thumbnail);
                Storage::disk($disk)->setVisibility($thumbFileName, 'public');
                $thumbFile = $thumbFileName;
            }

            // Ebook file upload (if not from FTP)
            if ($request->hasFile('ebook_file_input')) {
                $ebookFile = $request->file('ebook_file_input');
                $ebookFileName = 'ebooks/' . uniqid() . '-' . Auth::user()->id . '.' . $ebookFile->getClientOriginalExtension();
                Storage::disk($disk)->put($ebookFileName, file_get_contents($ebookFile->getRealPath()));
                Storage::disk($disk)->setVisibility($ebookFileName, 'public');
                $ebookPath = $ebookFileName;
            } elseif ($request->is_from_ftp && $request->filled('ebook_file_ftp')) {
                $ebookPath = 'ebooks/' . $request->ebook_file_ftp;
            }

            // Title and Description data prep
            $titleData = ['en' => $request->title_en];
            if ($request->filled('title_lang') && $request->filled('title_lang_val')) {
                $titleData[$request->title_lang] = $request->title_lang_val;
            }
        
            $descriptionData = ['en' => $request->description_en];
            if ($request->filled('description_lang') && $request->filled('description_lang_val')) {
                $descriptionData[$request->description_lang] = $request->description_lang_val;
            }
            // dd($ebookPath, $request->all());

            // Create ebook entry
            $ebook = Auth::user()->ebooks()->create([
                'title' => $titleData,
                'title_lang' => $request->title_lang,
                'description' => $descriptionData,
                'description_lang' => $request->description_lang,
                'slug' => Str::slug($request->title_en),
                'price' => $request->price,
                'free_for_subs' => $request->free_for_subs,
                'thumbnail' => $thumbFile,
                'ebook_file' => $ebookPath,
                'ebook' => $ebookPath,
                'disk' => $disk,
                'category_id' => implode(',', $request->category_id),
                'model_id' => $request->model_id ? implode(',', $request->model_id) : null,
                'tags' => $request->tag ? implode(',', $request->tag) : null,
                'is_from_ftp' => $request->is_from_ftp,
                'seo' => $request->has('seo') ? $request->seo : null,
                'views' => Ebook::RandomViews(),
            ]);

            DB::commit();

            return redirect()->route('ebook.list')->with('message', __('Ebook successfully uploaded.'));

        } catch (ValidationException $e) {
            DB::rollBack();
            if ($thumbFile && Storage::disk($disk)->exists($thumbFile)) { Storage::disk($disk)->delete($thumbFile); }
            if ($ebookPath && Storage::disk($disk)->exists($ebookPath)) { Storage::disk($disk)->delete($ebookPath); }
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            if ($thumbFile && Storage::disk($disk)->exists($thumbFile)) { Storage::disk($disk)->delete($thumbFile); }
            if ($ebookPath && Storage::disk($disk)->exists($ebookPath)) { Storage::disk($disk)->delete($ebookPath); }
            Log::error("Ebook Save Failed: " . $e->getMessage() . " for user " . Auth::user()->id);
            return back()->with('error', 'An error occurred while saving the ebook. Please try again.')->withInput();
        }
    }

    public function updateEbook(Ebook $ebook, Request $request)
    {
        // Gate::authorize('channel-settings');
        // Validation
        $request->validate([
            'title_en' => 'required|min:2',
            'title_lang_val' => 'required|min:2',
            'price' => 'required|numeric',
            'free_for_subs' => 'required|in:yes,no',
            'category_id.*' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $disk = env('FILESYSTEM_DISK', 'public');
            $thumbFile = $ebook->thumbnail;
            $ebookPath = $ebook->ebook_file;

            // Thumbnail update
            if ($request->hasFile('thumbnail')) {
                if ($ebook->thumbnail && Storage::disk($disk)->exists($ebook->thumbnail)) {
                    Storage::disk($disk)->delete($ebook->thumbnail);
                }
                $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
                $thumbFileName = 'thumbnails/' . uniqid() . '-' . Auth::user()->id . '.' . $request->file('thumbnail')->getClientOriginalExtension();
                Storage::disk($disk)->put($thumbFileName, $thumbnail);
                Storage::disk($disk)->setVisibility($thumbFileName, 'public');
                $thumbFile = $thumbFileName;
            }

            // Ebook file update
            if (!$request->is_from_ftp && $request->hasFile('ebook_file')) {
                if ($ebook->ebook_file && Storage::disk($disk)->exists($ebook->ebook_file)) {
                    Storage::disk($disk)->delete($ebook->ebook_file);
                }
                $uploadedEbookFile = $request->file('ebook_file');
                $ebookFileName = 'ebooks/' . uniqid() . '-' . Auth::user()->id . '.' . $uploadedEbookFile->getClientOriginalExtension();
                Storage::disk($disk)->put($ebookFileName, file_get_contents($uploadedEbookFile->getRealPath()));
                Storage::disk($disk)->setVisibility($ebookFileName, 'public');
                $ebookPath = $ebookFileName;
            } elseif ($request->is_from_ftp && $request->filled('ebook_file_ftp')) {
                $ebookPath = 'ebooks/' . $request->ebook_file_ftp;
            } elseif (!$request->is_from_ftp && !$request->hasFile('ebook_file') && !$request->filled('ebook_file_ftp')) {
                $ebookPath = $ebook->ebook_file;
            }

            // Title and Description data prep
            $titleData = ['en' => $request->title_en];
            if ($request->filled('title_lang') && $request->filled('title_lang_val')) {
                $titleData[$request->title_lang] = $request->title_lang_val;
            }
            $descriptionData = ['en' => $request->description_en];
            if ($request->filled('description_lang') && $request->filled('description_lang_val')) {
                $descriptionData[$request->description_lang] = $request->description_lang_val;
            }

            // Update ebook entry
            $ebook->update([
                'title' => $titleData,
                'title_lang' => $request->title_lang,
                'description' => $descriptionData,
                'description_lang' => $request->description_lang,
                'slug' => Str::slug($request->title_en),
                'price' => $request->price,
                'free_for_subs' => $request->free_for_subs,
                'thumbnail' => $thumbFile,
                'ebook_file' => $ebookPath,
                'ebook' => $ebookPath,
                'disk' => $disk,
                'category_id' => implode(',', $request->category_id),
                'model_id' => $request->model_id ? implode(',', $request->model_id) : null,
                'tags' => $request->tag ? implode(',', $request->tag) : null,
                'is_from_ftp' => $request->is_from_ftp,
                'seo' => $request->has('seo') ? $request->seo : null,
            ]);

            DB::commit();

            return redirect()->route('ebook.list')->with('message', __('Ebook successfully updated.'));

        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Ebook Update Failed for ID {$ebook->id}: " . $e->getMessage());
            return back()->with('error', 'An error occurred while updating the ebook. Please try again.')->withInput();
        }
    }

    public function uploadChunkedAudio(Request $request)
    {
        $file = $request->file;
        $is_last = $request->is_last;

        // temp chunks path
        $path = Storage::disk('public')->path("ebook/{$file->getClientOriginalName()}");

        // filename without .part in it
        $withoutPart = basename($path, '.part');

        // set file name inside path without .part
        $renamePath = public_path('ebook/' . $withoutPart);

        // set allowed extensions
        $allowedExt = ['mp3', 'ogg', 'mpeg'];
        $fileExt = explode('.', $withoutPart);
        $fileExt = end($fileExt);
        $fileExt = strtolower($fileExt);

        if (!in_array($fileExt, $allowedExt)) {
            Storage::disk('public')->delete($renamePath);
            throw new \Exception('Invalid extension');
        }

        // build allowed mimes
        $allowedMimes = [
            'ebook/mp3',
            'ebook/ogg',
            'ebook/mpeg',
        ];

        // append chunk to the file
        FileFacade::append($path, $file->get());

        // finally, let's make the file complete
        if ($is_last == "true") {
            // rename the file to original name
            FileFacade::move($path, $renamePath);

            // set a ref to local file
            $localFile = new File($renamePath);

            try {
                // first, lets get the mime type
                $finfo = new \finfo();
                $mime = $finfo->file($renamePath, FILEINFO_MIME_TYPE);
            } catch (\Exception $e) {
                $mime = null;
            }

            // validate allowed mimes
            if ($mime) {
                if (!in_array($mime, $allowedMimes) && $mime != 'application/octet-stream') {
                    throw new \Exception('Invalid file type: ' . $mime);
                }

                // this is from chunks, keep it as it passed the other validation
                if ($mime == 'application/octet-stream') {
                    $mime = 'ebook';
                }
            } else {
                $mime = 'ebook';
            }

            // set file destination
            if ($request->has('from') && $request->from = 'short-ebook') {
                $fileDestination = 'short-ebook';
            } else {
                $fileDestination = 'ebook';
            }

            $fileName = Storage::disk(env('FILESYSTEM_DISK'))->putFile($fileDestination, $localFile, 'public');

            FileFacade::delete($renamePath);
            return response()->json(['result' => $fileName]);
        }
    }

    public function deleteEbook(Request $request)
    {
        // Gate::authorize('channel-settings');
        $ebook = $request->user()->ebooks()->findOrFail($request->ebook);
        if ($ebook->ebook) {
            Storage::disk($ebook->disk)->delete($ebook->ebook);
        }
        if ($ebook->thumbnail) {
            Storage::disk($ebook->disk)->delete($ebook->thumbnail);
        }
        $ebook->delete();
        return back()->with('message', __('ebook removed'));
    }

    public function browseEbook(VideoCategories $videocategory = null, string $slug = null)
    {
        // dd("in");
        $event = new ConversationEvent(request()->get('conversions_tracking', ''));
        $event->callApi('site');

        $request = request();
        $randomaudio = [];
        $userrequest = [];
        $userrequest['page'] = $request->get("page", 1);
        if (!$videocategory) {
            $randomaudio = (array)Ebook::with(['streamer'])->inRandomOrder()->paginate(16)->toArray();
        // dd("in");
            $ebook = Ebook::with(['streamer']);
            $textFile = TextFile::with(['streamer']);
            $gallery = Gallery::with(['streamer']);
        } else {
            $ebook = $videocategory->ebooks()->with(['streamer']);
            $textFile = $videocategory->textFile()->with(['streamer']);
            $gallery = $videocategory->gallery()->with(['streamer']);
        }

        $userrequest['sort'] = $request->get('sort', 'Recently', 'pictures');

        switch ($request->sort) {
            case 'Most':
                $ebook = $ebook->orderByDesc('views');
                break;

            case 'Recently':
                $ebook = $ebook->orderByDesc('id');
                break;

            case 'Older':
                $ebook = $ebook->orderBy('created_at');
                break;

            case 'Highest':
                $ebook = $ebook->orderByDesc('price');
                break;

            case 'Lowest':
                $ebook = $ebook->orderBy('price');
                break;

            case 'Only Free':
                $ebook = $ebook->where('price', 0)->orderByDesc('views');
                break;
            case 'Latest':

            case 'toy':
                $ebook = $ebook->orderByDesc('id');
                break;

            case 'Ebook':
                $ebook = $ebook->orderByDesc('id');
                break;

            case 'audio_file':
                $ebook = $ebook->orderBy('title', 'asc');
                break;

            case 'text_file':
                $ebook = $textFile->orderByDesc('id');
                break;

            case 'phone_sex':
                $ebook = $ebook->orderByDesc('id');
                break;

            case 'real_session':
                $ebook = $ebook->orderByDesc('id');
                break;

            case 'live_streaming':
                $ebook = $ebook->orderByDesc('id');
                break;

            case 'weared_clothes':
                $ebook = $ebook->orderByDesc('id');
                break;

            case 'pictures':
                $ebook = $gallery->orderByDesc('id');
                break;

            default:
                $ebook = $ebook->orderByDesc('id');
                break;
        }

        // if keyword
        if ($request->filled('search')) {
            $userrequest['search'] = $request->search;

            $ebook->where('title', 'LIKE', '%' . $request->search . '%');
        }

        // case categories
        $userrequest['selectedCategories'] = [];
        if ($request->filled('selectedCategories')) {
            $randomaudio = [];
            $userrequest['selectedCategories'] = $request->selectedCategories;
            $ebook->where(function ($query) use ($request) {
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
            $randomaudio = [];
            $userrequest['selectedTags'] = $request->selectedTags;
            foreach ($request->selectedTags as $key => $tag) {
                if ($key == 0) {
                    $ebook->where('tags', 'LIKE', "%{$tag}%");
                } else {
                    $ebook->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            }
        }

        $userrequest['selectedModels'] = [];
        if ($request->filled('selectedModels')) {
            $randomaudio = [];
            $userrequest['selectedModels'] = $request->selectedModels;
            foreach ($request->selectedModels as $key => $model) {
                if ($key == 0) {
                    $ebook->where('model_id', 'LIKE', "%{$model}%");
                } else {
                    $ebook->orWhere('model_id', 'LIKE', "%{$model}%");
                }
            }
        }

        // fetch ebook
        $ebook = $ebook->paginate(28)->appends($request->query())->toArray();

        // the image
        $exploreImage = asset('images/browse-videos-icon.png');

        // all video categories
        $categories = VideoCategories::orderBy('category')->get();

        // assing to simple category
        $category = $videocategory;

        $tags = Tag::orderBy('name')->get();

        $models = Models::orderBy('name')->get();

        $blocks = AdBlock::all();
        // render the view

        $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse ebook';

        $recommendedAudioId = RecommendedVideo::pluck('video_id')->toArray();

        $recommendedAudio = Ebook::with(['streamer'])->whereIn('id', $recommendedAudioId)->paginate(16);

        return Inertia::render('Videos/BrowseEbook', compact('userrequest', 'randomaudio', 'recommendedAudio', 'ebook', 'category', 'exploreImage', 'categories', 'tags', 'models', 'blocks', 'headTitle'));
    }

    public function singleEbookPage($id)
    {
        // dd($id);
        $request = request();
        $ebook = Ebook::with('streamer')->where('slug', $id)->firstOrFail();
        // dd($ebook, $ebook->views);

        // Populate duration and tags
        $ebook->duration = $ebook->getDurationAttribute();
        $tags = is_array($ebook->tags) ? $ebook->tags : [];
        $ebooktags = [];

        foreach ($tags as $tag) {
            $item = Tag::where('name', 'LIKE', "%{$tag}%")->first();
            if ($item) {
                $ebooktags[] = [
                    "id" => $item->id,
                    "name" => $tag,
                ];
            }
        }

        $ebook->tags = $ebooktags;

        // Fetch related ebook
        $relatedebook = Ebook::where(function ($query) use ($ebooktags) {
            foreach ($ebooktags as $tag) {
                $query->orWhere('tags', 'LIKE', "%{$tag['name']}%");
            }
        })->paginate(8)->appends($request->query());

        // Handle pagination and return response
        $url = $request->url();
        if ($request->has('page') && $request->page > 1) {
            return $relatedebook;
        }

        // dd($ebook, $ebook->views);
        return Inertia::render('Videos/SingleEbookNew', compact('ebook', 'relatedebook', 'url'));
    }

    public function unlockEbook(Ebook $ebook, Request $request)
    {
        $ebook->load('streamer');

        if ($ebook->canBePlayed) {
            return back()->with('message', __('You already have access to this ebook'));
        }

        // dd($ebook);
        return Inertia::render('Ebook/Unlock', compact('ebook'));
    }

    public function purchaseEbook(Ebook $ebook, Request $request)
    {
        // check if user already bought
        if ($ebook->canBePlayed) {
            return back()->with('message', __('You already have access to this ebbok'));
        }

        $buyer = $request->user();
        affilaiteCommissionGenrate($buyer, $ebook);
        // record order
        $ebookSale = new EbookSales();
        $ebookSale->ebook_id = $ebook->id;
        $ebookSale->streamer_id = $ebook->user_id;
        $ebookSale->user_id = $request->user()->id;
        $ebookSale->price = $ebook->price;
        // dd($ebookSale, $ebook);
        $ebookSale->save();

        if ($ebookSale) {
            $addpurchasehistory = new PurchaseHistory();
            $addpurchasehistory->type = 'ebook';
            $addpurchasehistory->video_id = $ebook->id;
            $addpurchasehistory->user_id = auth()->user()->id;
            $addpurchasehistory->ip = $request->ip();
            $addpurchasehistory->save();
        }

        // subtract from user balance
        $request->user()->decrement('tokens', $ebook->price);

        // notify streamer of this sale (on platform)
        $ebook->streamer->notify(new NewEbookSale($ebookSale));

        Mail::to($request->user()->email)->send(new EbookPurchasedMail($ebookSale));
        return redirect(route('ebook.ordered'))->with('message', __("Thank you, you can now play the ebook!"));
    }

    public function increaseEbookViews(Ebook $shortVideo, Request $request) // Parameter ka naam 'shortVideo' (camelCase)
    {
        $sessionName = ip2long($request->ip()) . '_' . $shortVideo->id . '_short_video_viewed';
        $shortVideo->increment('views');
        $request->session()->put($sessionName, date('Y-m-d H:i:s'));
        Log::info("Views INCREASED for Short Video ID: {$shortVideo->id} by IP: {$request->ip()}");
        return response()->json(['result' => 'INCREASED', 'session' => $sessionName]);
    }

    /**
     * Ebook ko browser mein stream (view) karta hai.
     * Iske liye user ko login aur purchase/subscribe hona zaroori hai.
    */
    public function streamEbook(Ebook $ebook, Request $request)
    {
        // Gate::authorize('view-ebook', $ebook); // Authorization check (Policy set karna padega)

        // Ensure user has access
        if (!$ebook->canBePlayed) {
            return back()->with('error', __('You do not have access to stream this ebook.'));
        }

        try {
            $filePath = $ebook->ebook_file;
            
            if (!Storage::disk($ebook->disk)->exists($filePath)) {
                abort(404, 'Ebook file not found.');
            }

            $mimeType = Storage::disk($ebook->disk)->mimeType($filePath);
            
            // Response headers set karein
            $headers = [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"', // 'inline' se browser mein khulega
            ];

            return new StreamedResponse(function () use ($filePath, $ebook) {
                $stream = Storage::disk($ebook->disk)->readStream($filePath);
                fpassthru($stream); // File ko stream karein
                fclose($stream);
            }, 200, $headers);

        } catch (\Exception $e) {
            Log::error("Failed to stream ebook {$ebook->id}: " . $e->getMessage());
            abort(500, 'Could not stream ebook. Please try again.');
        }
    }

    /**
     * Ebook ko download karta hai.
     * Iske liye user ko login aur purchase/subscribe hona zaroori hai.
    */
    public function downloadEbook(Ebook $ebook, Request $request)
    {
        // Gate::authorize('download-ebook', $ebook); // Authorization check (Policy set karna padega)

        // Ensure user has access
        if (!$ebook->canBePlayed) {
            return back()->with('error', __('You do not have access to download this ebook.'));
        }
        
        try {
            $filePath = $ebook->ebook_file;
            
            if (!Storage::disk($ebook->disk)->exists($filePath)) {
                abort(404, 'Ebook file not found for download.');
            }
            return Storage::disk($ebook->disk)->download($filePath, basename($filePath));

        } catch (\Exception $e) {
            Log::error("Failed to download ebook {$ebook->id}: " . $e->getMessage());
            abort(500, 'Could not download ebook. Please try again.');
        }
    }
}