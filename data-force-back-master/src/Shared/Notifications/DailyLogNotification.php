<?php

namespace Src\Shared\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DailyLogNotification extends Notification
{
    private const SEVERITY_COLORS = [
        'Low' => ['color' => '#16a34a', 'bg' => '#dcfce7'],
        'Medium' => ['color' => '#d97706', 'bg' => '#fef3c7'],
        'High' => ['color' => '#dc2626', 'bg' => '#fee2e2'],
    ];

    public function __construct(
        protected string $driverName,
        protected string $eventType,
        protected string $severity,
        protected string $description,
        protected string $actionTaken,
        protected string $date,
        protected string $adminName,
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $colors = self::SEVERITY_COLORS[$this->severity] ?? self::SEVERITY_COLORS['Medium'];

        return (new MailMessage)
            ->subject("Daily Log Report - {$this->eventType} - {$this->date}")
            ->view('emails.daily-log-notification', [
                'driverName' => $this->driverName,
                'eventType' => $this->eventType,
                'severity' => $this->severity,
                'description' => $this->description,
                'actionTaken' => $this->actionTaken,
                'date' => $this->date,
                'adminName' => $this->adminName,
                'severityColor' => $colors['color'],
                'severityBgColor' => $colors['bg'],
            ]);
    }
}
