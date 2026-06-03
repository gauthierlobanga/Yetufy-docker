import type { Tenant } from "../products/vendor/tenant";

interface TopPage {
    path: string;
    views: number;
}

interface DeviceStat {
    device: string;
    count: number;
}

interface BrowserStat {
    browser: string;
    count: number;
}

interface DailyStat {
    date: string;
    visits: number;
    uniques: number;
}

export interface VendorVisitorStatsProps {
    total_visits: number;
    unique_visitors: number;
    avg_duration: number;
    bounce_rate: number;
    top_pages: TopPage[];
    devices: DeviceStat[];
    browsers: BrowserStat[];
    daily: DailyStat[];
    tenant: Tenant;
}
