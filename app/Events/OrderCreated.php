<?php

namespace App\Events;

use App\Models\Order;
use App\Notifications\OrderNotification;
use App\Services\NotificationService;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Order $order
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
                'action' => 'created',
                'message' => "Nouvelle commande #{$this->order->number}",
            ]
        );

        // Notifier le client
        $notificationService->notifyCustomer(
            $this->order->user,
            OrderNotification::class,
            [
                'order' => $this->order,
                'action' => 'created',
                'message' => "Votre commande #{$this->order->number} a été reçue",
            ]
        );
    }
}
