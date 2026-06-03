<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification client/acheteur
 */
class CustomerNotification extends Notification
{
    use Queueable;

    public ?string $userType = null;

    public function __construct(
        private readonly array $data = []
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $category = $this->data['category'] ?? 'general';
        $subject = $this->data['subject'] ?? 'Notification';
        $message = $this->data['message'] ?? '';

        return (new MailMessage)
            ->subject($subject)
            ->greeting("Bonjour {$notifiable->name},")
            ->line($message)
            ->when(
                $this->data['action_url'] ?? null,
                fn ($mail) => $mail->action($this->data['action_text'] ?? 'Voir', $this->data['action_url'])
            )
            ->line('Merci de votre confiance!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->data['title'] ?? $this->data['subject'] ?? 'Notification',
            'message' => $this->data['message'] ?? '',
            'category' => $this->data['category'] ?? 'general',
            'type' => $this->userType ?? 'customer',
            'icon' => $this->getIcon(),
            'color' => $this->getColor(),
            'data' => $this->data['extra_data'] ?? [],
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    private function getIcon(): string
    {
        $category = $this->data['category'] ?? 'general';

        return match ($category) {
            'order' => 'heroicon-o-shopping-bag',
            'payment' => 'heroicon-o-banknotes',
            'shipping' => 'heroicon-o-truck',
            'product' => 'heroicon-o-cube',
            'promotion' => 'heroicon-o-tag',
            'wishlist' => 'heroicon-o-heart',
            'review' => 'heroicon-o-star',
            'alert' => 'heroicon-o-exclamation-triangle',
            default => 'heroicon-o-bell',
        };
    }

    private function getColor(): string
    {
        $category = $this->data['category'] ?? 'general';

        return match ($category) {
            'order' => 'info',
            'payment' => 'success',
            'shipping' => 'primary',
            'product' => 'warning',
            'promotion' => 'success',
            'wishlist' => 'danger',
            'review' => 'primary',
            'alert' => 'warning',
            default => 'primary',
        };
    }
}
