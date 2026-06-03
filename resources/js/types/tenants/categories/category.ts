// resources/js/types/posts/category.ts

export interface Category {
    id: number;
    nom: string;
    slug: string;
    parent_id?: number | null;
    color?: string | null;
    description?: string | null;
    metadata?: Record<string, any> | null;
    est_active?: boolean;
    est_visible_dans_menu?: boolean;
    ordre?: number;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;

    // Relations
    parent?: Category;
    enfants?: Category[];
    posts_count?: number;

    // Accesseurs
    url?: string;
    full_path?: string;
    slug_path?: string;
    count_posts?: number;
}