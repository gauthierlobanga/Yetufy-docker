
/**
 *
 */
// resources/js/types/posts/posts.ts

export interface PostsResponse {
    data: Post[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    links: {
        first: string | null;
        last: string | null;
        next: string | null;
        prev: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface PostFilters {
    search?: string;
    status?: string;
    category_id?: number;
    tag_id?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
}

export interface Category {
    id: number;
    nom: string;
    slug: string;
    parent_id?: number | null;
    color?: string | null;
    description?: string | null;
}

export interface Media {
    id: number;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    url?: string;
    thumb_url?: string;
    medium_url?: string;
    large_url?: string;
}

export interface GalleryImage {
    id: number;
    url: string;
    thumb: string;
    medium: string;
    large: string;
    name: string;
    size: number;
}

// Ajoutez cette interface pour les tags
export interface Tag {
    id: number;
    name?: string;
    slug: string;
    order_column?: number;
}

// Interface pour les tags simplifiés (pour le formulaire)
export interface SimpleTag {
    id: number;
    name?: string;
}


export interface Post {
    is_liked: boolean;
    is_bookmarked: boolean;
    bookmarks_count: number;
    id: number;
    user_id: number;
    title: string;
    slug: string;
    excerpt: string | Record<string, any> | null;
    content: string | Record<string, any> | null;
    featured_image: string | null;
    status: 'draft' | 'published' | 'scheduled' | 'expired' | 'archived';
    is_pinned: boolean;
    views_count: number;
    likes_count: number;
    comments_count: number;
    reading_time_minutes: number | null;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    metadata?: Record<string, any> | null;
    published_at: string | null;
    scheduled_for: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    user?: {
        id: number;
        name: string;
        email: string;
        avatar_url?: string;
    };

    categories?: Array<{
        id: number;
        nom: string;
        slug: string;
        color: string | null;
        pivot?: {
            is_primary: boolean;
            order: number;
        };
    }>;

    media?: Array<{
        id: number;
        collection_name: string;
        name: string;
        file_name: string;
        mime_type: string;
        size: number;
        url?: string;
        thumb_url?: string;
    }>;

    tags?: Array<{
        id: number;
        name: string;
        slug: string;
        order_column: number;
    }>;

    // Accesseurs
    url?: string;
    status_label?: string;
    status_color?: string;
    is_published?: boolean;
    featured_image_url?: string | null;
    featured_image_thumb?: string | null;
    featured_image_card?: string | null;
    featured_image_detail?: string | null;
    gallery_images?: GalleryImage[];
}

export interface RelatedPost extends Omit<Post, 'excerpt'> {
    excerpt?: string | null;
    featured_image_thumb?: string | null;
    featured_image_card?: string | null;
}

export interface ProcessedPost extends Post {
    cleanExcerpt: string;
    formattedDate: string;
    readingTime: number;
}
