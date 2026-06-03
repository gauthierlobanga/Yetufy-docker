<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\VendorRequest;
use App\Services\PaymentService;
use App\Services\VendorRegistrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService,
        private readonly VendorRegistrationService $vendorService
    ) {}

    /**
     * Rediriger vers Stripe Checkout.
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();

        $vendorRequest = VendorRequest::findOrFail(session('vendor_request_id'));
        $plan = Plan::findOrFail($vendorRequest->plan_id);

        // Vérifier que l'utilisateur est le propriétaire
        if ($vendorRequest->user_id !== $user->id) {
            abort(403);
        }

        // Vérifier que le plan est payant
        if ($plan->is_free) {
            return redirect()->route('vendor.register')
                ->with('error', 'Ce plan est gratuit.');
        }

        try {
            $session = $this->paymentService->createCheckoutSession($user, $plan, $vendorRequest);

            $vendorRequest->update(['payment_session_id' => $session->id]);

            return Inertia::location($session->url);
        } catch (\Exception $e) {
            Log::error('Erreur création session Stripe', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return back()->with('error', 'Une erreur est survenue lors de la création du paiement.');
        }
    }

    /**
     * Page intermédiaire avant paiement.
     */
    public function index()
    {
        $vendorRequest = VendorRequest::findOrFail(session('vendor_request_id'));
        $plan = Plan::findOrFail($vendorRequest->plan_id);

        return Inertia::render('Vendor/Payment', [
            'plan' => $plan,
            'vendorRequest' => [
                'shop_name' => $vendorRequest->shop_name,
                'shop_slug' => $vendorRequest->shop_slug,
            ],
        ]);
    }

    /**
     * Succès du paiement.
     */
    public function success(Request $request)
    {
        $sessionId = $request->input('session_id');

        if (! $sessionId) {
            return redirect()->route('vendor.register')
                ->with('error', 'Session de paiement invalide.');
        }

        try {
            $result = $this->paymentService->verifyCheckoutSession($sessionId);

            if ($result['status'] === 'paid') {
                $vendorRequest = VendorRequest::findOrFail($result['metadata']['vendor_request_id']);

                // Approuver le vendeur et créer le tenant + subscription (via PaymentService webhook)
                // Note: Le webhook Stripe se déclenche asynchrone et appelle approve()
                // On vérifie ici que l'approbation a bien eu lieu
                $tenant = $vendorRequest->tenant;
                if (! $tenant) {
                    // Fallback si le webhook n'a pas eu le temps de se déclencher
                    $tenant = $this->vendorService->approve($vendorRequest);
                }

                if ($logoPath = session('temp_logo_path')) {
                    try {
                        $fullPath = storage_path('app/'.$logoPath);
                        if (file_exists($fullPath)) {
                            $tenant->addMedia($fullPath)
                                ->usingFileName('logo-'.$tenant->id.'.png')
                                ->toMediaCollection('tenant_avatar');
                        }
                        Storage::delete($logoPath);
                        session()->forget('temp_logo_path');
                    } catch (\Exception $e) {
                        Log::error('Erreur sauvegarde logo', [
                            'error' => $e->getMessage(),
                            'tenant_id' => $tenant->id,
                        ]);
                    }
                }
                // Nettoyer la session
                session()->forget('vendor_request_id');

                // Rediriger vers le dashboard du tenant
                $dashboardUrl = $this->vendorService->getVendeurDashboardUrl($tenant);
                return redirect($dashboardUrl);
            }

            return redirect()->route('vendor.register')
                ->with('error', 'Le paiement n\'a pas abouti. Veuillez réessayer.');
        } catch (\Exception $e) {
            Log::error('Erreur vérification paiement', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('vendor.register')
                ->with('error', 'Une erreur est survenue lors de la vérification du paiement.');
        }
    }

    /**
     * Annulation du paiement.
     */
    public function cancel()
    {
        return redirect()->route('vendor.configure')
            ->with('error', 'Le paiement a été annulé. Vous pouvez réessayer.');
    }

    /**
     * Webhook Stripe (pour les notifications asynchrones).
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        $result = $this->paymentService->handleWebhook($payload, $signature);

        if ($result['status'] === 'success') {
            // Approuver le vendeur si ce n'est pas déjà fait
            if (isset($result['vendor_request_id'])) {
                $vendorRequest = VendorRequest::find($result['vendor_request_id']);
                if ($vendorRequest && $vendorRequest->status !== VendorRequest::STATUS_APPROVED) {
                    $this->vendorService->approve($vendorRequest);
                }
            }

            return response()->json(['status' => 'ok'], 200);
        }

        return response()->json(['status' => 'error'], 400);
    }
}
