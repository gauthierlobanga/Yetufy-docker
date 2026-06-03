<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification de paiement
 * Pour les vendeurs et administrateurs
 */
class PaymentNotification extends Notification
{
    use Queueable;

    public ?string $userType = null;

    public ?string $tenantId = null;

    public function __construct(
        private readonly array $data = []
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $order = $this->data['order'] ?? null;
        $amount = $this->data['amount'] ?? 0;
        $status = $this->data['status'] ?? 'pending';

        return (new MailMessage)
            ->subject($this->getMailSubject($status))
            ->greeting("Bonjour {$notifiable->name},")
            ->line($this->getMailLine($status, $amount, $order))
            ->action('Voir les détails', route('orders.show', $order?->id ?? '#'))
            ->line('Merci!');
    }

    public function toArray(object $notifiable): array
    {
        $order = $this->data['order'] ?? null;

        return [
            'title' => $this->getTitle(),
            'message' => $this->getMessage(),
            'order_id' => $order?->id,
            'amount' => $this->data['amount'] ?? 0,
            'status' => $this->data['status'] ?? 'pending',
            'type' => $this->userType,
            'icon' => 'heroicon-o-banknotes',
            'color' => 'success',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    private function getTitle(): string
    {
        $status = $this->data['status'] ?? 'pending';

        return match ($status) {
            'completed' => 'Paiement reçu',
            'pending' => 'Paiement en attente',
            'failed' => 'Paiement échoué',
            'refunded' => 'Remboursement effectué',
            default => 'Mise à jour de paiement',
        };
    }

    private function getMessage(): string
    {
        $status = $this->data['status'] ?? 'pending';
        $amount = $this->data['amount'] ?? 0;

        return match ($status) {
            'completed' => "Paiement de {$amount}€ reçu",
            'pending' => "Paiement de {$amount}€ en attente",
            'failed' => "Paiement de {$amount}€ a échoué",
            'refunded' => "Remboursement de {$amount}€ effectué",
            default => "Mise à jour de paiement: {$amount}€",
        };
    }

    private function getMailSubject(string $status): string
    {
        return match ($status) {
            'completed' => 'Paiement confirmé',
            'pending' => 'Paiement en attente',
            'failed' => 'Paiement échoué',
            'refunded' => 'Remboursement traité',
            default => 'Mise à jour de paiement',
        };
    }

    private function getMailLine(string $status, mixed $amount, $order): string
    {
        return match ($status) {
            'completed' => "Le paiement de {$amount}€ pour la commande #{$order?->number} a été confirmé.",
            'pending' => "Le paiement de {$amount}€ pour la commande #{$order?->number} est en attente.",
            'failed' => "Le paiement de {$amount}€ pour la commande #{$order?->number} a échoué.",
            'refunded' => "Un remboursement de {$amount}€ a été effectué pour la commande #{$order?->number}.",
            default => "Mise à jour: {$amount}€ - Commande #{$order?->number}",
        };
    }
}
