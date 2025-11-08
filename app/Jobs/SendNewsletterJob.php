<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\NewsLetter;
use App\Mail\NewsletterMail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendNewsletterJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected NewsLetter $newsletter;
    protected array $userIds;

    public function __construct(NewsLetter $newsletter, array $userIds)
    {
        $this->newsletter = $newsletter;
        $this->userIds = $userIds;
    }

    public function handle(): void
    {
        $users = User::whereIn('id', $this->userIds)->get();

        foreach ($users as $user) {
            Mail::to($user->email)->send(new NewsletterMail($this->newsletter, $user));
        }
    }
}
