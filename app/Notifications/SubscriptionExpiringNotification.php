<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class SubscriptionExpiringNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Tenant $tenant,
        private readonly ?Carbon $expiresAt = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $daysLeft = $this->expiresAt?->diffInDays(now());

        return (new MailMessage)
            ->subject("Votre subscription '{$this->tenant->raison_sociale}' expire bientôt")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Votre subscription pour la boutique **{$this->tenant->raison_sociale}** expire dans {$daysLeft} jour(s).")
            ->line("Après cette date, votre accès sera bloqué si vous n'avez pas renouvelé votre abonnement.")
            ->action('Gérer mon abonnement', route('tenant.subscription.show'))
            ->line('Merci d\'avoir utilisé notre plateforme!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'tenant_id' => $this->tenant->id,
            'tenant_name' => $this->tenant->raison_sociale,
            'expires_at' => $this->expiresAt?->toIso8601String(),
            'message' => 'Votre subscription expire dans 7 jours.',
            'type' => 'subscription_expiring',
        ];
    }
}
