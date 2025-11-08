<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionStatus extends Notification
{
    use Queueable;

    public $message;
    public $chargeDetails;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($message, $chargeDetails = null)
    {
        $this->message = $message;
        $this->chargeDetails = $chargeDetails;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'message' => $this->message,
            'chargeDetails' => $this->chargeDetails ?? ''
        ];
    }
}
