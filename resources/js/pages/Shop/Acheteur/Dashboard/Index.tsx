/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Heart,
    ShoppingBag,
    Sparkles,
    Package,
    MapPin,
    RotateCcw,
    Gift,
    TrendingUp,
    Clock,
    ChevronRight,
} from 'lucide-react';
import ShopAccountShell from '@/components/ecommerce/ShopAccountShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import tenant from '@/routes/tenant';

interface OrderItem {
    id: string;
    numero_commande: string;
    statut: string;
    total: number | string;
    created_at: string;
    lignes_count: number;
}

interface Props extends Record<string, unknown> {
    stats: {
        orders_count: number;
        completed_orders: number;
        addresses_count: number;
        wishlist_items_count: number;
        pending_returns_count: number;
        loyalty_points: number;
        loyalty_level: string;
    };
    recentOrders: OrderItem[];
    wishlist?: {
        nom?: string;
        items_count?: number;
    } | null;
    loyalty?: {
        points?: number;
        niveau_libelle?: string;
    } | null;
}

// Palette émeraude / ardoise moderne
const statCardConfig = [
    {
        key: 'orders',
        label: 'Commandes',
        value: (stats: any) => stats.orders_count,
        helper: (stats: any) => `${stats.completed_orders} terminées`,
        icon: Package,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
        key: 'wishlist',
        label: 'Liste de souhaits',
        value: (stats: any) => stats.wishlist_items_count,
        helper: (stats: any, wishlist: any) => wishlist?.nom ?? 'Ma liste',
        icon: Heart,
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/30',
    },
    {
        key: 'loyalty',
        label: 'Points fidélité',
        value: (stats: any) => stats.loyalty_points,
        helper: (stats: any, wishlist: any, loyalty: any) =>
            loyalty?.niveau_libelle ?? stats.loyalty_level,
        icon: Gift,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
        key: 'returns',
        label: 'Retours',
        value: (stats: any) => stats.pending_returns_count,
        helper: (stats: any) => `${stats.addresses_count} adresse(s)`,
        icon: RotateCcw,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
];

// Composant StatCard individuelle
function StatCard({
    config,
    stats,
    wishlist,
    loyalty,
}: {
    config: any;
    stats: any;
    wishlist: any;
    loyalty: any;
}) {
    const Icon = config.icon;

    return (
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:shadow-emerald-500/5 dark:border-slate-800/60 dark:bg-slate-900/70">
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}
            >
                <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {config.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {config.value(stats)}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    {config.helper(stats, wishlist, loyalty)}
                </p>
            </div>
        </div>
    );
}

// Composant de barre de progression de fidélité
function LoyaltyLevel({
    points,
    level,
    maxPoints = 500,
}: {
    points: number;
    level: string;
    maxPoints?: number;
}) {
    const percentage = Math.min((points / maxPoints) * 100, 100);

    return (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
            <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
                    <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Niveau de fidélité
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {level}
                    </p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{points} points</span>
                    <span>{maxPoints} points</span>
                </div>
                <Progress
                    value={percentage}
                    className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-linear-to-r [&>div]:from-amber-400 [&>div]:to-amber-600"
                />
            </div>
        </div>
    );
}

// Statut coloré
const statusVariant: Record<string, string> = {
    en_attente:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    confirmee:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    en_preparation:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    expédiée:
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    livree: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    annulee: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    remboursee:
        'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400',
};

function getStatusBadge(statut: string) {
    const className =
        statusVariant[statut] ||
        'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400';

    return (
        <Badge
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${className}`}
        >
            {statut.replace('_', ' ')}
        </Badge>
    );
}

export default function CustomerDashboard() {
    const { stats, recentOrders, wishlist, loyalty } = usePage<Props>().props;

    // Détermine un niveau max de points pour la barre (personnalisable)
    const maxLoyaltyPoints = 500; // peut venir de la config plus tard

    return (
        <ShopAccountShell
            headTitle="Mon compte"
            title="Tableau de bord"
            description="Gérez vos commandes, vos favoris et votre fidélité en un clin d’œil."
            active="dashboard"
        >
            {/* Grille de statistiques */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCardConfig.map((cfg) => (
                    <StatCard
                        key={cfg.key}
                        config={cfg}
                        stats={stats}
                        wishlist={wishlist}
                        loyalty={loyalty}
                    />
                ))}
            </div>

            {/* Section principale : commandes récentes + fidélité */}
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                {/* Commandes récentes */}
                <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                <Clock className="h-5 w-5 text-emerald-500" />
                                Commandes récentes
                            </CardTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Suivez l’avancement de vos dernières commandes.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            asChild
                        >
                            <Link href={tenant.orders.index().url}>
                                Tout voir{' '}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={tenant.orders.show(order.id).url}
                                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:bg-slate-50 hover:shadow-sm hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                            <Package className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                                                {order.numero_commande}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {order.lignes_count} article(s)
                                                ·{' '}
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(order.statut)}
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {typeof order.total === 'number'
                                                ? order.total.toFixed(2)
                                                : order.total}{' '}
                                            €
                                        </span>
                                        <ChevronRight className="hidden h-4 w-4 text-slate-300 transition-colors group-hover:text-emerald-500 sm:block" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                Aucune commande récente pour le moment.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Raccourcis & fidélité */}
                <div className="space-y-6">
                    <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                Accès rapides
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Link
                                href={tenant.wishlist.index().url}
                                className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:border-rose-200 hover:bg-rose-50 dark:border-slate-800 dark:hover:border-rose-800 dark:hover:bg-rose-950/20"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/30">
                                    <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 transition-colors group-hover:text-rose-700 dark:text-slate-300 dark:group-hover:text-rose-400">
                                    Mes favoris
                                </span>
                            </Link>
                            <Link
                                href={tenant.loyalty.index().url}
                                className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:border-amber-200 hover:bg-amber-50 dark:border-slate-800 dark:hover:border-amber-800 dark:hover:bg-amber-950/20"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                                    <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 transition-colors group-hover:text-amber-700 dark:text-slate-300 dark:group-hover:text-amber-400">
                                    Points fidélité
                                </span>
                            </Link>
                            <Link
                                href={tenant.orders.index().url}
                                className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50 dark:border-slate-800 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                                    <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 transition-colors group-hover:text-emerald-700 dark:text-slate-300 dark:group-hover:text-emerald-400">
                                    Commandes
                                </span>
                            </Link>
                        </CardContent>
                    </Card>

                    <LoyaltyLevel
                        points={loyalty?.points ?? stats.loyalty_points}
                        level={loyalty?.niveau_libelle ?? stats.loyalty_level}
                        maxPoints={maxLoyaltyPoints}
                    />
                </div>
            </div>
        </ShopAccountShell>
    );
}
