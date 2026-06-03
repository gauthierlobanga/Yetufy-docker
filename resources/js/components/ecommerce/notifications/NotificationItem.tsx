// resources/js/components/ecommerce/notifications/NotificationItem.tsx

import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, CreditCard, Bell, MessageCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/ecommerce/notifications/notification';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number | string) => void;
}

const notificationIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    order: Package,
    payment: CreditCard,
    message: MessageCircle,
    review: Star,
    default: Bell,
};

export function NotificationItem({
    notification,
    onMarkAsRead,
}: NotificationItemProps) {
    const Icon =
        notificationIcons[notification.type] || notificationIcons.default;

    const handleClick = () => {
        if (!notification.read_at) {
            onMarkAsRead(notification.id);
        }
    };

    return (
        <Link
            href={notification.data?.url || '#'}
            onClick={handleClick}
            className={cn(
                'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent',
                !notification.read_at && 'bg-primary/5',
            )}
        >
            <div
                className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    !notification.read_at ? 'bg-primary/10' : 'bg-muted',
                )}
            >
                <Icon
                    className={cn(
                        'h-4 w-4',
                        !notification.read_at
                            ? 'text-primary'
                            : 'text-muted-foreground',
                    )}
                />
            </div>

            <div className="flex-1 space-y-1">
                <p
                    className={cn(
                        'text-sm',
                        !notification.read_at && 'font-medium',
                    )}
                >
                    {notification.data?.message}
                </p>
                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: fr,
                    })}
                </p>
            </div>

            {!notification.read_at && (
                <div className="h-2 w-2 rounded-full bg-primary" />
            )}
        </Link>
    );
}
