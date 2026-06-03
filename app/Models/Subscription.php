<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'plan_id',
        'type',
        'stripe_id',
        'stripe_customer_id',
        'stripe_subscription_id',
        'stripe_status',
        'stripe_price',
        'quantity',
        'current_period_start',
        'current_period_end',
        'trial_started_at',
        'trial_ends_at',
        'ends_at',
        'canceled_at',
        'cancellation_reason',
        'auto_renewal',
        'payment_history',
        'grace_period_ends_at',
        'is_blocked',
    ];

    protected $casts = [
        'current_period_start' => 'datetime',
        'current_period_end' => 'datetime',
        'trial_started_at' => 'datetime',
        'trial_ends_at' => 'datetime',
        'ends_at' => 'datetime',
        'canceled_at' => 'datetime',
        'grace_period_ends_at' => 'datetime',
        'auto_renewal' => 'boolean',
        'is_blocked' => 'boolean',
        'payment_history' => 'array',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function failedPaymentAttempts(): HasMany
    {
        return $this->hasMany(PaymentAttempt::class)->where('status', 'failed');
    }

    public function paymentAttempts(): HasMany
    {
        return $this->hasMany(PaymentAttempt::class);
    }

    /**
     * Vérifier si la subscription est actuellement active
     */
    public function isActive(): bool
    {
        if ($this->plan->isFree()) {
            return true;
        }

        return $this->stripe_status === 'active' ||
               (now() < $this->trial_ends_at && $this->trial_ends_at !== null);
    }

    /**
     * Vérifier si la subscription a expiré
     */
    public function isExpired(): bool
    {
        if ($this->plan->isFree()) {
            return false;
        }

        if ($this->stripe_status === 'canceled') {
            return $this->ends_at !== null && now() > $this->ends_at;
        }

        return $this->trial_ends_at !== null && now() > $this->trial_ends_at
               && $this->stripe_status !== 'active';
    }

    /**
     * Vérifier si la période de grâce est active (14 jours)
     */
    public function isGracePeriodActive(): bool
    {
        if (!$this->grace_period_ends_at) {
            return false;
        }

        return now() < $this->grace_period_ends_at;
    }

    /**
     * Déterminer si le tenant doit être bloqué
     */
    public function shouldBlockTenant(): bool
    {
        if ($this->is_blocked) {
            return true;
        }

        if ($this->plan->isFree()) {
            return false;
        }

        // Bloquer si la grâce a expiré
        if ($this->grace_period_ends_at && now() > $this->grace_period_ends_at) {
            return true;
        }

        return false;
    }

    /**
     * Renouveler la subscription
     */
    public function renew(): self
    {
        $this->update([
            'stripe_status' => 'active',
            'current_period_start' => now(),
            'current_period_end' => now()->addMonths(1),
            'canceled_at' => null,
            'is_blocked' => false,
            'grace_period_ends_at' => null,
        ]);

        return $this;
    }

    /**
     * Annuler la subscription
     */
    public function cancel(string $reason = null): self
    {
        $this->update([
            'stripe_status' => 'canceled',
            'canceled_at' => now(),
            'cancellation_reason' => $reason,
            'grace_period_ends_at' => now()->addDays(14),
        ]);

        return $this;
    }

    /**
     * Mettre en pause la subscription
     */
    public function pause(): self
    {
        $this->update([
            'stripe_status' => 'paused',
        ]);

        return $this;
    }

    /**
     * Reprendre une subscription en pause
     */
    public function resume(): self
    {
        $this->update([
            'stripe_status' => 'active',
        ]);

        return $this;
    }

    /**
     * Mettre à niveau vers un nouveau plan
     */
    public function upgradeToPlan(Plan $newPlan): self
    {
        $this->update([
            'plan_id' => $newPlan->id,
            'stripe_price' => $newPlan->stripe_price_id,
        ]);

        return $this;
    }

    /**
     * Downgrade vers un nouveau plan
     */
    public function downgradeToPlan(Plan $newPlan): self
    {
        $this->update([
            'plan_id' => $newPlan->id,
            'stripe_price' => $newPlan->stripe_price_id,
        ]);

        return $this;
    }

    /**
     * Bloquer le tenant
     */
    public function block(): self
    {
        $this->update(['is_blocked' => true]);

        if ($this->tenant) {
            $this->tenant->update(['is_active' => false]);
        }

        return $this;
    }

    /**
     * Débloquer le tenant
     */
    public function unblock(): self
    {
        $this->update(['is_blocked' => false]);

        if ($this->tenant) {
            $this->tenant->update(['is_active' => true]);
        }

        return $this;
    }

    /**
     * Ajouter une tentative de paiement échoué au historique
     */
    public function recordFailedPayment(string $reason, string $chargeId = null): void
    {
        $history = $this->payment_history ?? [];
        $history[] = [
            'status' => 'failed',
            'reason' => $reason,
            'charge_id' => $chargeId,
            'attempted_at' => now()->toIso8601String(),
        ];

        $this->update(['payment_history' => $history]);
    }

    /**
     * Obtenir le nombre de tentatives échouées
     */
    public function getFailedPaymentCount(): int
    {
        return $this->failedPaymentAttempts()->count();
    }

    /**
     * Ajouter une période de grâce
     */
    public function addGracePeriod(int $days = 14): self
    {
        $this->update([
            'grace_period_ends_at' => now()->addDays($days),
        ]);

        return $this;
    }
}
