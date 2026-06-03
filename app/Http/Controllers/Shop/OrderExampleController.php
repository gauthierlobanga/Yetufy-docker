<?php

namespace App\Http\Controllers\Shop;

use App\Events\OrderCreated;
use App\Events\OrderStatusChanged;
use App\Events\PaymentReceived;
use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Tenant;
use App\Models\User;
use App\Notifications\CustomerNotification;
use App\Notifications\OrderNotification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Exemple d'utilisation du système de notifications
 */
class OrderExampleController extends Controller
{
    /**
     * Créer une nouvelle commande
     */
    public function store(Request $request, NotificationService $notificationService)
    {
        // Valider et créer la commande
        $validated = $request->validate([
            'items' => 'required|array',
            'delivery_address_id' => 'required|exists:addresses,id',
        ]);

        try {
            $order = DB::transaction(function () use ($validated, $request) {
                $order = Commande::create([
                    'user_id' => $request->user()->id,
                    'shop_id' => tenant()->id,
                    'delivery_address_id' => $validated['delivery_address_id'],
                    'status' => 'pending',
                    'total' => 0, // Calculer le total
                ]);

                // Ajouter les items
                foreach ($validated['items'] as $item) {
                    $order->items()->create($item);
                }

                return $order;
            });

            // Déclencher l'événement - Cela notifie automatiquement le vendeur et le client
            event(new OrderCreated($order));

            return redirect()->route('orders.show', $order)
                ->with('success', 'Commande créée avec succès!');

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de la commande', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Erreur lors de la création de la commande');
        }
    }

    /**
     * Mettre à jour le statut de la commande
     */
    public function updateStatus(Request $request, Commande $order, NotificationService $notificationService)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $oldStatus = $order->status;
        $newStatus = $request->input('status');

        $order->update(['status' => $newStatus]);

        // Déclencher l'événement
        event(new OrderStatusChanged($order, $oldStatus, $newStatus));

        return redirect()->back()
            ->with('success', "Statut mis à jour à: {$newStatus}");
    }

    /**
     * Traiter le paiement
     */
    public function processPayment(Request $request, Commande $order, NotificationService $notificationService)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $amount = $request->input('amount');

        // Traiter le paiement avec Stripe, etc.
        // ... code de paiement ...

        // Déclencher l'événement de paiement
        event(new PaymentReceived(
            order: $order,
            amount: $amount,
            status: 'completed'
        ));

        $order->update(['status' => 'confirmed']);

        return redirect()->back()
            ->with('success', "Paiement de {$amount}€ traité avec succès!");
    }

    /**
     * Envoyer une notification personnalisée au client
     */
    public function sendCustomerNotification(Request $request, NotificationService $notificationService)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'message' => 'required|string',
        ]);

        $user = User::findOrFail($request->input('user_id'));

        // Envoyer une notification personnalisée
        $notificationService->notifyCustomer(
            customer: $user,
            notificationType: CustomerNotification::class,
            data: [
                'title' => $request->input('title'),
                'message' => $request->input('message'),
                'category' => 'general',
                'subject' => $request->input('title'),
            ]
        );

        return back()->with('success', 'Notification envoyée!');
    }

    /**
     * Envoyer une notification à tous les vendeurs
     */
    public function notifyAllVendors(Request $request, NotificationService $notificationService)
    {
        $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
        ]);

        // Récupérer tous les tenants
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            $notificationService->notifyTenantUsers(
                tenant: $tenant,
                notificationType: OrderNotification::class,
                data: [
                    'title' => $request->input('title'),
                    'message' => $request->input('message'),
                    'action' => 'system_message',
                ]
            );
        }

        return back()->with('success', 'Notifications envoyées à tous les vendeurs!');
    }

    /**
     * Envoyer une notification aux administrateurs
     */
    public function notifyAdmins(Request $request, NotificationService $notificationService)
    {
        $notificationService->notifyAdmins(
            notificationType: OrderNotification::class,
            data: [
                'title' => 'Alerte système',
                'message' => $request->input('message'),
                'action' => 'admin_alert',
            ]
        );

        return back()->with('success', 'Notification envoyée aux administrateurs!');
    }
}
