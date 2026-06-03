<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService
    ) {}

    /**
     * Afficher la liste des subscriptions.
     */
    public function index(Request $request)
    {
        $query = Subscription::with(['tenant', 'plan', 'user'])->latest();

        // Filtrer par statut
        if ($request->status) {
            $query->where('stripe_status', $request->status);
        }

        // Filtrer par bloqué/non bloqué
        if ($request->has('blocked')) {
            $query->where('is_blocked', (bool) $request->blocked);
        }

        // Filtrer par plan
        if ($request->plan_id) {
            $query->where('plan_id', $request->plan_id);
        }

        // Rechercher par tenant
        if ($request->search) {
            $query->whereHas('tenant', function ($q) use ($request) {
                $q->where('raison_sociale', 'like', "%{$request->search}%")
                  ->orWhere('slug', 'like', "%{$request->search}%");
            });
        }

        $subscriptions = $query->paginate(25);

        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => $subscriptions->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'tenant_id' => $sub->tenant_id,
                    'tenant_name' => $sub->tenant?->raison_sociale,
                    'plan_name' => $sub->plan?->name,
                    'status' => $sub->stripe_status,
                    'is_blocked' => $sub->is_blocked,
                    'is_active' => $sub->isActive(),
                    'is_expired' => $sub->isExpired(),
                    'trial_ends_at' => $sub->trial_ends_at?->toIso8601String(),
                    'current_period_end' => $sub->current_period_end?->toIso8601String(),
                    'grace_period_ends_at' => $sub->grace_period_ends_at?->toIso8601String(),
                    'canceled_at' => $sub->canceled_at?->toIso8601String(),
                ];
            }),
            'filters' => [
                'status' => $request->status,
                'blocked' => $request->blocked,
                'plan_id' => $request->plan_id,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Afficher les détails d'une subscription.
     */
    public function show(Subscription $subscription)
    {
        $subscription->load(['tenant', 'plan', 'user', 'invoices', 'paymentAttempts']);

        return Inertia::render('Admin/Subscriptions/Show', [
            'subscription' => [
                'id' => $subscription->id,
                'tenant_id' => $subscription->tenant_id,
                'plan_id' => $subscription->plan_id,
                'status' => $subscription->stripe_status,
                'is_blocked' => $subscription->is_blocked,
                'auto_renewal' => $subscription->auto_renewal,
                'trial_started_at' => $subscription->trial_started_at?->toIso8601String(),
                'trial_ends_at' => $subscription->trial_ends_at?->toIso8601String(),
                'current_period_start' => $subscription->current_period_start?->toIso8601String(),
                'current_period_end' => $subscription->current_period_end?->toIso8601String(),
                'grace_period_ends_at' => $subscription->grace_period_ends_at?->toIso8601String(),
                'canceled_at' => $subscription->canceled_at?->toIso8601String(),
                'cancellation_reason' => $subscription->cancellation_reason,
                'payment_history' => $subscription->payment_history,
            ],
            'tenant' => [
                'id' => $subscription->tenant?->id,
                'name' => $subscription->tenant?->raison_sociale,
                'slug' => $subscription->tenant?->slug,
                'email' => $subscription->tenant?->email,
            ],
            'plan' => [
                'id' => $subscription->plan?->id,
                'name' => $subscription->plan?->name,
                'price' => $subscription->plan?->price,
                'interval' => $subscription->plan?->interval,
            ],
            'invoices' => $subscription->invoices->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'number' => $invoice->number,
                    'status' => $invoice->status,
                    'amount_due' => $invoice->amount_due,
                    'amount_paid' => $invoice->amount_paid,
                    'issued_at' => $invoice->issued_at?->toIso8601String(),
                    'paid_at' => $invoice->paid_at?->toIso8601String(),
                ];
            }),
            'paymentAttempts' => $subscription->paymentAttempts->map(function ($attempt) {
                return [
                    'id' => $attempt->id,
                    'status' => $attempt->status,
                    'amount' => $attempt->amount,
                    'attempted_at' => $attempt->attempted_at?->toIso8601String(),
                    'failure_message' => $attempt->failure_message,
                ];
            }),
        ]);
    }

    /**
     * Bloquer une subscription (accès complet fermé).
     */
    public function block(Request $request, Subscription $subscription)
    {
        try {
            $this->subscriptionService->blockSubscription($subscription);

            Log::info('Subscription blocked by admin', [
                'subscription_id' => $subscription->id,
                'tenant_id' => $subscription->tenant_id,
            ]);

            return back()->with('success', 'Subscription bloquée avec succès.');
        } catch (\Exception $e) {
            Log::error('Error blocking subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue.');
        }
    }

    /**
     * Débloquer une subscription.
     */
    public function unblock(Request $request, Subscription $subscription)
    {
        try {
            $this->subscriptionService->unblockSubscription($subscription);

            Log::info('Subscription unblocked by admin', [
                'subscription_id' => $subscription->id,
                'tenant_id' => $subscription->tenant_id,
            ]);

            return back()->with('success', 'Subscription débloquée avec succès.');
        } catch (\Exception $e) {
            Log::error('Error unblocking subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue.');
        }
    }

    /**
     * Renouveler une subscription manuellement.
     */
    public function renew(Request $request, Subscription $subscription)
    {
        try {
            $this->subscriptionService->renewSubscription($subscription);

            Log::info('Subscription renewed manually', [
                'subscription_id' => $subscription->id,
                'tenant_id' => $subscription->tenant_id,
            ]);

            return back()->with('success', 'Subscription renouvelée avec succès.');
        } catch (\Exception $e) {
            Log::error('Error renewing subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue.');
        }
    }

    /**
     * Ajouter une période de grâce.
     */
    public function addGracePeriod(Request $request, Subscription $subscription)
    {
        $request->validate(['days' => 'required|integer|min:1|max:90']);

        try {
            $subscription->update([
                'grace_period_ends_at' => now()->addDays($request->days),
            ]);

            Log::info('Grace period added', [
                'subscription_id' => $subscription->id,
                'days' => $request->days,
            ]);

            return back()->with('success', "Période de grâce de {$request->days} jour(s) ajoutée.");
        } catch (\Exception $e) {
            Log::error('Error adding grace period', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue.');
        }
    }

    /**
     * Voir les subscriptions expirées à bloquer.
     */
    public function expiredToBlock()
    {
        $subscriptions = $this->subscriptionService->blockExpiredSubscriptions();

        if ($subscriptions->isEmpty()) {
            return back()->with('info', 'Aucune subscription expirée à bloquer.');
        }

        return back()->with('success', "{$subscriptions->count()} subscription(s) bloquée(s).");
    }

    /**
     * Notifier les subscriptions expirant bientôt.
     */
    public function notifyExpiring()
    {
        $subscriptions = $this->subscriptionService->notifyExpiringSubscriptions();

        if ($subscriptions->isEmpty()) {
            return back()->with('info', 'Aucune notification à envoyer.');
        }

        return back()->with('success', "{$subscriptions->count()} notification(s) envoyée(s).");
    }

    /**
     * Synchroniser avec Stripe.
     */
    public function syncWithStripe()
    {
        try {
            $synced = $this->subscriptionService->syncWithStripe();

            Log::info('Subscriptions synced with Stripe', [
                'count' => $synced->count(),
            ]);

            return back()->with('success', "{$synced->count()} subscription(s) synchronisée(s) avec Stripe.");
        } catch (\Exception $e) {
            Log::error('Error syncing with Stripe', [
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue lors de la synchronisation.');
        }
    }
}
