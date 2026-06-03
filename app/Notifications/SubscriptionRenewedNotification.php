<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class SubscriptionRenewedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Tenant $tenant,
        private readonly ?Carbon $renewedUntil = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Subscription renouvelée - {$this->tenant->raison_sociale}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Votre subscription pour **{$this->tenant->raison_sociale}** a été renouvelée avec succès!")
            ->line("Votre accès est valide jusqu'au {$this->renewedUntil?->format('d/m/Y')}.")
            ->action('Accéder à mon dashboard', route('tenant.dashboard'))
            ->line('Merci de votre confiance!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'tenant_id' => $this->tenant->id,
            'tenant_name' => $this->tenant->raison_sociale,
            'renewed_until' => $this->renewedUntil?->toIso8601String(),
            'message' => 'Votre subscription a été renouvelée avec succès!',
            'type' => 'subscription_renewed',
        ];
    }
}
