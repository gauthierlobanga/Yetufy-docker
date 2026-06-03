import type { Key } from 'react';

export interface HeaderCategory {
    id: number;
    nom: string;
    slug: string;
    url: string;
    image: string | null;
}
// resources/js/types/ecommerce/products/index.ts
export interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
}

export interface PromoData {
    [key: string]: unknown;

    title: string;
    description: string;
    end_date: string;
    image: string | null;
    discount_percentage?: number | null;
    coupons?: Coupon[];
    featuredProducts?: Product[];
}

// Interface pour une variante de produit
export interface ProductVariant {
    id: number;
    nom: string;
    valeur: string;
    supplement_prix: number;
    stock: number;
    prix_actuel: number;
}

// Interface pour un avis client
export interface ProductReview {
    id: Key | null | undefined;
    utile: number;
    note: number;
    commentaire: string;
    client: string;
    date: string;
}

// Interface principale Product
export interface Product {
    [x: string]: any;
    id: number;
    nom: string;
    slug: string;
    prix_actuel: number;
    prix_ttc: number;
    est_en_promotion: boolean;
    reduction_pourcentage: number | null;
    image_principale: string | null;
    image_thumb: string | null;
    note_moyenne: number;
    nombre_avis: number;
    badge: string | null;
    url: string;
    sold_count?: number;
    discount_label?: string;

    // Champs additionnels pour la page détail
    description?: string;
    short_description?: string;
    images?: Array<{
        id?: number;
        medium: string;
        large: string;
        thumb?: string;
        alt: string;
    }>;
    brand?: { nom: string; slug: string } | null;
    categories?: Array<{ nom: string; slug: string }>;
    variantes?: ProductVariant[];
    avis?: ProductReview[];
    stock_disponible?: number;
    //
    seller_name?: string; // Nom du vendeur
    orders_this_week?: number; // Commandes cette semaine
    old_price?: number; // Prix barré (si différent de prix_ttc)
}

// Type des props de page complet
export interface PageProps {
    [key: string]: any;
    platformStats?: PlatformStats;
    featuredProducts: PaginatedProducts | Product[];
    cart?: Cart | null;
    trendingProducts: Product[];
    categories: Category[];
    productsByCategory: Record<
        string,
        { category: Category; products: Product[] }
    >;
    promo: PromoData | null;
    bestSellers: Product[];
    dealOfTheDay: Product[];
    brands: Brand[];
    address: Address[];
}

export interface Category {
    // [x: string]: number;
    id: number;
    nom: string;
    slug: string;
    description?: string;
    image: string | null;
    icon?: string | null;
    url: string;
    children: Category[];
}

export interface Brand {
    id: number;
    nom: string;
    slug: string;
    logo: string | null;
    url: string;
}

export interface Coupon {
    code: string;
    discount: number;
    min_amount?: number;
}

export interface Cart {
    id: number;
    nb_articles: number;
    sous_total: number;
    total_taxes: number;
    total_livraison: number;
    total_remises: number;
    total_general: number;
    items: CartItem[];
    promotions: Array<{ code: string; montant: number }>;
}

export interface CartItem {
    id: number;
    produit: {
        id: number;
        nom: string;
        slug: string;
        image: string | null;
        brand?: { nom: string } | null;
        sold_count?: number;
    };
    quantite: number;
    prix_unitaire: number;
    prix_total: number;
    options?: {
        min_quantity?: number;
    };
}

export interface CalculatedTotals {
    sous_total: number;
    total_taxes: number;
    total_livraison: number;
    total_remises: number;
    total_general: number;
    selected_count: number;
}

export interface PlatformStats {
    pageLoadTime?: string;
    uptime?: string;
    supportResponseTime?: string;
    productsCount?: number;
    ordersProcessed?: number;
    paymentMethods?: number;
    countriesServed?: number;
}

export interface Address {
    id: number;
    rue: string;
    complement?: string | null;
    code_postal: string;
    ville: string;
    pays: string;
    region?: string | null;
    telephone?: string | null;
    instructions?: string | null;
    est_defaut: boolean;
    type: 'facturation' | 'livraison';
    adresse_complete?: string; // calculé côté backend
    adresse_une_ligne?: string;
}
