<?php

namespace App\Mail;

use App\Models\EbookSales;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EbookPurchasedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
    */
    public $sale;
    public function __construct(EbookSales $sale)
    {
        $this->sale = $sale;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
    */
    public function envelope()
    {
        return new Envelope(
            subject: 'Ebook Successfully Purchased',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
    */
    public function content()
    {
        return new Content(
            view: 'emails.ebook-purchase',
            with: [$this->sale]
        );
    }

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
