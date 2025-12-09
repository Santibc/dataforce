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

            $greeting = 'Dear '.$this->employee.',';
            $salutation = new HtmlString('Best Regards, <br><br> BosMetrics Team');

            return (new MailMessage)
                ->subject($this->subject)
                ->greeting($greeting)
                ->salutation($salutation)
                ->line("We regret to inform you that your scheduled shift for {$this->date} at {$this->time} has been canceled.")
                ->line('We apologize for any inconvenience this may cause.')
                ->line("Please review your updated schedule on BosMetrics for any further adjustments. If you have any concerns or need assistance, don't hesitate to reach out to your supervisor or manager for clarification.")
                ->line("Thank you for your understanding and flexibility. We appreciate your dedication to {$this->company}, and we look forward to your continued contributions.");

        } elseif ($this->type == TypeShift::UPDATE) {

            $greeting = 'Dear '.$this->employee.',';
            $salutation = new HtmlString('Best Regards, <br><br> BosMetrics Team');

            return (new MailMessage)
                ->subject($this->subject)
                ->greeting($greeting)
                ->salutation($salutation)
                ->line("We wanted to inform you that there have been changes made to your scheduled shift for {$this->date} at {$this->time}. Please review the updated details below:")
                ->line("Previous Shift: {$this->prev_date} at {$this->prev_time} to {$this->prev_to}")
                ->line("New Shift: {$this->date} at {$this->time} to {$this->time_to}")
                ->line("Location/Department: {$this->position_name}")
                ->line("Supervisor/Manager: {$this->supervisor}")
                ->line('We understand that changes to your schedule may impact your plans, and we apologize for any inconvenience this may cause. If you have any questions or concerns regarding this update, please reach out to your supervisor or manager for further assistance.')
                ->line("Thank you for your understanding and flexibility as we work to ensure efficient operations at {$this->company}.");

        } else {

            $greeting = 'Dear '.$this->employee.',';
            $salutation = new HtmlString('Best Regards, <br><br> BosMetrics Team');

            return (new MailMessage)
                ->subject($this->subject)
                ->greeting($greeting)
                ->salutation($salutation)
                ->line("We hope this message finds you well. We're reaching out to inform you that your schedule for the upcoming {$this->time} to {$this->time_to} has been published on BosMetrics..")
                ->line('Here are the details of your schedule:')
                ->line("Date: {$this->date}")
                ->line("Shift Start Time: {$this->time}")
                ->line("Shift End Time: {$this->time_to}")
                ->line("Location/Department: {$this->position_name}")
                ->line("Supervisor/Manager: {$this->supervisor}")
                ->line("Please review your schedule carefully and ensure that you are available for your assigned shifts. If you have any questions or concerns about your schedule, or if you need to request any changes, please don't hesitate to reach out to your supervisor or manager.")
                ->line("Thank you for your attention to this matter. We appreciate your dedication and commitment to {$this->company}, and we look forward to your continued contributions to our team.");

        }

    }
}

enum TypeShift: string
{
    case CANCEL = 'CANCEL';
    case UPDATE = 'UPDATE';
    case CREATE = 'CREATE';
}
