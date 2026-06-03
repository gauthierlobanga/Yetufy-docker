/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/dashboard.tsx
import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/board/AreaChartInteractive';
import { ChartBarMixed } from '@/components/board/BarChartMixed';
import { ChartCategoryPerformance } from '@/components/board/chart-category-performance';
import { ChartHourlyPosts } from '@/components/board/chart-hourly-posts';
import { ChartMonthlyPosts } from '@/components/board/chart-monthly-posts';
import { ChartScheduledPosts } from '@/components/board/chart-scheduled-posts';
import { ChartTopAuthors } from '@/components/board/chart-top-authors';
import { ChartTopTags } from '@/components/board/chart-top-tags';
import { ChartWeeklyActivity } from '@/components/board/chart-weekly-activity';
import { ChartBarLabel } from '@/components/board/ChartBarLabelPost';
import { DashboardFilters } from '@/components/board/dashboard-filters';
import { ChartPieInteractive } from '@/components/board/PieChartInteractivePost';
import { DataTable } from '@/components/data-table-post';
import { SectionCards } from '@/components/section-cards-post';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface DashboardProps {
    posts: {
        data: any[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        per_page: number;
    };
    stats: {
        total_posts: number;
        published_posts: number;
        draft_posts: number;
        scheduled_posts: number;
        archived_posts: number;
        total_views: number;
        total_likes: number;
        total_comments: number;
        views_change: number;
        likes_change: number;
        posts_change: number;
        old_drafts_count: number;
        avg_engagement: number;
        max_engagement: number;
        posts_this_month: number;
        posts_this_month_change: number;
        active_authors: number;
        active_authors_change: number;
        conversion_rate: number; // Nouveau
        days_since_last_post: number | null; // Nouveau
        views_trend: number; // Nouveau
    };
    chartStats: Array<{
        date: string;
        views: number;
        likes: number;
        comments: number;
    }>;
    categoriesStats: Array<{
        id: number;
        nom: string;
        slug: string;
        color: string | null;
        posts_count: number;
    }>;
    postsStatusStats: Array<{
        status: string;
        status_label: string;
        count: number;
        fill: string;
    }>;
    topPosts: Array<{
        id: number;
        title: string;
        slug: string;
        views_count: number;
        likes_count: number;
        comments_count: number;
        user: {
            id: number;
            name: string;
            email: string;
            avatar_url: string | null;
        };
        published_at: string | null;
    }>;
    topAuthors: Array<{
        id: number;
        name: string;
        avatar_url: string | null;
        posts_count: number;
        total_views: number;
    }>;
    engagementStats: {
        avg_engagement: number;
        max_engagement: number;
    };
    scheduledPosts: Array<{
        id: number;
        title: string;
        slug: string;
        scheduled_for: string;
    }>;
    weeklyActivity: Array<{
        day: string;
        count: number;
    }>;
    monthlyPostsStats: Array<{
        month_name: string;
        count: number;
    }>;
    hourlyPostsStats: Array<{
        hour: number;
        count: number;
    }>;
    categoryPerformance: Array<{
        id: number;
        nom: string;
        slug: string;
        posts_count: number;
        total_views: number;
        total_likes: number;
        total_comments: number;
    }>;
    topTags: Array<{
        id: number;
        name: string;
        slug: string;
        posts_count: number;
    }>;
    filters?: {
        search?: string;
        status?: string;
        period?: string;
        start_date?: string;
        end_date?: string;
        year?: string;
        month?: string;
    };
    is_super_admin: boolean;
}

export default function Dashboard({
    posts,
    stats,
    chartStats,
    categoriesStats,
    postsStatusStats,
    topPosts,
    topAuthors,
    engagementStats,
    scheduledPosts,
    weeklyActivity,
    monthlyPostsStats,
    hourlyPostsStats,
    categoryPerformance,
    topTags,
    filters = {},
    is_super_admin,
}: DashboardProps) {
    if (!posts || !stats) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">
                        Chargement du tableau de bord...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                {/* Hero Section moderne */}
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-4">
                        {/* Filtres globaux */}
                        <div className="py-4 lg:py-6">
                            <DashboardFilters currentFilters={filters} />
                        </div>

                        <SectionCards />

                        {/* Tableau des articles */}
                        {/* <div className="px-4 lg:px-6">
                            <ChartAreaInteractive chartData={chartStats} />
                        </div> */}

                        {/* Ligne 1: Graphiques principaux */}
                        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                            <ChartBarMixed categoriesData={categoriesStats} />
                            <ChartCategoryPerformance
                                data={categoryPerformance}
                            />
                        </div>

                        {/* Ligne 2: Répartition et performance */}
                        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                            <ChartTopAuthors authors={topAuthors} />
                            <ChartBarLabel topPosts={topPosts} />
                        </div>

                        {/* Ligne 3: Auteurs et activité */}
                        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                            <ChartPieInteractive
                                postsStats={postsStatusStats}
                            />
                            <ChartWeeklyActivity data={weeklyActivity} />
                        </div>

                        {/* Ligne 4: Tendances temporelles */}
                        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                            <ChartMonthlyPosts data={monthlyPostsStats} />
                            <ChartHourlyPosts data={hourlyPostsStats} />
                        </div>

                        {/* Ligne 5: Catégories et tags */}
                        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                            <ChartTopTags topTags={topTags} />
                            <ChartScheduledPosts posts={scheduledPosts} />
                        </div>

                        {/* Tableau des articles */}
                        <div className="px-4 lg:px-6">
                            <DataTable posts={posts} filters={filters} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
    ],
};
