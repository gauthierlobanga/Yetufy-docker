/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Dashboard.tsx
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import type { LucideIcon } from 'lucide-react';
import {
    BarChart3,
    CheckCircle,
    ClipboardList,
    CreditCard,
    Globe,
    Package,
    PenLine,
    Rocket,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Trash2,
    Users,
    ArrowRight,
    ArrowUpRight,
    PlusCircle,
} from 'lucide-react';
import { createElement, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import AIChat from '@/components/AI/AIChat';
import { ChatIA } from '@/components/AI/ChatIA';
import ProductGenerator from '@/components/AI/ProductGenerator';
import Recommendations from '@/components/AI/Recommendations';
import { AIUnlockAnimation } from '@/components/ecommerce/others/AIUnlockAnimation';
import { FloatingChatWidget } from '@/components/ecommerce/others/FloatingChatWidget';
import { TenantControlPanel } from '@/components/ecommerce/others/TenantControlPanel';
import { TrialCountdown } from '@/components/ecommerce/others/TrialCountdown';
import { SiteHeader } from '@/components/site-header';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import getToastStyle from '@/lib/toast-style';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

type QuickActionColor =
    | 'emerald'
    | 'slate'
    | 'blue'
    | 'violet'
    | 'amber'
    | 'rose'
    | 'cyan'
    | 'indigo';

interface QuickActionCardProps {
    href: string;
    icon: LucideIcon;
    label: string;
    description?: string;
    external?: boolean;
    color?: QuickActionColor;
    badge?: string;
    disabled?: boolean;
}

const colorVariants: Record<
    QuickActionColor,
    {
        iconWrapper: string;
        icon: string;
        glow: string;
        border: string;
    }
> = {
    emerald: {
        iconWrapper:
            'bg-emerald-50 group-hover:bg-emerald-100 dark:bg-emerald-950/40 dark:group-hover:bg-emerald-900/40',
        icon: 'text-emerald-600 dark:text-emerald-400',
        glow: 'group-hover:shadow-emerald-500/20',
        border: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-700',
    },
    slate: {
        iconWrapper:
            'bg-slate-100 group-hover:bg-slate-200 dark:bg-slate-800 dark:group-hover:bg-slate-700',
        icon: 'text-slate-600 dark:text-slate-300',
        glow: 'group-hover:shadow-slate-500/10',
        border: 'group-hover:border-slate-300 dark:group-hover:border-slate-600',
    },
    blue: {
        iconWrapper:
            'bg-blue-50 group-hover:bg-blue-100 dark:bg-blue-950/40 dark:group-hover:bg-blue-900/40',
        icon: 'text-blue-600 dark:text-blue-400',
        glow: 'group-hover:shadow-blue-500/20',
        border: 'group-hover:border-blue-300 dark:group-hover:border-blue-700',
    },
    violet: {
        iconWrapper:
            'bg-violet-50 group-hover:bg-violet-100 dark:bg-violet-950/40 dark:group-hover:bg-violet-900/40',
        icon: 'text-violet-600 dark:text-violet-400',
        glow: 'group-hover:shadow-violet-500/20',
        border: 'group-hover:border-violet-300 dark:group-hover:border-violet-700',
    },
    amber: {
        iconWrapper:
            'bg-amber-50 group-hover:bg-amber-100 dark:bg-amber-950/40 dark:group-hover:bg-amber-900/40',
        icon: 'text-amber-600 dark:text-amber-400',
        glow: 'group-hover:shadow-amber-500/20',
        border: 'group-hover:border-amber-300 dark:group-hover:border-amber-700',
    },
    rose: {
        iconWrapper:
            'bg-rose-50 group-hover:bg-rose-100 dark:bg-rose-950/40 dark:group-hover:bg-rose-900/40',
        icon: 'text-rose-600 dark:text-rose-400',
        glow: 'group-hover:shadow-rose-500/20',
        border: 'group-hover:border-rose-300 dark:group-hover:border-rose-700',
    },
    cyan: {
        iconWrapper:
            'bg-cyan-50 group-hover:bg-cyan-100 dark:bg-cyan-950/40 dark:group-hover:bg-cyan-900/40',
        icon: 'text-cyan-600 dark:text-cyan-400',
        glow: 'group-hover:shadow-cyan-500/20',
        border: 'group-hover:border-cyan-300 dark:group-hover:border-cyan-700',
    },
    indigo: {
        iconWrapper:
            'bg-indigo-50 group-hover:bg-indigo-100 dark:bg-indigo-950/40 dark:group-hover:bg-indigo-900/40',
        icon: 'text-indigo-600 dark:text-indigo-400',
        glow: 'group-hover:shadow-indigo-500/20',
        border: 'group-hover:border-indigo-300 dark:group-hover:border-indigo-700',
    },
};

interface Stats {
    categories_count: number;
    products_count: number;
    orders_count: number;
    revenue: number;
    customers_count: number;
    abandoned_carts: number;
    inventory_count: number;
    growth_percent: number;
}

interface Trial {
    start: string;
    end: string;
    remaining_days: number;
}

interface RecentProduct {
    id: string;
    nom: string;
    slug: string;
    prix: number;
    stock: number;
    statut: string;
    image: string;
    edit_url: string;
    delete_url?: string;
}

interface Props {
    tenant: Tenant;
    stats: Stats;
    trial?: Trial;
    recentProducts: RecentProduct[];
    currentPlanFeatures: string[];
    allPlansFeatures: Record<string, string[]>;
}

export default function VendorDashboard({
    tenant,
    stats,
    trial,
    allPlansFeatures,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [aiEnabled, setAiEnabled] = useState(tenant.ai_enabled ?? false);

    // Synchroniser l'état local avec la prop (après reload)
    useEffect(() => {
        setAiEnabled(tenant.ai_enabled ?? false);
    }, [tenant.ai_enabled]);

    // Appliquer les variables CSS du thème personnalisé
    useEffect(() => {
        const root = document.documentElement;
        const theme = (tenant as any).theme;

        if (theme) {
            Object.entries(theme).forEach(([key, value]) => {
                if (key.startsWith('--') && typeof value === 'string') {
                    root.style.setProperty(key, value);
                }
            });
        }
    }, [tenant]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.dashboard-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
            );
            gsap.fromTo(
                '.dashboard-section',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    delay: 0.3,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

    return (
        <SidebarProvider
            className="dark:bg-slate-900"
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div ref={containerRef} className="bg-white dark:bg-slate-950">
                    <Head title={`Gérer ${tenant.raison_sociale}`} />
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        {/* En-tête */}
                        <div className="dashboard-section mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                    {tenant.raison_sociale}
                                </h1>
                                <p className="mt-1 text-slate-500 dark:text-slate-400">
                                    {tenant.description ||
                                        'Bienvenue dans votre espace de gestion'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                        tenant.is_active
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}
                                >
                                    {tenant.is_active
                                        ? 'Boutique active'
                                        : 'Inactive'}
                                </span>
                                {tenant.plan && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        <CreditCard className="h-4 w-4" />
                                        {tenant.plan.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <TrialCountdown trial={trial ?? null} />

                        {aiEnabled && <ChatIA />}

                        {/* ======<<<< Actions rapides premium >>>>==========*/}
                        <section className="dashboard-section my-10">
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        Actions rapides
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Accédez instantanément aux
                                        fonctionnalités essentielles de votre
                                        boutique.
                                    </p>
                                </div>

                                <Badge className="border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <Rocket className="mr-1.5 h-3.5 w-3.5" />
                                    Accès rapide
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                                <QuickActionCard
                                    href={tenant.admin_url}
                                    icon={Rocket}
                                    label="Dashboard"
                                    description="Administration"
                                    external
                                    color="emerald"
                                />

                                <QuickActionCard
                                    href={route('vendor.configure')}
                                    icon={Settings}
                                    label="Paramètres"
                                    description="Configuration"
                                    color="slate"
                                />

                                <QuickActionCard
                                    href={tenant.url}
                                    icon={Globe}
                                    label="Voir le site"
                                    description="Boutique publique"
                                    external
                                    color="blue"
                                />

                                <QuickActionCard
                                    href={route('vendor.payment')}
                                    icon={CreditCard}
                                    label="Abonnement"
                                    description="Plan & facturation"
                                    color="violet"
                                />

                                <QuickActionCard
                                    href={`${tenant.admin_url}/produits/create`}
                                    icon={PenLine}
                                    label="Produit"
                                    description="Ajouter"
                                    external
                                    color="amber"
                                />

                                <QuickActionCard
                                    href={`${tenant.admin_url}/commandes`}
                                    icon={ClipboardList}
                                    label="Commandes"
                                    description={`${stats.orders_count ?? 0} commandes`}
                                    external
                                    color="rose"
                                />

                                <QuickActionCard
                                    href={`${tenant.admin_url}/clients`}
                                    icon={Users}
                                    label="Clients"
                                    description={`${stats.customers_count ?? 0} clients`}
                                    external
                                    color="cyan"
                                />

                                <QuickActionCard
                                    href={`${tenant.admin_url}/statistiques`}
                                    icon={BarChart3}
                                    label="Statistiques"
                                    description="Performance"
                                    external
                                    color="indigo"
                                />
                            </div>
                        </section>

                        {/* ======<<<<     Centre de contrôle   >>>>======== */}
                        <section className="dashboard-section mb-12">
                            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/70 to-transparent" />
                                <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
                                <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-slate-500/10 blur-3xl" />

                                <div className="relative border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                Centre de contrôle
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                Gérez rapidement les paramètres
                                                stratégiques de votre boutique.
                                            </p>
                                        </div>

                                        <Badge className="w-fit border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            <Settings className="mr-1.5 h-3.5 w-3.5" />
                                            Configuration avancée
                                        </Badge>
                                    </div>
                                </div>

                                <div className="relative p-6">
                                    <TenantControlPanel
                                        tenant={{
                                            id: tenant.id,
                                            raison_sociale:
                                                tenant.raison_sociale,
                                            slug: tenant.slug,
                                            produits_count:
                                                stats.products_count ?? 0,
                                            categories_count:
                                                stats.categories_count ?? 0,
                                            ai_enabled: aiEnabled,
                                            plan: tenant.plan ?? null,
                                        }}
                                        onToggleAI={(enabled) => {
                                            router.post(
                                                route('ai.toggle'),
                                                { enabled },
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                    onSuccess: () => {
                                                        router.reload({
                                                            only: ['tenant'],
                                                        });
                                                        toast.success(
                                                            'Paramètre IA mis à jour',
                                                            {
                                                                description:
                                                                    enabled
                                                                        ? 'IA activée'
                                                                        : 'IA désactivée',
                                                                duration: 2500,
                                                                style: getToastStyle(
                                                                    'success',
                                                                ),
                                                            },
                                                        );
                                                    },
                                                },
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Plans disponibles */}
                        <div className="dashboard-section mt-10 mb-12">
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        Plans disponibles
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Comparez les fonctionnalités et
                                        choisissez l’offre la plus adaptée à
                                        votre activité.
                                    </p>
                                </div>

                                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                    Offres évolutives
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                                {Object.entries(allPlansFeatures).map(
                                    ([planName, features], index) => {
                                        const isCurrentPlan =
                                            (
                                                tenant.plan?.name ?? 'gratuit'
                                            ).toLowerCase() ===
                                            planName.toLowerCase();

                                        const isPopular =
                                            planName
                                                .toLowerCase()
                                                .includes('pro') ||
                                            planName
                                                .toLowerCase()
                                                .includes('business');

                                        return (
                                            <motion.div
                                                key={planName}
                                                initial={{ opacity: 0, y: 24 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.06,
                                                }}
                                                className="h-full"
                                            >
                                                <Card
                                                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                                                        isCurrentPlan
                                                            ? 'border-emerald-300 bg-linear-to-br from-emerald-50 via-white to-emerald-50/40 shadow-[0_20px_60px_rgba(16,185,129,0.15)] dark:border-emerald-700/50 dark:from-emerald-950/30 dark:via-slate-950 dark:to-emerald-950/10'
                                                            : 'border-slate-200/80 bg-white/90 shadow-[0_10px_40px_rgba(15,23,42,0.06)] hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-emerald-800/50'
                                                    }`}
                                                >
                                                    <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />

                                                    {isCurrentPlan && (
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <Badge className="rounded-full border border-emerald-200 bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-emerald-500/25 dark:border-emerald-500/30">
                                                                Votre plan
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    {!isCurrentPlan &&
                                                        isPopular && (
                                                            <div className="absolute top-4 right-4 z-10">
                                                                <Badge className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                                                                    ⭐ Populaire
                                                                </Badge>
                                                            </div>
                                                        )}

                                                    <CardHeader className="pb-4">
                                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                            <Sparkles className="h-6 w-6" />
                                                        </div>

                                                        <CardTitle className="text-xl font-bold tracking-tight text-slate-900 capitalize dark:text-white">
                                                            {planName}
                                                        </CardTitle>

                                                        <CardDescription className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                            {features
                                                                .slice(0, 3)
                                                                .join(' • ')}
                                                        </CardDescription>
                                                    </CardHeader>

                                                    <CardContent className="flex-1 pt-0">
                                                        <ul className="space-y-3">
                                                            {features
                                                                .slice(0, 5)
                                                                .map(
                                                                    (
                                                                        feature,
                                                                        i,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="flex items-start gap-3"
                                                                        >
                                                                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                                                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                            </div>

                                                                            <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                                                {
                                                                                    feature
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    ),
                                                                )}

                                                            {features.length >
                                                                5 && (
                                                                <li className="pt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                                                                    +
                                                                    {features.length -
                                                                        5}{' '}
                                                                    autres
                                                                    fonctionnalités
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </CardContent>

                                                    <CardFooter className="pt-2">
                                                        {isCurrentPlan ? (
                                                            <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                                                Plan
                                                                actuellement
                                                                actif
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                asChild
                                                                className="w-full rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/25"
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        'vendor.payment',
                                                                    )}
                                                                >
                                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                                    Choisir ce
                                                                    plan
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        );
                                    },
                                )}
                            </div>
                        </div>

                        {aiEnabled && <FloatingChatWidget />}
                    </div>

                    <AlertDialog
                        open={deleteProductId !== null}
                        onOpenChange={() => setDeleteProductId(null)}
                    >
                        <AlertDialogContent className="sm:max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Supprimer le produit ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Le produit
                                    sera définitivement supprimé.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => {
                                        if (deleteProductId) {
                                            router.delete(
                                                route(
                                                    'tenant.product.delete',
                                                    deleteProductId,
                                                ),
                                                {
                                                    onSuccess: () => {
                                                        toast.success(
                                                            'Produit supprimé',
                                                        );
                                                        setDeleteProductId(
                                                            null,
                                                        );
                                                    },
                                                    onError: () => {
                                                        toast.error(
                                                            'Erreur lors de la suppression',
                                                        );
                                                        setDeleteProductId(
                                                            null,
                                                        );
                                                    },
                                                },
                                            );
                                        }
                                    }}
                                >
                                    Supprimer
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export function QuickActionCard({
    href,
    icon: Icon,
    label,
    description,
    external = false,
    color = 'emerald',
    badge,
    disabled = false,
}: QuickActionCardProps) {
    const styles = colorVariants[color];

    const content = (
        <>
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-current opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10" />

            {badge && (
                <span className="absolute top-3 right-3 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500 uppercase shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    {badge}
                </span>
            )}

            <div
                className={[
                    'relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ring-1 ring-white/50 transition-all duration-300 ring-inset',
                    styles.iconWrapper,
                    styles.glow,
                ].join(' ')}
            >
                <Icon
                    className={[
                        'h-6 w-6 transition-transform duration-300 group-hover:scale-110',
                        styles.icon,
                    ].join(' ')}
                />
            </div>

            <div className="space-y-1 text-center">
                <h3 className="text-sm font-semibold text-slate-800 transition-colors dark:text-slate-100">
                    {label}
                </h3>

                {description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>

            {external && (
                <div className="absolute top-4 left-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
            )}
        </>
    );

    const className = [
        'group relative flex min-h-[170px] flex-col items-center justify-center gap-4 overflow-hidden',
        'rounded-3xl border bg-white/90 p-5 text-center shadow-sm backdrop-blur-xl',
        'transition-all duration-300',
        'dark:bg-slate-900/80 dark:backdrop-blur-xl',
        'border-slate-200/70 dark:border-slate-800',
        'hover:-translate-y-1 hover:shadow-xl',
        styles.border,
        disabled ? 'pointer-events-none opacity-50' : '',
    ].join(' ');

    if (disabled) {
        return <div className={className}>{content}</div>;
    }

    if (external) {
        return (
            <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className={className}
            >
                {content}
            </motion.a>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
        >
            <Link href={href} className={className}>
                {content}
            </Link>
        </motion.div>
    );
}
