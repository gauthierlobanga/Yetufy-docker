<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification de base pour les commandes
 * Utilisée pour les vendeurs (tenants) et clients
 */
class OrderNotification extends Notification
{
    use Queueable;

    public ?string $userType = null;

    public ?string $tenantId = null;

    public function __construct(
        private readonly array $data = []
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $order = $this->data['order'] ?? null;
        $action = $this->data['action'] ?? 'created';

        return (new MailMessage)
            ->subject($this->getMailSubject($action))
            ->greeting("Bonjour {$notifiable->name},")
            ->line($this->getMailLine($action, $order))
            ->action('Voir la commande', $this->getOrderUrl($order))
            ->line('Merci de votre confiance!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $order = $this->data['order'] ?? null;

        return [
            'title' => $this->getTitle(),
            'message' => $this->getMessage(),
            'order_id' => $order?->id,
            'order_number' => $order?->number,
            'type' => $this->userType,
            'action' => $this->data['action'] ?? 'created',
            'icon' => 'heroicon-o-shopping-bag',
            'color' => 'info',
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    private function getTitle(): string
    {
        $action = $this->data['action'] ?? 'created';

        return match ($action) {
            'created' => 'Nouvelle commande',
            'confirmed' => 'Commande confirmée',
            'shipped' => 'Commande expédiée',
            'delivered' => 'Commande livrée',
            'cancelled' => 'Commande annulée',
            'returned' => 'Commande retournée',
            default => 'Mise à jour de commande',
        };
    }

    private function getMessage(): string
    {
        $order = $this->data['order'] ?? null;
        $action = $this->data['action'] ?? 'created';

        return match ($action) {
            'created' => "Nouvelle commande #{$order?->number}",
            'confirmed' => "Commande #{$order?->number} confirmée",
            'shipped' => "Commande #{$order?->number} expédiée",
            'delivered' => "Commande #{$order?->number} livrée",
            'cancelled' => "Commande #{$order?->number} annulée",
            'returned' => "Retour de la commande #{$order?->number}",
            default => "Mise à jour: {$order?->number}",
        };
    }

    private function getMailSubject(string $action): string
    {
        return match ($action) {
            'created' => 'Nouvelle commande reçue',
            'confirmed' => 'Commande confirmée',
            'shipped' => 'Commande en chemin',
            'delivered' => 'Commande livrée',
            'cancelled' => 'Commande annulée',
            default => 'Mise à jour de commande',
        };
    }

    private function getMailLine(string $action, $order): string
    {
        return match ($action) {
            'created' => "Vous avez reçu une nouvelle commande #{$order?->number}.",
            'confirmed' => "Votre commande #{$order?->number} a été confirmée.",
            'shipped' => "Votre commande #{$order?->number} a été expédiée.",
            'delivered' => "Votre commande #{$order?->number} a été livrée.",
            'cancelled' => "Votre commande #{$order?->number} a été annulée.",
            default => "Mise à jour concernant votre commande #{$order?->number}.",
        };
    }

    private function getOrderUrl($order): string
    {
        if (! $order) {
            return config('app.url');
        }

        if ($this->userType === 'vendor' && $this->tenantId) {
            return route('vendor.orders.show', $order->id);
        }

        return route('orders.show', $order->id);
    }
}
