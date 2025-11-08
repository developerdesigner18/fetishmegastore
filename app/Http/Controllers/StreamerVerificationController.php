<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\StreamerVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class StreamerVerificationController extends Controller
{
    // auth
    public function __construct()
    {
        $this->middleware('auth')->except(['streamer.updateVerification']);
    }

    // form
    public function verifyForm()
    {
        Gate::authorize('channel-settings');
        $terms = asset('policy/Terms.pdf');
        $agreement = asset('policy/Streamer-Agreement.pdf');
        $rules = asset('policy/Content-Rules.pdf');
        return Inertia::render('Channel/StreamerVerification',compact('terms','agreement','rules'));
    }

    // pending message
    public function pendingVerification()
    {
        Gate::authorize('channel-settings');
        $terms = asset('policy/Terms.pdf');
        $agreement = asset('policy/Streamer-Agreement.pdf');
        $rules = asset('policy/Content-Rules.pdf');
        $user = \request()->user();
        return Inertia::render('Channel/VerificationPending', compact('terms', 'agreement', 'rules','user'));
    }

    // process
    public function submitVerification(Request $request)
    {

        Gate::authorize('channel-settings');

        $request->validate([
            'document' => 'required|mimes:jpg,png',
            'address' => 'nullable|string|max:255',
            'taxinfo' => 'nullable|string|max:255',
            'phonenumber' => 'nullable|string|max:255',
            'otheremail' => 'nullable|email|max:255',
            'is_terms' => 'accepted',         // Must be true or 1
            'is_agreement' => 'accepted',    // Must be true or 1
            'is_rules' => 'accepted',         // Must be true or 1
        ]);

        // temporary upload to be able to attach in mail
        // it gets deleted in the Event Listener
        $doc = $request->file('document')->store('streamer-vdocs');

        $request->session()->flash('message', __("Your verification request will be processed and you will be notified by email."));

        // find admin
        $admin = User::where('is_admin', 'yes')->firstOrFail();
        $admin->notify(new StreamerVerification($doc));

//        $dev = User::where('email', 'tushartarsariya.dds@gmail.com')->firstOrFail();
//        $dev->notify(new StreamerVerification($doc));

        $policy = [
            'terms' => $request->is_terms,
            'agreement' => $request->is_agreement,
            'rules' => $request->is_rules,
        ];

        // set pending
        $request->user()->update([
            'streamer_verification_sent' => true,
            'policy' => json_encode($policy),
            'address' => $request->address,
            'taxinfo' => $request->taxinfo,
            'phonenumber' => $request->phonenumber,
            'otheremail' => $request->otheremail]);

        return to_route('streamer.pendingVerification');
    }

    public function updateVerification(Request $request)
    {
        $request->validate([
//            'address' => 'sometimes|string|max:255',
//            'taxinfo' => 'sometimes|string|max:255',
//            'phonenumber' => 'sometimes|string|max:255',
//            'otheremail' => 'sometimes|email|max:255',
            'is_terms' => 'accepted',         // Must be true or 1
            'is_agreement' => 'accepted',    // Must be true or 1
            'is_rules' => 'accepted',         // Must be true or 1
        ]);

        $policy = [
            'terms' => $request->is_terms,
            'agreement' => $request->is_agreement,
            'rules' => $request->is_rules,
        ];

        $request->user()->update([
            'policy' => json_encode($policy),
            'address' => $request->address,
            'taxinfo' => $request->taxinfo,
            'phonenumber' => $request->phonenumber,
            'otheremail' => $request->otheremail,
        ]);

        session()->flash('message', __("Verification details updated successfully!"));

        return to_route('streamer.pendingVerification');
    }



    public function updateFeaturedVerified(Request $request, $id)
    {
        $streamer = User::find($id);
    
        if ($streamer) {
            // $validated = $request->validate([
            //     'is_featured_verified' => 'required|boolean',
            // ]);
    
            $streamer->is_featured_verified = $request->is_featured_verified;
            $streamer->save();
    
            return response()->json(['success' => true]);
        }
    
        return response()->json(['success' => false, 'message' => 'Streamer not found'], 404);
    }



}
