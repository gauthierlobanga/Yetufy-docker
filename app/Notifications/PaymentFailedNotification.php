<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Tenant $tenant,
        private readonly string $errorMessage,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Paiement échoué pour {$this->tenant->raison_sociale}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line('Le paiement de votre subscription a échoué.')
            ->line("**Erreur:** {$this->errorMessage}")
            ->line('Veuillez mettre à jour votre méthode de paiement.')
            ->action('Gérer mon abonnement', route('tenant.subscription.show'))
            ->line('Si le problème persiste, veuillez contacter notre support.');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'tenant_id' => $this->tenant->id,
            'tenant_name' => $this->tenant->raison_sociale,
            'error_message' => $this->errorMessage,
            'message' => 'Paiement échoué. Veuillez mettre à jour votre méthode de paiement.',
            'type' => 'payment_failed',
        ];
    }
}
