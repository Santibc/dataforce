<?php

namespace Src\Application\Admin\Company\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class WelcomeCompanyNotification extends Notification
{
    protected $employee;

    /**
     * Create a new notification instance.
     *
     * @param  string  $employee
     */
    public function __construct($employee)
    {
        $this->employee = $employee;
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
        $salutation = new HtmlString('Warm Regards, <br><br> Victor Barroso <br>COO<br>BosMetrics');

        return (new MailMessage)
            ->subject("Welcome to BosMetrics: Empowering Your Delivery Company's Success!")
            ->greeting('Dear '.$this->employee.',')
            ->line("Welcome to BosMetrics! We are thrilled to have you on board and extend our sincerest gratitude for choosing our platform to enhance your delivery company's operations.")
            ->line("At BosMetrics, we are dedicated to providing you with the tools and support needed to streamline your scheduling processes and optimize performance across your team. Here's a brief overview of the services you can expect to benefit from:")
            ->line("Flexible Scheduling Tool: Our intuitive scheduling tool is designed to empower you with the flexibility to efficiently manage and organize your staff's schedules. Whether it's adjusting shifts on the fly or coordinating multiple shifts and positions seamlessly, our platform simplifies the process, saving you valuable time and resources. You can also properly manage your staff based on actual working hours, as we have integrated our scheduling tool with ADP or PAYCOM to accurately reflect the daily working hours of each employee.")
            ->line("Targeted Performance and Coaching Notifications: Stay informed and proactive with our targeted performance and coaching notifications. Your employees will receive weekly insights into their performance metrics and actionable feedback to drive continuous improvement. With personalized coaching recommendations, you can nurture talent, address areas of improvement, and elevate your company's overall efficiency and effectiveness.")
            ->line("At BosMetrics, we are not just a software provider — we are your partners in growth and success. We are committed to working closely with you to understand your unique challenges and goals, and to provide tailored solutions that help you thrive in today's competitive delivery landscape.")
            ->line("We are working hard to incorporate new areas of development and tools that will help you streamline all of your company's needs and resources in one platform. So be on the lookout for new solutions and improvements!")
            ->line('Should you have any questions, feedback, or require assistance at any stage, please do not hesitate to reach out to our dedicated support team. We are here to serve you and ensure that you make the most out of your BosMetrics experience.')
            ->line('Once again, thank you for choosing BosMetrics. We are excited to embark on this journey together and look forward to helping you unlock the full potential of your delivery company.')
            ->salutation($salutation);
    }
}
