<?php

namespace App\Events;

use App\Models\Order;
use App\Notifications\PaymentNotification;
use App\Services\NotificationService;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentReceived
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Order $order,
        public float $amount,
        public string $status = 'completed',
    ) {}

    /**
     * Handle the event - Notifier le vendeur et le client
     */
    public function handle(NotificationService $notificationService): void
    {
        // Notifier le vendeur
        $notificationService->notifyTenantOwner(
            $this->order->shop,
            PaymentNotification::class,
            [
                'order' => $this->order,
                'amount' => $this->amount,
                'status' => $this->status,
                'message' => "Paiement de {$this->amount}€ reçu",
            ]
        );

        // Notifier le client
        $notificationService->notifyCustomer(
            $this->order->user,
            PaymentNotification::class,
            [
                'order' => $this->order,
                'amount' => $this->amount,
                'status' => $this->status,
                'message' => "Votre paiement de {$this->amount}€ a été confirmé",
            ]
        );
    }
}
