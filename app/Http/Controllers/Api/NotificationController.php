<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    /**
     * Récupérer les notifications non lues
     */
    public function unread(Request $request): JsonResponse
    {
        $limit = $request->query('limit', 10);
        $notifications = $this->notificationService->getUnreadNotifications(
            $request->user(),
            (int) $limit
        );

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'count' => count($notifications),
        ]);
    }

    /**
     * Récupérer toutes les notifications
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $limit = $request->query('limit', 20);

        $notifications = $user->notifications()
            ->latest()
            ->limit((int) $limit)
            ->get()
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'count' => count($notifications),
        ]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $marked = $this->notificationService->markAsRead($request->user(), $id);

        return response()->json([
            'success' => $marked,
            'message' => $marked ? 'Notification marquée comme lue' : 'Notification non trouvée',
        ]);
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Toutes les notifications ont été marquées comme lues',
        ]);
    }

    /**
     * Supprimer une notification
     */
    public function delete(Request $request, string $id): JsonResponse
    {
        $deleted = $this->notificationService->deleteNotification($request->user(), $id);

        return response()->json([
            'success' => $deleted,
            'message' => $deleted ? 'Notification supprimée' : 'Notification non trouvée',
        ]);
    }

    /**
     * Supprimer toutes les notifications lues
     */
    public function deleteRead(Request $request): JsonResponse
    {
        $count = $request->user()->readNotifications()->delete();

        return response()->json([
            'success' => true,
            'message' => "{$count} notifications supprimées",
            'count' => $count,
        ]);
    }

    /**
     * Compter les notifications non lues
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = $request->user()->unreadNotifications()->count();

        return response()->json([
            'success' => true,
            'unread_count' => $count,
        ]);
    }
}
