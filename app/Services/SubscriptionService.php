<?php

namespace App\Services;

use App\Events\PaymentFailed;
use App\Events\TenantSubscriptionBlocked;
use App\Events\TenantSubscriptionCanceled;
use App\Events\TenantSubscriptionCreated;
use App\Events\TenantSubscriptionRenewed;
use App\Models\Invoice;
use App\Models\PaymentAttempt;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Notifications\PaymentFailedNotification;
use App\Notifications\SubscriptionExpiringNotification;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Stripe\Subscription as StripeSubscription;

class SubscriptionService
{
    /**
     * Créer une subscription pour un tenant
     */
    public function createSubscription(Tenant $tenant, Plan $plan, ?User $user = null): Subscription
    {
        $user = $user ?? $tenant->users()->where('is_owner', true)->first();

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'type' => 'default',
            'stripe_status' => $plan->isFree() ? 'active' : 'trialing',
            'trial_started_at' => now(),
            'trial_ends_at' => $plan->isFree() ? null : now()->addDays($plan->trial_days ?? 14),
            'current_period_start' => now(),
            'current_period_end' => now()->addMonths(1),
            'auto_renewal' => true,
        ]);

        // Mettre à jour les dates du tenant
        $tenant->update([
            'date_activation' => now(),
            'date_expiration' => $plan->isFree() ? null : now()->addDays($plan->trial_days ?? 14),
        ]);

        return $subscription;
    }

    /**
     * Renouveler une subscription
     */
    public function renewSubscription(Subscription $subscription): Subscription
    {
        if (! $subscription->auto_renewal) {
            throw new \Exception('Auto-renewal est désactivé pour cette subscription');
        }

        $subscription->update([
            'stripe_status' => 'active',
            'current_period_start' => now(),
            'current_period_end' => now()->addMonths(1),
            'canceled_at' => null,
            'is_blocked' => false,
            'grace_period_ends_at' => null,
        ]);

        if ($subscription->tenant) {
            $subscription->tenant->update([
                'date_expiration' => now()->addMonths(1),
            ]);
        }

        return $subscription;
    }

    /**
     * Annuler une subscription
     */
    public function cancelSubscription(Subscription $subscription, ?string $reason = null): Subscription
    {
        $subscription->update([
            'stripe_status' => 'canceled',
            'canceled_at' => now(),
            'cancellation_reason' => $reason,
            'grace_period_ends_at' => now()->addDays(14),
        ]);

        return $subscription;
    }

    /**
     * Mettre en pause une subscription
     */
    public function pauseSubscription(Subscription $subscription): Subscription
    {
        $subscription->update(['stripe_status' => 'paused']);

        return $subscription;
    }

    /**
     * Reprendre une subscription
     */
    public function resumeSubscription(Subscription $subscription): Subscription
    {
        $subscription->update(['stripe_status' => 'active']);

        return $subscription;
    }

    /**
     * Mettre à niveau vers un nouveau plan
     */
    public function upgradeToPlan(Subscription $subscription, Plan $newPlan): Subscription
    {
        $subscription->update([
            'plan_id' => $newPlan->id,
            'stripe_price' => $newPlan->stripe_price_id,
        ]);

        return $subscription;
    }

    /**
     * Rétrograder vers un nouveau plan
     */
    public function downgradeToPlan(Subscription $subscription, Plan $newPlan): Subscription
    {
        $subscription->update([
            'plan_id' => $newPlan->id,
            'stripe_price' => $newPlan->stripe_price_id,
        ]);

        return $subscription;
    }

    /**
     * Bloquer un tenant
     */
    public function blockSubscription(Subscription $subscription): Subscription
    {
        $subscription->block();

        if ($subscription->tenant) {
            event(new TenantSubscriptionBlocked($subscription->tenant));
        }

        return $subscription;
    }

    /**
     * Débloquer un tenant
     */
    public function unblockSubscription(Subscription $subscription): Subscription
    {
        $subscription->unblock();

        return $subscription;
    }

    /**
     * Vérifier et bloquer les subscriptions expirées
     */
    public function blockExpiredSubscriptions(): Collection
    {
        $blocked = collect();

        Subscription::where('is_blocked', false)
            ->where(function ($query) {
                $query->where('grace_period_ends_at', '<', now())
                    ->orWhere(function ($q) {
                        $q->whereNull('grace_period_ends_at')
                            ->where('ends_at', '<', now());
                    });
            })
            ->get()
            ->each(function (Subscription $subscription) use ($blocked) {
                $this->blockSubscription($subscription);
                $blocked->push($subscription);
            });

        return $blocked;
    }

    /**
     * Notifier des subscriptions expirantes (7 jours)
     */
    public function notifyExpiringSubscriptions(): Collection
    {
        $notified = collect();

        Subscription::where('is_blocked', false)
            ->where('stripe_status', '!=', 'canceled')
            ->whereBetween('trial_ends_at', [now(), now()->addDays(7)])
            ->get()
            ->each(function (Subscription $subscription) use ($notified) {
                if ($subscription->user && $subscription->tenant) {
                    Notification::send($subscription->user, new SubscriptionExpiringNotification(
                        $subscription->tenant,
                        $subscription->trial_ends_at
                    ));
                    $notified->push($subscription);
                }
            });

        return $notified;
    }

    /**
     * Gérer un événement Stripe
     */
    public function handleStripeEvent(array $event): void
    {
        match ($event['type']) {
            'customer.subscription.created' => $this->handleSubscriptionCreated($event['data']['object']),
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($event['data']['object']),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($event['data']['object']),
            'invoice.created' => $this->handleInvoiceCreated($event['data']['object']),
            'invoice.paid' => $this->handleInvoicePaid($event['data']['object']),
            'invoice.payment_failed' => $this->handlePaymentFailed($event['data']['object']),
            'charge.failed' => $this->handleChargeFailed($event['data']['object']),
            default => null,
        };
    }

    /**
     * Gérer la création d'une subscription Stripe
     */
    protected function handleSubscriptionCreated(array $stripeSubscription): void
    {
        $subscription = Subscription::updateOrCreate(
            ['stripe_subscription_id' => $stripeSubscription['id']],
            [
                'stripe_status' => $stripeSubscription['status'],
                'stripe_customer_id' => $stripeSubscription['customer'],
                'current_period_start' => Carbon::createFromTimestamp($stripeSubscription['current_period_start']),
                'current_period_end' => Carbon::createFromTimestamp($stripeSubscription['current_period_end']),
                'trial_ends_at' => $stripeSubscription['trial_end']
                    ? Carbon::createFromTimestamp($stripeSubscription['trial_end'])
                    : null,
            ]
        );

        event(new TenantSubscriptionCreated($subscription->tenant));
    }

    /**
     * Gérer la mise à jour d'une subscription Stripe
     */
    protected function handleSubscriptionUpdated(array $stripeSubscription): void
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeSubscription['id'])->first();

        if (! $subscription) {
            return;
        }

        $subscription->update([
            'stripe_status' => $stripeSubscription['status'],
            'current_period_start' => Carbon::createFromTimestamp($stripeSubscription['current_period_start']),
            'current_period_end' => Carbon::createFromTimestamp($stripeSubscription['current_period_end']),
        ]);

        event(new TenantSubscriptionRenewed($subscription->tenant));
    }

    /**
     * Gérer la suppression d'une subscription Stripe
     */
    protected function handleSubscriptionDeleted(array $stripeSubscription): void
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeSubscription['id'])->first();

        if ($subscription) {
            $this->cancelSubscription($subscription, 'Canceled via Stripe');
            event(new TenantSubscriptionCanceled($subscription->tenant));
        }
    }

    /**
     * Gérer la création d'une facture Stripe
     */
    protected function handleInvoiceCreated(array $stripeInvoice): void
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeInvoice['subscription'])->first();

        if (! $subscription) {
            return;
        }

        Invoice::updateOrCreate(
            ['stripe_invoice_id' => $stripeInvoice['id']],
            [
                'subscription_id' => $subscription->id,
                'number' => Invoice::generateNumber(),
                'status' => $stripeInvoice['status'],
                'amount_due' => $stripeInvoice['amount_due'] / 100,
                'amount_paid' => $stripeInvoice['amount_paid'] / 100,
                'currency' => strtoupper($stripeInvoice['currency']),
                'issued_at' => Carbon::createFromTimestamp($stripeInvoice['created']),
                'due_at' => $stripeInvoice['due_date']
                    ? Carbon::createFromTimestamp($stripeInvoice['due_date'])
                    : null,
                'pdf_url' => $stripeInvoice['hosted_invoice_url'],
            ]
        );
    }

    /**
     * Gérer le paiement d'une facture Stripe
     */
    protected function handleInvoicePaid(array $stripeInvoice): void
    {
        $invoice = Invoice::where('stripe_invoice_id', $stripeInvoice['id'])->first();

        if ($invoice) {
            $invoice->markAsPaid();
        }
    }

    /**
     * Gérer l'échec du paiement d'une facture
     */
    protected function handlePaymentFailed(array $stripeInvoice): void
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeInvoice['subscription'])->first();

        if (! $subscription) {
            return;
        }

        $subscription->recordFailedPayment(
            'Invoice payment failed',
            $stripeInvoice['charge'] ?? null
        );

        event(new PaymentFailed($subscription->tenant, $stripeInvoice['amount_due'] / 100));

        // Notifier l'utilisateur
        if ($subscription->user) {
            Notification::send($subscription->user, new PaymentFailedNotification(
                $subscription->tenant,
                'Votre paiement a échoué'
            ));
        }
    }

    /**
     * Gérer l'échec d'une transaction Stripe
     */
    protected function handleChargeFailed(array $stripeCharge): void
    {
        PaymentAttempt::create([
            'subscription_id' => $this->getSubscriptionFromCharge($stripeCharge['customer'] ?? null)?->id,
            'stripe_charge_id' => $stripeCharge['id'],
            'status' => 'failed',
            'amount' => $stripeCharge['amount'] / 100,
            'currency' => strtoupper($stripeCharge['currency']),
            'reason_code' => $stripeCharge['failure_code'],
            'failure_message' => $stripeCharge['failure_message'],
            'attempted_at' => Carbon::createFromTimestamp($stripeCharge['created']),
        ]);
    }

    /**
     * Obtenir une subscription à partir d'un client Stripe
     */
    protected function getSubscriptionFromCharge(?string $customerId = null): ?Subscription
    {
        if (! $customerId) {
            return null;
        }

        return Subscription::where('stripe_customer_id', $customerId)->first();
    }

    /**
     * Synchroniser les subscriptions avec Stripe
     */
    public function syncWithStripe(): Collection
    {
        $synced = collect();

        Subscription::whereNotNull('stripe_subscription_id')
            ->where('deleted_at', null)
            ->get()
            ->each(function (Subscription $subscription) use ($synced) {
                try {
                    $stripeSubscription = StripeSubscription::retrieve(
                        $subscription->stripe_subscription_id,
                        ['api_key' => config('services.stripe.secret')]
                    );

                    $subscription->update([
                        'stripe_status' => $stripeSubscription->status,
                        'current_period_start' => Carbon::createFromTimestamp($stripeSubscription->current_period_start),
                        'current_period_end' => Carbon::createFromTimestamp($stripeSubscription->current_period_end),
                    ]);

                    $synced->push($subscription);
                } catch (\Exception $e) {
                    Log::error('Subscription sync failed', [
                        'subscription_id' => $subscription->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            });

        return $synced;
    }
}
