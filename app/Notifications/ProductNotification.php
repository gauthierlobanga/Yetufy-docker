<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification de produit pour les vendeurs
 */
class ProductNotification extends Notification
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
        $product = $this->data['product'] ?? null;
        $action = $this->data['action'] ?? 'created';

        return (new MailMessage)
            ->subject($this->getMailSubject($action))
            ->greeting("Bonjour {$notifiable->name},")
            ->line($this->getMailLine($action, $product))
            ->action('Voir le produit', route('products.show', $product?->id ?? '#'))
            ->line('Merci!');
    }

    public function toArray(object $notifiable): array
    {
        $product = $this->data['product'] ?? null;

        return [
            'title' => $this->getTitle(),
            'message' => $this->getMessage(),
            'product_id' => $product?->id,
            'product_name' => $product?->name,
            'action' => $this->data['action'] ?? 'created',
            'type' => $this->userType,
            'icon' => 'heroicon-o-cube',
            'color' => 'warning',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    private function getTitle(): string
    {
        $action = $this->data['action'] ?? 'created';

        return match ($action) {
            'created' => 'Produit créé',
            'updated' => 'Produit mis à jour',
            'published' => 'Produit publié',
            'archived' => 'Produit archivé',
            'low_stock' => 'Stock faible',
            'out_of_stock' => 'Rupture de stock',
            default => 'Mise à jour produit',
        };
    }

    private function getMessage(): string
    {
        $action = $this->data['action'] ?? 'created';
        $product = $this->data['product'] ?? null;

        return match ($action) {
            'created' => "Produit {$product?->name} créé",
            'updated' => "Produit {$product?->name} mis à jour",
            'published' => "Produit {$product?->name} publié",
            'archived' => "Produit {$product?->name} archivé",
            'low_stock' => "Stock faible: {$product?->name}",
            'out_of_stock' => "Rupture de stock: {$product?->name}",
            default => "Mise à jour: {$product?->name}",
        };
    }

    private function getMailSubject(string $action): string
    {
        return match ($action) {
            'created' => 'Nouveau produit créé',
            'updated' => 'Produit mis à jour',
            'published' => 'Produit publié',
            'archived' => 'Produit archivé',
            'low_stock' => 'Alerte: Stock faible',
            'out_of_stock' => 'Alerte: Rupture de stock',
            default => 'Mise à jour produit',
        };
    }

    private function getMailLine(string $action, $product): string
    {
        return match ($action) {
            'created' => "Vous avez créé un nouveau produit: {$product?->name}",
            'updated' => "Le produit {$product?->name} a été mis à jour.",
            'published' => "Le produit {$product?->name} est maintenant publié.",
            'archived' => "Le produit {$product?->name} a été archivé.",
            'low_stock' => "Stock faible pour {$product?->name}. Quantité: {$this->data['quantity'] ?? 0}",
            'out_of_stock' => "Rupture de stock pour {$product?->name}.",
            default => "Mise à jour: {$product?->name}",
        };
    }
}
