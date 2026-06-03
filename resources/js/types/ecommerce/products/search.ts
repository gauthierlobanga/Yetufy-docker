// resources/js/types/search.ts
export interface SearchResult {
    id: string | number;
    title: string;
    subtitle?: string;
    image?: string | null;
    url?: string;
    price?: string;
}
