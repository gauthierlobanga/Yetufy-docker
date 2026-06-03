// resources/js/components/layout/header/NotificationsDropdown.tsx
import { router, usePage } from '@inertiajs/react';
import { echo } from '@laravel/echo-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bell, BellRing, CheckCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import getToastStyle from '@/lib/toast-style'; // ✅ import corrigé
import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';

// --- Helpers (inchangés) ---
const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);
const stringValue = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim() !== '' ? value : fallback;
const nullableStringValue = (value: unknown): string | null =>
    typeof value === 'string' && value.trim() !== '' ? value : null;

function isUUID(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
    );
}

function normalizeNotification(
    value: unknown,
    fallbackCreatedAt = new Date().toISOString(),
): DashboardNotification | null {
    if (!isRecord(value)) {
        return null;
    }

    const data = isRecord(value.data) ? value.data : {};
    const id =
        value.id ??
        data.id ??
        `realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const title = stringValue(
        value.title,
        stringValue(
            data.title,
            stringValue(
                value.body,
                stringValue(
                    data.body,
                    stringValue(data.message, 'Notification'),
                ),
            ),
        ),
    );
    const message = stringValue(
        value.message,
        stringValue(
            data.message,
            stringValue(value.body, stringValue(data.body)),
        ),
    );
    const createdAt = stringValue(
        value.created_at,
        stringValue(
            data.created_at,
            stringValue(data.occurred_at, fallbackCreatedAt),
        ),
    );

    return {
        id: String(id),
        type: stringValue(value.type, stringValue(data.type, 'system')),
        title,
        message,
        url: nullableStringValue(value.url ?? data.url),
        read_at: nullableStringValue(value.read_at ?? data.read_at),
        created_at: createdAt,
        data: { ...data, ...value },
    };
}

function formatNotificationDate(value: string | null): string {
    if (!value) {
        return 'À l’instant';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'À l’instant';
    }

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
}

export function NotificationsDropdown() {
    const {
        auth,
        tenant,
        notifications: serverNotifications = [],
    } = usePage().props as any;

    const user = auth?.user;
    const tenantId = tenant?.id ? String(tenant.id) : null;

    const [notifOpen, setNotifOpen] = useState(false);
    const [realtimeNotifications, setRealtimeNotifications] = useState<
        DashboardNotification[]
    >([]);
    const [localReadAt, setLocalReadAt] = useState<Record<string, string>>({});

    // Écoute des activités wishlist du tenant (canal public)
    useEffect(() => {
        if (!tenantId || typeof window === 'undefined') {
            return;
        }

        const echoInstance = window.Echo ?? echo();
        const channel = echoInstance.channel(`tenant.${tenantId}`);
        const handleWishlistActivity = (payload: any) => {
            const notification: DashboardNotification = {
                id: `wishlist-${Date.now()}`,
                title: payload.title,
                message: payload.message || '',
                type: 'wishlist',
                url: null,
                read_at: null,
                created_at: new Date().toISOString(),
                data: payload,
            };
            setRealtimeNotifications((prev) =>
                [notification, ...prev].slice(0, 50),
            );
            toast(notification.title, {
                description: notification.message || undefined,
            });
        };
        channel.listen('.wishlist.activity', handleWishlistActivity);

        return () => {
            channel.stopListening('.wishlist.activity');
            echoInstance.leave(`tenant.${tenantId}`);
        };
    }, [tenantId]);

    // Écoute des notifications personnelles (rappel wishlist, etc.) sur le canal privé standard
    useEffect(() => {
        if (!user?.id || typeof window === 'undefined') {
            return;
        }

        const echoInstance = window.Echo ?? echo();
        const privateChannel = echoInstance.private(
            `App.Models.User.${user.id}`,
        );
        privateChannel.notification((payload: unknown) => {
            const notification = normalizeNotification(payload);

            if (!notification) {
                return;
            }

            const realtime = {
                ...notification,
                read_at: null,
                isRealtime: true,
            };
            setRealtimeNotifications((prev) =>
                [realtime, ...prev.filter((n) => n.id !== realtime.id)].slice(
                    0,
                    50,
                ),
            );
            const toastTitle = realtime.title || 'Notification';
            const toastMessage = realtime.message || undefined;

            try {
                toast(toastTitle, {
                    description: toastMessage,
                    style: getToastStyle(),
                });
            } catch (error) {
                console.error('Toast échoué', error);
            }
        });

        return () => {
            echoInstance.leave(`App.Models.User.${user.id}`);
        };
    }, [user?.id]);

    // ─── 3. Fusion des notifications serveur + temps réel (inchangé) ───
    const allNotifications = useMemo(() => {
        const server = Array.isArray(serverNotifications)
            ? serverNotifications
                  .map((n: unknown) => normalizeNotification(n))
                  .filter(
                      (
                          n: DashboardNotification | null,
                      ): n is DashboardNotification => n !== null,
                  )
            : [];

        const existingIds = new Set(server.map((n) => n.id));
        const realtimeOnly = realtimeNotifications.filter(
            (n) => !existingIds.has(n.id),
        );

        return [...realtimeOnly, ...server].map((n) => ({
            ...n,
            read_at: localReadAt[n.id] ?? n.read_at,
        }));
    }, [serverNotifications, realtimeNotifications, localReadAt]);

    const unreadCount = allNotifications.filter((n) => !n.read_at).length;

    const markAsRead = (id: string) => {
        const readAt = new Date().toISOString();
        // Marquer localement
        setLocalReadAt((prev) => ({ ...prev, [id]: readAt }));
        setRealtimeNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read_at: readAt } : n)),
        );

        // N'appeler le serveur que pour les vrais UUID (notifications persistées)
        if (isUUID(id)) {
            router.post(
                route('tenant.notifications.mark-as-read', { id }),
                {},
                { preserveScroll: true, preserveState: true },
            );
        }
    };

    const markAllAsRead = () => {
        const readAt = new Date().toISOString();
        setLocalReadAt((prev) => ({
            ...prev,
            ...Object.fromEntries(allNotifications.map((n) => [n.id, readAt])),
        }));
        setRealtimeNotifications((prev) =>
            prev.map((n) => ({ ...n, read_at: readAt })),
        );

        // Appel serveur uniquement pour les UUID
        const uuids = allNotifications
            .filter((n) => isUUID(n.id))
            .map((n) => n.id);

        if (uuids.length > 0) {
            router.post(
                route('tenant.notifications.mark-all-as-read'),
                { ids: uuids },
                { preserveScroll: true, preserveState: true },
            );
        }
    };

    // Rendu du bouton et du popover (inchangé)
    return (
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 cursor-pointer text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Notifications"
                >
                    {unreadCount > 0 ? (
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, -5, 5, -5, 0],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 5,
                            }}
                            className="relative"
                        >
                            <BellRing className="h-7 w-7 text-amber-500" />
                        </motion.div>
                    ) : (
                        <Bell className="h-7 w-7" />
                    )}
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 15,
                            }}
                            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={12}
                className="w-96 overflow-hidden rounded-2xl border-0 bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95 dark:shadow-slate-950/50"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {unreadCount} non lue
                                {unreadCount > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                        >
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>

                <div className="max-h-88 divide-y divide-slate-50 overflow-y-auto overscroll-contain dark:divide-slate-800">
                    {allNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                            <Bell className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Aucune notification
                            </p>
                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                Vous êtes à jour !
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {allNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`relative cursor-pointer px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                        !notification.read_at
                                            ? 'border-l-2 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        if (notification.url) {
                                            router.visit(notification.url);
                                        }
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 shrink-0">
                                            {notification.type === 'success' ||
                                            notification.type === 'payment' ? (
                                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                                            ) : notification.type === 'error' ||
                                              notification.type ===
                                                  'warning' ? (
                                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                            ) : (
                                                <Bell className="h-5 w-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {notification.title}
                                                </p>
                                                {!notification.read_at && (
                                                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                                )}
                                            </div>
                                            {notification.message && (
                                                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {notification.message}
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center justify-between gap-2">
                                                <span className="text-[10px] text-slate-400">
                                                    {formatNotificationDate(
                                                        notification.created_at,
                                                    )}
                                                </span>
                                                {!notification.read_at && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(
                                                                notification.id,
                                                            );
                                                        }}
                                                        className="text-[10px] font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                                    >
                                                        Marquer lu
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {allNotifications.length > 0 && (
                    <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-center text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            onClick={() => setNotifOpen(false)}
                        >
                            Fermer
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
