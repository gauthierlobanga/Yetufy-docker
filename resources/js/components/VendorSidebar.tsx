/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    ChevronDown,
    Tag,
    Warehouse,
    Users,
    Rocket,
    Sparkles,
    BookOpen,
    ShoppingBag,
    Crown,
    Eye,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

export function VendorSidebar({ tenant }: { tenant: Tenant }) {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const navigation = [
        {
            title: 'Accueil',
            icon: LayoutDashboard,
            href: route('vendor.dashboard'),
        },
        {
            title: 'Produits',
            icon: Package,
            children: [
                {
                    title: 'Tous les produits',
                    href: route('dashboard.products.index'),
                },
                {
                    title: 'Catégories',
                    href: `${tenant.admin_url}/products/product-categories`,
                },
                {
                    title: 'Promotions',
                    href: `${tenant.admin_url}/promotions/promotions`,
                },
                {
                    title: 'Fournisseurs',
                    href: `${tenant.admin_url}/fournisseurs`,
                },
                {
                    title: 'Variantes',
                    href: `${tenant.admin_url}/products/variante-produits`,
                },
                {
                    title: 'Marques',
                    href: `${tenant.admin_url}/products/brands`,
                },
            ],
        },
        {
            title: 'Commandes',
            icon: ShoppingCart,
            children: [
                {
                    title: 'Commandes clients',
                    href: `${tenant.admin_url}/commandes/commandes`,
                },
                {
                    title: 'Lignes de commande',
                    href: `${tenant.admin_url}/ligne-commandes`,
                },
                {
                    title: 'Commandes achat',
                    href: `${tenant.admin_url}/commandes-achat`,
                },
                {
                    title: 'Retours',
                    href: `${tenant.admin_url}/commandes/retours`,
                },
                {
                    title: 'Paniers',
                    href: `${tenant.admin_url}/paniers/paniers`,
                },
            ],
        },
        {
            title: 'Marketing',
            icon: Tag,
            children: [
                {
                    title: 'Promotions',
                    href: `${tenant.admin_url}/promotions/promotions`,
                },
                {
                    title: 'Coupons',
                    href: `${tenant.admin_url}/inventor/coupons`,
                },
                {
                    title: 'Wishlist',
                    href: `${tenant.admin_url}/wishlists/wishlists`,
                },
            ],
        },
        {
            title: 'Inventaire',
            icon: Warehouse,
            children: [
                {
                    title: 'Stock',
                    href: `${tenant.admin_url}/inventor/mouvement-stocks`,
                },
                {
                    title: 'Inventaires',
                    href: `${tenant.admin_url}/inventor/inventaires`,
                },
                {
                    title: 'Entrepôts',
                    href: `${tenant.admin_url}/inventor/entrepots`,
                },
            ],
        },
        {
            title: 'Clients',
            icon: Users,
            children: [
                { title: 'Clients', href: `${tenant.admin_url}/clients` },
                { title: 'Adresses', href: `${tenant.admin_url}/adresses` },
            ],
        },
        {
            title: 'Analytique',
            icon: BarChart3,
            href: route('vendor.statistics'),
        },
        {
            title: 'Vue en direct',
            icon: Eye,
            href: route('tenant.analytics.avance'),
        },
        {
            title: 'Paramètres',
            icon: Settings,
            href: route('vendor.settings'),
        },
        {
            title: 'Profil',
            icon: Settings,
            href: route('tenant.profile.edit'),
        },
    ];

    // Variantes d'animation pour les enfants (sans flèche)
    const childVariants = {
        hidden: { opacity: 0, x: -8 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.03, duration: 0.2, ease: 'easeOut' },
        }),
    };

    return (
        <Sidebar
            // collapsible="icon"
            variant="inset"
            className={cn(
                'border-r border-slate-200/70',
                'bg-white/92 backdrop-blur-3xl supports-backdrop-filter:bg-white/88',
                'dark:border-slate-800/80',
                'dark:bg-slate-950/94 dark:supports-backdrop-filter:bg-slate-950/88',
                // 'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_rgba(15,23,42,0.04)]',
                // 'dark:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_20px_40px_rgba(0,0,0,0.25)]',
            )}
        >
            {/* Halo décoratif */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-500/8 blur-3xl dark:bg-emerald-400/6" />
                <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-slate-400/8 blur-3xl dark:bg-slate-500/6" />
                <div className="absolute bottom-0 left-0 h-40 w-full bg-linear-to-t from-emerald-500/3 to-transparent dark:from-emerald-400/2" />
            </div>

            {/* HEADER */}
            <SidebarHeader className="relative border-b border-slate-200/60 px-3 py-4 dark:border-slate-800/70 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                    {/* Logo / Avatar avec effet de glow */}
                    <div className="relative">
                        {tenant.logo_url ? (
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-emerald-500/30 blur-md transition-opacity group-hover:opacity-100" />
                                <img
                                    src={tenant.logo_url}
                                    alt={tenant.raison_sociale}
                                    className={cn(
                                        'relative h-11 w-11 rounded-2xl object-cover',
                                        'border border-white/80 dark:border-slate-700/70',
                                        'shadow-[0_8px_24px_rgba(16,185,129,0.15)]',
                                        'transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_28px_rgba(16,185,129,0.25)]',
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-emerald-500/30 blur-md" />
                                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-[0_10px_30px_rgba(16,185,129,0.25)] transition-all duration-300 hover:scale-105">
                                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                                    <ShoppingBag className="relative h-5 w-5" />
                                </div>
                            </div>
                        )}
                        {/* Indicateur de statut (en ligne / hors ligne) - optionnel */}
                        <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>

                    {/* Informations texte */}
                    <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                        <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            {tenant.raison_sociale}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                            <div className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                                {tenant.plan?.name ?? 'Plan Gratuit'}
                            </p>
                        </div>
                    </div>

                    {/* Icône de notification ou de paramètres rapides (optionnel) */}
                    <button
                        className={cn(
                            'rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300',
                            'group-data-[collapsible=icon]:hidden',
                        )}
                        onClick={() => {
                            /* action rapide, ex: ouvrir les paramètres */
                        }}
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </div>
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent className="px-2 py-3 dark:bg-slate-900">
                <SidebarGroup>
                    <SidebarMenu className="space-y-1">
                        {navigation.map((item) => {
                            const isOpen = openMenus[item.title] ?? false;

                            // Groupe avec enfants
                            if (item.children) {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {isCollapsed ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        className="h-11 rounded-xl"
                                                    >
                                                        <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                    </SidebarMenuButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    side="right"
                                                    align="start"
                                                    className="w-56 rounded-xl border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95"
                                                >
                                                    {item.children.map(
                                                        (child) => (
                                                            <DropdownMenuItem
                                                                key={
                                                                    child.title
                                                                }
                                                                asChild
                                                            >
                                                                <a
                                                                    href={
                                                                        child.href
                                                                    }
                                                                >
                                                                    {
                                                                        child.title
                                                                    }
                                                                </a>
                                                            </DropdownMenuItem>
                                                        ),
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <>
                                                {/* Parent item */}
                                                <SidebarMenuButton
                                                    onClick={() =>
                                                        toggleMenu(item.title)
                                                    }
                                                    className={cn(
                                                        'h-11 rounded-xl px-3 transition-all duration-200',
                                                        'hover:bg-slate-100 dark:hover:bg-slate-800/60',
                                                        isOpen &&
                                                            'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
                                                    )}
                                                >
                                                    <div className="flex w-full items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                            <span className="text-sm font-medium">
                                                                {item.title}
                                                            </span>
                                                        </div>
                                                        <ChevronDown
                                                            className={cn(
                                                                'h-4 w-4 text-slate-400 transition-transform duration-200',
                                                                isOpen &&
                                                                    'rotate-180',
                                                            )}
                                                        />
                                                    </div>
                                                </SidebarMenuButton>

                                                <AnimatePresence
                                                    initial={false}
                                                >
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{
                                                                height: 0,
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                height: 'auto',
                                                                opacity: 1,
                                                            }}
                                                            exit={{
                                                                height: 0,
                                                                opacity: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.22,
                                                                ease: 'easeOut',
                                                            }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="relative mt-1 ml-5 space-y-0.5 border-l border-slate-200 pl-4 dark:border-slate-800">
                                                                {item.children.map(
                                                                    (
                                                                        child,
                                                                        idx,
                                                                    ) => (
                                                                        <motion.a
                                                                            key={
                                                                                child.title
                                                                            }
                                                                            href={
                                                                                child.href
                                                                            }
                                                                            initial={{
                                                                                opacity: 0,
                                                                                x: -8,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                                x: 0,
                                                                            }}
                                                                            transition={{
                                                                                delay:
                                                                                    idx *
                                                                                    0.03,
                                                                                duration: 0.2,
                                                                                ease: 'easeOut',
                                                                            }}
                                                                            className={cn(
                                                                                'group flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200',
                                                                                'text-slate-600 hover:bg-slate-100 hover:text-emerald-700',
                                                                                'dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-emerald-300',
                                                                            )}
                                                                        >
                                                                            <span className="truncate">
                                                                                {
                                                                                    child.title
                                                                                }
                                                                            </span>
                                                                        </motion.a>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        )}
                                    </SidebarMenuItem>
                                );
                            }

                            // Élément simple (sans enfants) – sans flèche
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={
                                            isCollapsed ? item.title : undefined
                                        }
                                        className="h-11 rounded-xl px-3 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                    >
                                        <Link
                                            href={item.href ?? '#'}
                                            className="flex items-center gap-3"
                                        >
                                            <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            {!isCollapsed && (
                                                <span className="text-sm font-medium">
                                                    {item.title}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter className="relative p-3 group-data-[collapsible=icon]:hidden">
                <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-4 text-white shadow-[0_20px_40px_rgba(16,185,129,0.22)]">
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-black/10 blur-2xl" />
                    <div className="relative">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                                <Crown className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {tenant.plan?.name ?? 'Plan Gratuit'}
                                </p>
                                <p className="text-xs text-emerald-50/85">
                                    Débloquez plus de fonctionnalités
                                </p>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            className="h-10 w-full rounded-2xl border-0 bg-white/15 text-white ring-1 ring-white/15 backdrop-blur-sm hover:bg-white/20"
                        >
                            <Link href={route('vendor.payment')}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Changer de plan
                            </Link>
                        </Button>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
