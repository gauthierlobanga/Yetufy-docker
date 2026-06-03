// resources/js/types/posts/post-form.ts

import type { Category } from './category';

export interface PostFormData {
    // Informations de base
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;

    // Relations
    category_id?: number | null;
    categories?: number[];
    tags?: number[];

    // Statut et publication
    status: 'draft' | 'published' | 'scheduled' | 'expired' | 'archived';
    is_pinned: boolean;
    published_at?: string | null;
    scheduled_for?: string | null;
    expires_at?: string | null;

    // Médias (Spatie)
    featured_image?: File | string | null;
    featured_image_url?: string | null;
    gallery?: string[] | null;
    attachments?: File[] | string[] | null;

    // SEO
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;

    // Métadonnées additionnelles
    metadata?: Record<string, any> | null;

    // Pour les mises à jour
    _method?: 'put' | 'post';
}

export interface MediaUploadResponse {
    id: number;
    url: string;
    thumb_url?: string;
    name: string;
    size: number;
    collection_name: string;
}

export interface PostFormProps {
    post?: {
        id?: number;
        title?: string;
        slug?: string;
        content?: string | Record<string, any> | null;
        excerpt?: string | Record<string, any> | null;
        status?: string;
        is_pinned?: boolean;
        published_at?: string | null;
        scheduled_for?: string | null;
        expires_at?: string | null;
        meta_title?: string | null;
        meta_description?: string | null;
        meta_keywords?: string | null;
        metadata?: Record<string, any> | null;
        featured_image_url?: string | null;
        category_id?: number | null;
        categories?: Array<{ id: number }>;
        tags?: Array<{ id: number; name?: string }>;
        gallery_images?: Array<{ url: string }>;
    };
    categories: Category[];
    tags?: Array<{ id: number; name?: string }>;
    statuses: Record<string, string>;
    onSubmit?: (data: PostFormData) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
}
