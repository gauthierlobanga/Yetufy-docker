<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
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
     * Afficher l'état actuel de la subscription.
     */
    public function show(Request $request)
    {
        $tenant = $request->tenant();
        $subscription = $tenant->subscription;

        if (! $subscription) {
            return Inertia::render('Tenant/Subscription/NoSubscription');
        }

        $plan = $subscription->plan;
        $availablePlans = Plan::active()
            ->where('id', '!=', $plan->id)
            ->ordered()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'currency' => $p->currency,
                    'interval' => $p->interval,
                    'formatted_price' => $p->formatted_price,
                    'description' => $p->description,
                    'features' => $p->features,
                ];
            });

        return Inertia::render('Tenant/Subscription/Show', [
            'subscription' => [
                'id' => $subscription->id,
                'status' => $subscription->stripe_status,
                'is_active' => $subscription->isActive(),
                'is_expired' => $subscription->isExpired(),
                'is_blocked' => $subscription->is_blocked,
                'trial_started_at' => $subscription->trial_started_at?->toIso8601String(),
                'trial_ends_at' => $subscription->trial_ends_at?->toIso8601String(),
                'current_period_start' => $subscription->current_period_start?->toIso8601String(),
                'current_period_end' => $subscription->current_period_end?->toIso8601String(),
                'grace_period_ends_at' => $subscription->grace_period_ends_at?->toIso8601String(),
                'auto_renewal' => $subscription->auto_renewal,
                'canceled_at' => $subscription->canceled_at?->toIso8601String(),
            ],
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $plan->price,
                'currency' => $plan->currency,
                'interval' => $plan->interval,
                'formatted_price' => $plan->formatted_price,
                'trial_days' => $plan->trial_days,
                'features' => $plan->features,
            ],
            'availablePlans' => $availablePlans,
            'invoices' => $subscription->invoices()
                ->latest()
                ->limit(10)
                ->get()
                ->map(function ($invoice) {
                    return [
                        'id' => $invoice->id,
                        'number' => $invoice->number,
                        'status' => $invoice->status,
                        'amount_due' => $invoice->amount_due,
                        'amount_paid' => $invoice->amount_paid,
                        'issued_at' => $invoice->issued_at?->toIso8601String(),
                        'paid_at' => $invoice->paid_at?->toIso8601String(),
                        'pdf_url' => $invoice->pdf_url,
                    ];
                }),
        ]);
    }

    /**
     * Upgrader vers un nouveau plan.
     */
    public function upgrade(Request $request)
    {
        $request->validate(['plan_id' => 'required|uuid|exists:plans,id']);

        $tenant = $request->tenant();
        $subscription = $tenant->subscription;

        if (! $subscription) {
            return back()->with('error', 'Aucune subscription trouvée.');
        }

        $newPlan = Plan::findOrFail($request->plan_id);

        if ($subscription->plan_id === $newPlan->id) {
            return back()->with('error', 'Vous êtes déjà sur ce plan.');
        }

        if ($newPlan->price < $subscription->plan->price) {
            return back()->with('error', 'Utilisez la rétrogradation pour un plan moins cher.');
        }

        try {
            $this->subscriptionService->upgradeToPlan($subscription, $newPlan);

            Log::info('Subscription upgraded', [
                'tenant_id' => $tenant->id,
                'old_plan' => $subscription->plan_id,
                'new_plan' => $newPlan->id,
            ]);

            return back()->with('success', 'Plan mis à jour avec succès.');
        } catch (\Exception $e) {
            Log::error('Error upgrading subscription', [
                'tenant_id' => $tenant->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue lors de la mise à jour du plan.');
        }
    }

    /**
     * Rétrograder vers un nouveau plan.
     */
    public function downgrade(Request $request)
    {
        $request->validate(['plan_id' => 'required|uuid|exists:plans,id']);

        $tenant = $request->tenant();
        $subscription = $tenant->subscription;

        if (! $subscription) {
            return back()->with('error', 'Aucune subscription trouvée.');
        }

        $newPlan = Plan::findOrFail($request->plan_id);

        if ($subscription->plan_id === $newPlan->id) {
            return back()->with('error', 'Vous êtes déjà sur ce plan.');
        }

        if ($newPlan->price >= $subscription->plan->price) {
            return back()->with('error', 'Utilisez l\'upgrade pour un plan plus cher.');
        }

        try {
            $this->subscriptionService->downgradeToPlan($subscription, $newPlan);

            Log::info('Subscription downgraded', [
                'tenant_id' => $tenant->id,
                'old_plan' => $subscription->plan_id,
                'new_plan' => $newPlan->id,
            ]);

            return back()->with('success', 'Plan rétrogradé avec succès.');
        } catch (\Exception $e) {
            Log::error('Error downgrading subscription', [
                'tenant_id' => $tenant->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue lors de la rétrogradation du plan.');
        }
    }

    /**
     * Annuler la subscription.
     */
    public function cancel(Request $request)
    {
        $request->validate(['reason' => 'nullable|string']);

        $tenant = $request->tenant();
        $subscription = $tenant->subscription;

        if (! $subscription) {
            return back()->with('error', 'Aucune subscription trouvée.');
        }

        try {
            $this->subscriptionService->cancelSubscription(
                $subscription,
                $request->reason ?? 'Canceled by user'
            );

            Log::info('Subscription canceled', [
                'tenant_id' => $tenant->id,
                'subscription_id' => $subscription->id,
            ]);

            return back()->with('success', 'Subscription annulée. Vous avez encore accès pendant 14 jours.');
        } catch (\Exception $e) {
            Log::error('Error canceling subscription', [
                'tenant_id' => $tenant->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue lors de l\'annulation.');
        }
    }

    /**
     * Pause la subscription.
     */
    public function pause(Request $request)
    {
        $tenant = $request->tenant();
        $subscription = $tenant->subscription;

        if (! $subscription) {
            return back()->with('error', 'Aucune subscription trouvée.');
        }

        try {
            $this->subscriptionService->pauseSubscription($subscription);

            Log::info('Subscription paused', [
                'tenant_id' => $tenant->id,
            ]);

            return back()->with('success', 'Subscription mise en pause.');
        } catch (\Exception $e) {
            Log::error('Error pausing subscription', [
                'tenant_id' => $tenant->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue.');
        }
    }

    /**
     * Reprendre la subscription.
     */
    public function resume(Request $request)
    {
        $tenant = $request->tenant();
        $subscription = $tenant->subscription;

        if (! $subscription) {
            return back()->with('error', 'Aucune subscription trouvée.');
        }

        try {
            $this->subscriptionService->resumeSubscription($subscription);

            Log::info('Subscription resumed', [
                'tenant_id' => $tenant->id,
            ]);

            return back()->with('success', 'Subscription réactivée.');
        } catch (\Exception $e) {
            Log::error('Error resuming subscription', [
                'tenant_id' => $tenant->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Une erreur est survenue.');
        }
    }

    /**
     * Afficher les invoices.
     */
    public function invoices(Request $request)
    {
        $tenant = $request->tenant();
        $subscription = $tenant->subscription;

        if (! $subscription) {
            return back()->with('error', 'Aucune subscription trouvée.');
        }

        $invoices = $subscription->invoices()
            ->latest()
            ->paginate(15);

        return Inertia::render('Tenant/Subscription/Invoices', [
            'invoices' => $invoices->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'number' => $invoice->number,
                    'status' => $invoice->status,
                    'amount_due' => $invoice->amount_due,
                    'amount_paid' => $invoice->amount_paid,
                    'issued_at' => $invoice->issued_at?->toIso8601String(),
                    'due_at' => $invoice->due_at?->toIso8601String(),
                    'paid_at' => $invoice->paid_at?->toIso8601String(),
                    'pdf_url' => $invoice->pdf_url,
                ];
            }),
        ]);
    }
}
