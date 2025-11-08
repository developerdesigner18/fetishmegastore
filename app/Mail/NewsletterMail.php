<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use App\Models\NewsLetter;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    public $newsletter;
    public $user;
    use Queueable, SerializesModels;
    
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(NewsLetter $newsletter, User $user)
    {
        $this->newsletter = $newsletter;
        $this->user = $user;
    }


    // public function build()
    // {
    //     return $this->subject($this->newsletter->title)
    //                 ->view('admin.template-file') // Changed to separate email view
    //                 ->with(['content' => $this->newsletter->description]);
    // }

    public function build()
    {
        return $this->subject($this->newsletter->title)
            ->view('admin.template-file')
            ->with([
                'content' => $this->newsletter->description,
                'newsletterTitle' => $this->newsletter->title,
                'user' => $this->user
            ]);
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Newsletter Mail',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    // public function content()
    // {
    //     return new Content(
    //         view: 'view.name',
    //     );
    // }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
