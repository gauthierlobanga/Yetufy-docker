<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'subscription_id',
        'stripe_invoice_id',
        'number',
        'status',
        'amount_due',
        'amount_paid',
        'currency',
        'issued_at',
        'due_at',
        'paid_at',
        'pdf_url',
        'metadata',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'due_at' => 'datetime',
        'paid_at' => 'datetime',
        'amount_due' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'metadata' => 'array',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Générer un numéro de facture formaté
     */
    public static function generateNumber(): string
    {
        $year = now()->year;
        $count = self::whereYear('created_at', $year)->count() + 1;

        return sprintf('INV-%d-%05d', $year, $count);
    }

    /**
     * Vérifier si la facture est payée
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Vérifier si la facture est en attente de paiement
     */
    public function isPending(): bool
    {
        return $this->status === 'open';
    }

    /**
     * Marquer la facture comme payée
     */
    public function markAsPaid(): self
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return $this;
    }

    /**
     * Obtenir le montant restant à payer
     */
    public function getRemainingAmount(): float
    {
        return max(0, $this->amount_due - $this->amount_paid);
    }

    /**
     * Vérifier si la facture est en retard
     */
    public function isOverdue(): bool
    {
        return $this->due_at && now() > $this->due_at && ! $this->isPaid();
    }
}
