<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\Video;
use App\Models\Tag;
use App\Models\AffiliateTracks;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\ContentWatchHistory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use DB;
use Intervention\Image\Facades\Image;

class AffiliateTrackController extends Controller
{
    public function index(Request $request)
    {
       $affiliate_tracks = AffiliateTracks::orderBy('id', 'desc')->get();
        return view('admin.affiliateTracks.affiliate-tracks', compact('affiliate_tracks'));
    }

    
}
