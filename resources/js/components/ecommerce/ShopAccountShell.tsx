/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/layouts/ShopAccountShell.tsx
import { Head, Link } from '@inertiajs/react';
import {
    Award,
    ChevronRight,
    Heart,
    LayoutDashboard,
    MapPinned,
    RotateCcw,
    ShoppingBag,
    Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';

type NavKey =
    | 'dashboard'
    | 'orders'
    | 'wishlist'
    | 'loyalty'
    | 'addresses'
    | 'returns';

interface StatItem {
    label: string;
    value: string | number;
    helper?: string;
}

interface Props {
    headTitle: string;
    title: string;
    description: string;
    active: NavKey;
    stats?: StatItem[];
    children: ReactNode;
}

const sections: Array<{
    key: NavKey;
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
}> = [
    {
        key: 'dashboard',
        label: 'Vue d’ensemble',
        href: route('dashboard'),
        icon: LayoutDashboard,
    },
    {
        key: 'orders',
        label: 'Mes commandes',
        href: route('tenant.orders.index'),
        icon: ShoppingBag,
    },
    {
        key: 'wishlist',
        label: 'Wishlist',
        href: route('tenant.wishlist.index'),
        icon: Heart,
    },
    {
        key: 'loyalty',
        label: 'Fidélité',
        href: route('tenant.loyalty.index'),
        icon: Award,
    },
    {
        key: 'addresses',
        label: 'Mes adresses',
        href: route('tenant.addresses.index'),
        icon: MapPinned,
    },
    {
        key: 'returns',
        label: 'Retours',
        href: route('tenant.return.index'),
        icon: RotateCcw,
    },
];

export default function ShopAccountShell({
    headTitle,
    title,
    description,
    active,
    stats = [],
    children,
}: Props) {
    return (
        <MainLayout>
            <Head title={headTitle} />

            <div className="relative">
                {/* Background décoratif */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {/* Hero Header */}
                    <div className="relative mb-8 overflow-hidden rounded-4xl border border-white/20 bg-white/80 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/30">
                        {/* linear overlay */}
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/8 via-transparent to-cyan-500/6 dark:from-emerald-400/8 dark:to-cyan-400/5" />

                        {/* Top glow line */}
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/50 to-transparent" />

                        <div className="relative p-6 sm:p-8 lg:p-10">
                            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                                {/* Texte */}
                                <div className="max-w-3xl space-y-4">
                                    <Badge className="rounded-full border-emerald-200/70 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                        Espace client premium
                                    </Badge>

                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                            {title}
                                        </h1>
                                        <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                                            {description}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                {/* {stats.length > 0 && (
                                    <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto xl:min-w-[380px]">
                                        {stats.map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/40 dark:border-slate-800/80 dark:bg-slate-950/70 dark:hover:shadow-emerald-900/10"
                                            >
                                                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                                                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase dark:text-slate-500">
                                                    {stat.label}
                                                </p>

                                                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                    {stat.value}
                                                </p>

                                                {stat.helper && (
                                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                        {stat.helper}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>

                    {/* Layout */}
                    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
                        {/* Sidebar */}
                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20">
                                {/* Header */}
                                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                                    <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase dark:text-slate-500">
                                        Navigation
                                    </p>
                                    <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                        Mon compte
                                    </h3>
                                </div>

                                {/* Nav */}
                                <nav className="p-3">
                                    <div className="space-y-1.5">
                                        {sections.map((section) => {
                                            const isActive =
                                                active === section.key;
                                            const Icon = section.icon;

                                            return (
                                                <Link
                                                    key={section.key}
                                                    href={section.href}
                                                    className={cn(
                                                        'group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300',
                                                        isActive
                                                            ? 'bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white',
                                                    )}
                                                >
                                                    {/* Glow effect active */}
                                                    {isActive && (
                                                        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-emerald-500/20 to-cyan-500/10 blur-xl" />
                                                    )}

                                                    <div
                                                        className={cn(
                                                            'relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                                                            isActive
                                                                ? 'bg-white/15'
                                                                : 'bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-slate-800 dark:text-slate-400',
                                                        )}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </div>

                                                    <span className="relative z-10 flex-1">
                                                        {section.label}
                                                    </span>

                                                    <ChevronRight
                                                        className={cn(
                                                            'relative z-10 h-4 w-4 transition-all duration-300',
                                                            isActive
                                                                ? 'translate-x-0 opacity-100'
                                                                : 'translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                                                        )}
                                                    />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </nav>
                            </div>
                        </aside>

                        {/* Main content */}
                        <main className="min-w-0">
                            <div className="space-y-6">{children}</div>
                        </main>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
