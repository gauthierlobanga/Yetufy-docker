import type { Tenant } from "@/types/tenants/products/vendor/tenant";

interface TopTenant {
    raison_sociale: string;
    visits: number;
    uniques: number;
}

interface DailyStat {
    date: string;
    visits: number;
    uniques: number;
}

export interface AdminVisitorStatsProps {
    total_visits_central: number;
    unique_visitors_central: number;
    total_visits_tenants: number;
    unique_visitors_tenants: number;
    top_tenants: TopTenant[];
    daily_central: DailyStat[];
    tenant: Tenant
}
