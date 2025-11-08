<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifiedStreamer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->is_streamer == 'yes' && $request->user()->is_streamer_verified == 'no') {
            if (!in_array($request->route()->getName(), ['streamer.verify', 'streamer.submitVerification', 'streamer.pendingVerification', 'logout','streamer.updateVerification','channel.settings','channel.update-settings','videos.list','videos.upload','videos.edit','videos.update','videos.save','videos.delete','preview.upload','preview.list','preview.update','preview.save','preview.delete','gallery.list','gallery.upload','gallery.update','gallery.save','gallery.delete'])) {
                if ($request->user()->streamer_verification_sent == 'yes') {
                    return to_route('streamer.pendingVerification');
                } else {
                    return to_route('streamer.verify');
                }
            }
        }
        return $next($request);
    }
}
