<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentAttempt extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'subscription_id',
        'stripe_charge_id',
        'status',
        'amount',
        'currency',
        'reason_code',
        'failure_message',
        'attempted_at',
        'retry_count',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'attempted_at' => 'datetime',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Vérifier si la tentative a réussi
     */
    public function isSuccessful(): bool
    {
        return $this->status === 'succeeded';
    }

    /**
     * Vérifier si la tentative a échoué
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Vérifier si la tentative est en litige
     */
    public function isDisputed(): bool
    {
        return $this->status === 'disputed';
    }

    /**
     * Obtenir le message d'erreur formaté
     */
    public function getFormattedError(): string
    {
        if (!$this->isFailed()) {
            return '';
        }

        return sprintf(
            '%s (Code: %s)',
            $this->failure_message ?? 'Erreur de paiement',
            $this->reason_code ?? 'unknown'
        );
    }

    /**
     * Marquer comme succès
     */
    public function markAsSuccessful(): self
    {
        $this->update([
            'status' => 'succeeded',
            'failure_message' => null,
            'reason_code' => null,
        ]);

        return $this;
    }

    /**
     * Marquer comme échoué
     */
    public function markAsFailed(string $reason, string $code = null): self
    {
        $this->update([
            'status' => 'failed',
            'failure_message' => $reason,
            'reason_code' => $code,
        ]);

        return $this;
    }

    /**
     * Incrémenter le nombre de tentatives
     */
    public function incrementRetryCount(): self
    {
        $this->increment('retry_count');

        return $this;
    }
}
