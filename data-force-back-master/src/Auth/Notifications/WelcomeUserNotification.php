<?php

namespace Src\Auth\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class WelcomeUserNotification extends Notification
{
    protected $employee;

    protected $company;

    /**
     * Create a new notification instance.
     *
     * @param  string  $employee
     * @param  string  $company
     */
    public function __construct($employee, $company)
    {
        $this->employee = $employee;
        $this->company = $company;
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
        $salutation = new HtmlString('Best Regards, <br><br> BosMetrics Team');

        return (new MailMessage)
            ->subject('Welcome to BosMetrics: Streamlining Your Workday for Success!')
            ->greeting('Dear '.$this->employee.',')
            ->line("We're delighted to welcome you to BosMetrics, your go-to platform for optimizing your work schedule and performance in your role at ".$this->company)
            ->line('As part of our commitment to enhancing your work experience and helping you excel in your responsibilities, we want to introduce you to the key features of our platform:')
            ->line("Effortless Scheduling: Say goodbye to the hassle of manual scheduling! With BosMetrics, you'll enjoy the convenience of an intuitive scheduling tool that allows you to view your shifts, manage availability, and make adjustments with ease. Our goal is to empower you with a flexible schedule that fits your needs and preferences.")
            ->line("Performance Insights: Stay informed about your performance metrics and receive valuable feedback to help you excel in your role. Through targeted notifications and coaching recommendations, you'll have the opportunity to continuously improve and contribute to the success of ".$this->company)
            ->line("We understand that your time is valuable, which is why we've designed BosMetrics to streamline your workday and enable you to focus on what matters most – delivering exceptional service to our customers.")
            ->line("If you have any questions about using BosMetrics or need assistance with any aspect of the platform, our dedicated support team is here to help. Feel free to reach out to us at any time, and we'll be happy to assist you.")
            ->line("Thank you for embracing BosMetrics as part of your workflow. We're excited to support you on your journey to success at ".$this->company)
            ->salutation($salutation);
    }
}
