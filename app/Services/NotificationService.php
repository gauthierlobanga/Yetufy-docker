<?php

namespace App\Services;

use App\Events\NotificationDispatched;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Notifications\Notification;

class NotificationService
{
    /**
     * Types de notifications
     */
    public const TYPE_VENDOR = 'vendor';      // Pour les vendeurs

    public const TYPE_CUSTOMER = 'customer';  // Pour les clients

    public const TYPE_SYSTEM = 'system';      // Système

    /**
     * Catégories de notifications
     */
    public const CATEGORY_ORDER = 'order';

    public const CATEGORY_PAYMENT = 'payment';

    public const CATEGORY_PRODUCT = 'product';

    public const CATEGORY_CUSTOMER = 'customer';

    public const CATEGORY_SYSTEM = 'system';

    /**
     * Notifier un ou plusieurs utilisateurs
     */
    public function notify(
        User|array $users,
        string $notificationType,
        array $data = [],
    ): void {
        $users = is_array($users) ? $users : [$users];

        foreach ($users as $user) {
            $this->sendNotification($user, $notificationType, $data);
        }
    }

    /**
     * Notifier tous les utilisateurs d'un tenant (vendeurs)
     */
    public function notifyTenantUsers(
        Tenant $tenant,
        string $notificationType,
        array $data = [],
    ): void {
        $users = $tenant->users;

        foreach ($users as $user) {
            $notification = $this->getNotificationInstance($notificationType, $data);
            $notification->userType = self::TYPE_VENDOR;
            $notification->tenantId = $tenant->id;

            $user->notify($notification);

            // Broadcast l'événement
            event(new NotificationDispatched(
                user: $user,
                notification: $notification,
                channel: "tenant.{$tenant->id}.users.{$user->id}"
            ));
        }
    }

    /**
     * Notifier un client acheteur
     */
    public function notifyCustomer(
        User $customer,
        string $notificationType,
        array $data = [],
    ): void {
        $notification = $this->getNotificationInstance($notificationType, $data);
        $notification->userType = self::TYPE_CUSTOMER;

        $customer->notify($notification);

        // Broadcast l'événement
        event(new NotificationDispatched(
            user: $customer,
            notification: $notification,
            channel: "customer.{$customer->id}"
        ));
    }

    /**
     * Notifier le propriétaire du tenant
     */
    public function notifyTenantOwner(
        Tenant $tenant,
        string $notificationType,
        array $data = [],
    ): void {
        $owner = $tenant->owner;

        if ($owner) {
            $this->notifyTenantUsers($tenant, $notificationType, $data);
        }
    }

    /**
     * Envoyer une notification système à l'admin
     */
    public function notifyAdmins(
        string $notificationType,
        array $data = [],
    ): void {
        $admins = User::role('super_admin')->get();

        foreach ($admins as $admin) {
            $notification = $this->getNotificationInstance($notificationType, $data);
            $notification->userType = self::TYPE_SYSTEM;

            $admin->notify($notification);

            event(new NotificationDispatched(
                user: $admin,
                notification: $notification,
                channel: "admin.{$admin->id}"
            ));
        }
    }

    /**
     * Envoyer une notification privée
     */
    private function sendNotification(
        User $user,
        string $notificationType,
        array $data = [],
    ): void {
        $notification = $this->getNotificationInstance($notificationType, $data);

        // Déterminer le type d'utilisateur
        if ($user->hasRole('super_admin')) {
            $notification->userType = self::TYPE_SYSTEM;
        } elseif ($user->tenants()->exists()) {
            $notification->userType = self::TYPE_VENDOR;
            // Utiliser le premier tenant de l'utilisateur
            $notification->tenantId = $user->tenants()->first()->id;
        } else {
            $notification->userType = self::TYPE_CUSTOMER;
        }

        $user->notify($notification);

        // Déterminer le canal approprié
        $channel = $this->getChannelForUser($user, $notification);

        event(new NotificationDispatched(
            user: $user,
            notification: $notification,
            channel: $channel
        ));
    }

    /**
     * Obtenir l'instance de notification
     */
    private function getNotificationInstance(
        string $notificationType,
        array $data = []
    ): Notification {
        $class = "App\\Notifications\\{$notificationType}";

        if (! class_exists($class)) {
            throw new \InvalidArgumentException(
                "Notification class {$class} does not exist"
            );
        }

        return new $class($data);
    }

    /**
     * Déterminer le canal pour l'utilisateur
     */
    private function getChannelForUser(User $user, Notification $notification): string
    {
        if (isset($notification->userType)) {
            return match ($notification->userType) {
                self::TYPE_VENDOR => $this->getTenantChannel($notification),
                self::TYPE_CUSTOMER => "customer.{$user->id}",
                self::TYPE_SYSTEM => "admin.{$user->id}",
                default => "user.{$user->id}",
            };
        }

        return "user.{$user->id}";
    }

    /**
     * Obtenir le canal du tenant
     */
    private function getTenantChannel(Notification $notification): string
    {
        if (isset($notification->tenantId)) {
            return "tenant.{$notification->tenantId}";
        }

        return 'tenant.notifications';
    }

    /**
     * Obtenir les notifications non lues d'un utilisateur
     */
    public function getUnreadNotifications(User $user, int $limit = 10): array
    {
        return $user->unreadNotifications()
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead(User $user, string $notificationId): bool
    {
        $notification = $user->notifications()
            ->whereKey($notificationId)
            ->first();

        if ($notification && is_null($notification->read_at)) {
            $notification->markAsRead();

            return true;
        }

        return false;
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(User $user): void
    {
        $user->unreadNotifications()->update([
            'read_at' => now(),
        ]);
    }

    /**
     * Supprimer une notification
     */
    public function deleteNotification(User $user, string $notificationId): bool
    {
        return (bool) $user->notifications()
            ->whereKey($notificationId)
            ->delete();
    }

    /**
     * Supprimer les anciennes notifications
     */
    public function purgeOldNotifications(int $daysOld = 30): int
    {
        return \DB::table('notifications')
            ->where('created_at', '<', now()->subDays($daysOld))
            ->delete();
    }
}
