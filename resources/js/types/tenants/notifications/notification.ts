// resources/js/types/notification.ts

export interface NotificationData {
    message: string;
    url?: string;
    type?: 'order' | 'payment' | 'message' | 'review' | 'system';
    [key: string]: any;
}

export interface Notification {
    id: number | string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at?: string;
}
