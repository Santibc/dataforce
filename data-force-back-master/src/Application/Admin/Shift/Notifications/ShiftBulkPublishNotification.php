<?php

namespace Src\Application\Admin\Shift\Notifications;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ShiftBulkPublishNotification extends Notification
{
    protected Collection $shifts;

    protected string $companyName;

    protected ?string $adminName;

    public function __construct(
        Collection $shifts,
        string $companyName,
        ?string $adminName,
    ) {
        $this->shifts = $shifts;
        $this->companyName = $companyName;
        $this->adminName = $adminName;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $weekNumber = $this->shifts->first()->from->weekOfYear;

        return (new MailMessage)
            ->subject('Your Updated Schedule for week '.$weekNumber.' - '.$this->shifts->count().' shift(s)')
            ->view('emails.shift-bulk-notification', [
                'employee' => $notifiable->firstname.' '.$notifiable->lastname,
                'company' => $this->companyName,
                'shifts' => $this->shifts,
                'admin' => $this->adminName,
            ]);
    }
}
