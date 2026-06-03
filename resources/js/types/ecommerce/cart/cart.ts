// resources/js/types/cart.ts

export interface CartItemOption {
    name: string;
    value: string;
}

export interface CartItem {
    id: number;
    product_id: number;
    variant_id?: number;
    name: string;
    slug?: string;
    sku?: string;
    price: number;
    original_price?: number;
    quantity: number;
    max_quantity?: number;
    image?: string;
    options?: Record<string, string>;
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    metadata?: Record<string, any>;
}

export interface CartSummary {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    items_count: number;
    items_quantity: number;
}

export interface Cart {
    items: CartItem[];
    summary: CartSummary;
    coupon?: {
        code: string;
        discount: number;
        type: 'fixed' | 'percentage';
    };
}
