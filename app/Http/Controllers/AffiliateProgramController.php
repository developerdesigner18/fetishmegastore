<?php

namespace App\Http\Controllers;

use App\Events\ConversationEvent;
use App\Models\TokenPack;
use App\Models\TokenSale;
use App\Models\Models;
use Carbon\Carbon;
use App\Models\Video;
use App\Models\AffiliateCommission;
use App\Models\User;
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


class AffiliateProgramController extends Controller
{
    //     public function __construct()
    //     {
    //         $this->middleware('auth')
    //             ->except(['browseAudio', 'browse', 'videoPage','increaseViews']);
    //     }

    public function index(Request $request)
    {
          return Inertia::render('AffiliateProgram');
       
    }


}
