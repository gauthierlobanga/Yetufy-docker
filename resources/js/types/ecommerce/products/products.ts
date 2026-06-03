export interface PlatformStats {
    // Métriques
    pageLoadTime?: string;
    uptime?: string;
    supportResponseTime?: string;

    // Statistiques
    productsCount?: number;
    ordersProcessed?: number;
    paymentMethods?: number;
    countriesServed?: number;

    // Contenu dynamique (éditable via Spatie Settings)
    testimonials?: Array<{
        name: string;
        role?: string;
        quote: string;
    }>;

    values?: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;

    faqs?: Array<{
        question: string;
        answer: string;
    }>;
}


export interface RecentProduct {
    id: string;
    nom: string;
    slug: string;
    prix: number;
    stock: number;
    statut: string;
    image: string;
    edit_url: string;
}
