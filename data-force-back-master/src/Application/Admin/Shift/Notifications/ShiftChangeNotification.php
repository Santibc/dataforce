<?php

namespace Src\Application\Admin\Shift\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class ShiftChangeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $subject;

    protected TypeShift $type;

    protected string $employee;

    protected ?string $supervisor;

    protected ?string $position_name;

    protected string $company;

    protected string $date;

    protected string $time;

    protected ?string $prev_date;

    protected ?string $prev_time;

    protected ?string $prev_to;

    protected ?string $time_to;

    public function __construct(
        string $subject,
        TypeShift $type,
        string $employee,
        string $company,
        string $date,
        string $time,
        ?string $supervisor,
        ?string $position_name,
        ?string $prev_date,
        ?string $prev_time,
        ?string $prev_to,
        ?string $time_to,
    ) {
        $this->subject = $subject;
        $this->type = $type;
        $this->employee = $employee;
        $this->supervisor = $supervisor;
        $this->position_name = $position_name;
        $this->company = $company;
        $this->date = $date;
        $this->time = $time;
        $this->prev_time = $prev_time;
        $this->prev_date = $prev_date;
        $this->prev_to = $prev_to;
        $this->time_to = $time_to;
    }

    /**
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if ($this->type == TypeShift::CANCEL) {

            return (new MailMessage)
                ->subject($this->subject)
                ->view('emails.shift-cancel', [
                    'employee' => $this->employee,
                    'date' => $this->date,
                    'time' => $this->time,
                    'company' => $this->company,
                ]);

        } elseif ($this->type == TypeShift::UPDATE) {

            return (new MailMessage)
                ->subject($this->subject)
                ->view('emails.shift-update', [
                    'employee' => $this->employee,
                    'date' => $this->date,
                    'time' => $this->time,
                    'time_to' => $this->time_to,
                    'prev_date' => $this->prev_date,
                    'prev_time' => $this->prev_time,
                    'prev_to' => $this->prev_to,
                    'position' => $this->position_name,
                    'supervisor' => $this->supervisor,
                    'company' => $this->company,
                ]);

        } else {

            return (new MailMessage)
                ->subject($this->subject)
                ->view('emails.shift-notification', [
                    'date' => $this->date,
                    'time_from' => $this->time,
                    'time_to' => $this->time_to,
                    'position' => $this->position_name,
                ]);

        }

    }
}

enum TypeShift: string
{
    case CANCEL = 'CANCEL';
    case UPDATE = 'UPDATE';
    case CREATE = 'CREATE';
}
