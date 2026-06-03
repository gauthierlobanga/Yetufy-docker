export interface Tenant {
    id: string;
    name: string;
    ai_enabled: boolean;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    youtube_url: string;
    tiktok_url: string;
    raison_sociale: string;
    slug: string;
    description: string | null;
    email: string;
    telephone: string | null;
    statut: string;
    is_active: boolean;
    domain: string | null;
    url: string;
    admin_url: string;
    plan: {
        name: string;
        price: number;
        currency: string;
        features: string[];
    } | null;
    logo_url?: string | null;
    sso_login_url: string;

}

export interface Summary {
    products?: number;
    orders?: number;
    revenue?: number;
    customers?: number;
    abandoned_carts?: number;
    pending_orders?: number;
    average_order_value?: number;
    conversion_rate?: number;
    out_of_stock_products?: number;
    /** Others properties */
    total_products?: number;
    published_products?: number;
    draft_products?: number;
    total_orders?: number;
    completed_orders?: number;
    cancelled_orders?: number;
    total_revenue?: number;
    revenue_change?: number;
    orders_change?: number;
    total_customers?: number;
    customers_change?: number;
    active_carts?: number;
    avg_order_value?: number;
    return_rate?: number;
    inventory_count?: number;
    low_stock_count?: number;
    out_of_stock_count?: number;
    revenue_this_month?: number;
    revenue_this_month_change?: number;
    orders_this_month?: number;
    orders_this_month_change?: number;
    revenue_per_customer?: number;
    products_without_image?: number;
    active_promotions?: number;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    youtube_url?: string;
    tiktok_url?: string;
    [key: string]: any;
}

// Ajoutez ces interfaces à vos types existants

export interface SummaryCardsData {
    total_visitors: number;
    total_sales: number;
    total_customers: number;
    total_products: number;
    visitors_change: number;
    sales_change: number;
    customers_change: number;
    products_change: number;
    sparkline_visitors: { value: number }[];
    sparkline_sales: { value: number }[];
    sparkline_customers: { value: number }[];
    sparkline_products: { value: number }[];
}

export interface StockDataItem {
    name: string;
    quantity: number;
    fill: string;
}

export interface SatisfactionDataItem {
    name: string;
    value: number;
    color: string;
}

export interface FreightDataItem {
    name: string;
    count: number;
    fill: string;
}
