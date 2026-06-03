import type Echo from 'laravel-echo';
import type { Auth } from '@/types/auth';
import type { DashboardNotification } from './ecommerce/notifications/notification';
// Types pour les données flash
interface FlashData {
    message?: string;
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    new_post_id?: number;
    [key: string]: unknown;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            flash?: FlashData;
            errors?: Record<string, string>;
            [key: string]: unknown;
        };
    }
}

// Pour étendre le type PageProps dans les composants React
declare module '@inertiajs/react' {
    export interface PageProps extends Record<string, unknown> {
        name: string;
        auth: Auth;
        sidebarOpen: boolean;
        flash?: FlashData;
        errors?: Record<string, string>;
        headerData?: HeaderData;
        notifications: DashboardNotification[];
        unreadNotificationsCount: number;
    }
}

export interface HeaderCategory {
    id: number;
    nom: string;
    slug: string;
    url: string;
    image: string | null;
}

export interface HeaderData {
    categories: HeaderCategory[];
    brands: { id: number; name: string; slug: string }[];
}

declare global {
    interface Window {
        Echo?: Echo;
    }
}
