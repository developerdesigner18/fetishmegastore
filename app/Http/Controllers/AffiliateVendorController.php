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

class AffiliateVendorController extends Controller
{

    public function index(Request $request)
    {

        $users = User::where('is_affiliate_vendor', 1)
        ->where('affiliate_vendor_verifiy', 1)
        ->where('is_admin', '!=', 1)
        ->paginate(15);

         $active = 'affiliates list';

        return view('admin.affiliate.affiliate', compact('users', 'active'));
    }


    public function affiliatePending(Request $request)
    {
        $users = User::where('is_affiliate_vendor', 1)
            ->where('affiliate_vendor_verifiy', 0)
            ->where('is_admin', '!=', 1)
            ->paginate(15);

        $active = 'affiliates';
        return view('admin.affiliate.affiliate', compact('users', 'active'));
    }

    public function affiliatePendingStatus(Request $request)
    {
        if ($request->ajax()) {
                $user = User::findOrFail($request->id);
                $status = (int) $request->status;
                $user->affiliate_vendor_verifiy =  $status;
                if ($status === 1) {
                    $user->affiliate_vendor_verifiy_at = now();
                    if (empty($user->affiliate_code)) {
                        $user->affiliate_code = generateAlphaNumericCode();
                    }
                } 
            $user->save();

            return response()->json([
                'success' => true,
                'message' => $request->affiliate_vendor_verifiy == 1
                    ? 'Affiliate approved successfully'
                    : 'Status set to pending',
            ]);
        }

        return redirect()->route('affiliate.affiliatePending');
    }


   


}
