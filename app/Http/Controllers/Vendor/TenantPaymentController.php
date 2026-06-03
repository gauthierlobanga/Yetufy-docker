<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantPaymentController extends Controller
{
    /**
     * Liste des paiements.
     */
    public function index(Request $request): Response
    {
        $paiements = Paiement::query()
            ->when($request->input('statut'), fn ($q, $s) => $q->where('statut', $s))
            ->latest('date_paiement')
            ->paginate(10)
            ->through(fn (Paiement $paiement) => [
                'id' => $paiement->id,
                'reference' => $paiement->reference,
                'transaction_id' => $paiement->transaction_id,
                'montant' => (float) $paiement->montant,
                'mode' => $paiement->mode,
                'statut' => $paiement->statut,
                'date_paiement' => $paiement->date_paiement?->toDateTimeString() ?? $paiement->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Vendor/Payments/Index', [
            'paiements' => $paiements,
        ]);
    }
}
