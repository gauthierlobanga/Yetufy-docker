<?php

namespace App\Events;

use App\Models\Order;
use App\Notifications\OrderNotification;
use App\Services\NotificationService;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusChanged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $oldStatus,
        public string $newStatus,
    ) {}

    /**
     * Handle the event - Notifier le vendeur et le client
     */
    public function handle(NotificationService $notificationService): void
    {
        // Notifier le vendeur (propriétaire du tenant)
        $notificationService->notifyTenantOwner(
            $this->order->shop,
            OrderNotification::class,
            [
                'order' => $this->order,
                'action' => $this->newStatus,
                'message' => "Commande #{$this->order->number} - Statut: {$this->newStatus}",
            ]
        );

        // Notifier le client
        $notificationService->notifyCustomer(
            $this->order->user,
            OrderNotification::class,
            [
                'order' => $this->order,
                'action' => $this->newStatus,
                'message' => "Votre commande #{$this->order->number} - Statut: {$this->newStatus}",
            ]
        );
    }
}
