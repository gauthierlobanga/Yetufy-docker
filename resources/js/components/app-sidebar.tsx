// resources/js/components/app-sidebar.tsx

import { Link, usePage } from '@inertiajs/react';
import { IconSettings } from '@tabler/icons-react';
import {
    LayoutGrid,
    ShoppingBag,
    Heart,
    Gift,
    MapPin,
    RotateCcw,
    CircleHelp,
    Store,
} from 'lucide-react';
import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/acheteur';
import tenant from '@/routes/tenant';
import addresses from '@/routes/tenant/addresses';
import loyalty from '@/routes/tenant/loyalty';
import orders from '@/routes/tenant/orders';
import { help } from '@/routes/tenant/page';
import { edit } from '@/routes/tenant/profile';
import wishlist from '@/routes/tenant/wishlist';
import vendor from '@/routes/vendor';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

// ---------- Type local pour UrlMethodPair (si non exporté par @/types) ----------
type UrlMethodPair = {
    url: string;
    method?: string;
};

// ---------- Utilitaire pour extraire une string d'un href ----------
const getHrefString = (
    href: string | UrlMethodPair | undefined,
): string | null => {
    if (!href) {
        return null;
    }

    return typeof href === 'string' ? href : href.url;
};

// ---------- Composant ----------
export function AppSidebar() {
    const { auth, url } = usePage().props as any;
    const user = auth?.user;

    const isVendor =
        user?.tenants?.length > 0 ||
        user?.roles?.some(
            (r: any) => r.name === 'owner' || r.name === 'manager',
        );

    // Fonction pour déterminer l'état actif
    const isActive = (href: string | UrlMethodPair | undefined): boolean => {
        const hrefStr = getHrefString(href);

        if (!hrefStr) {
            return false;
        }

        return url === hrefStr || url?.startsWith(hrefStr + '/');
    };

    // Enrichir les items avec la propriété `isActive`
    const enhanceItems = (items: NavItem[]): NavItem[] =>
        items.map((item) => ({
            ...item,
            isActive: isActive(item.href),
        }));

    const navigationSections = [
        {
            title: 'Principal',
            items: enhanceItems([
                {
                    title: 'Tableau de bord',
                    href: dashboard(),
                    icon: LayoutGrid,
                    badge: undefined,
                },
            ]),
        },
        {
            title: 'Achats',
            items: enhanceItems([
                {
                    title: 'Mes commandes',
                    href: orders.index().url,
                    icon: ShoppingBag,
                    badge: undefined,
                },
                {
                    title: 'Liste de souhaits',
                    href: wishlist.index().url,
                    icon: Heart,
                    badge: undefined,
                },
                {
                    title: 'Programme fidélité',
                    href: loyalty.index().url,
                    icon: Gift,
                    badge: undefined,
                },
                {
                    title: 'Adresses',
                    href: addresses.index().url,
                    icon: MapPin,
                    badge: undefined,
                },
                {
                    title: 'Retours & SAV',
                    href: tenant.return.index().url,
                    icon: RotateCcw,
                    badge: undefined,
                },
            ]),
        },
        {
            title: 'Compte',
            items: enhanceItems([
                {
                    title: 'Paramètres',
                    href: edit(),
                    icon: IconSettings,
                    badge: undefined,
                },
                {
                    title: 'Centre d’aide',
                    href: help().url,
                    icon: CircleHelp,
                    badge: undefined,
                },
            ]),
        },
    ];

    const vendorSection = isVendor
        ? {
              title: 'Espace vendeur',
              items: enhanceItems([
                  {
                      title: 'Ma boutique',
                      href: vendor.dashboard().url,
                      icon: Store,
                      badge: undefined,
                  },
              ]),
          }
        : null;

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Logo */}
            <SidebarHeader className="pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size="lg"
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="gap-6 px-3 py-4">
                {navigationSections.map((section, index) => (
                    <div key={section.title}>
                        {index > 0 && <SidebarSeparator className="my-3" />}
                        <h2 className="mb-2 ml-3 text-sm font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                            {section.title}
                        </h2>
                        <NavMain items={section.items} />
                    </div>
                ))}
                {vendorSection && (
                    <div>
                        <SidebarSeparator className="my-3" />
                        <h2 className="mb-2 ml-3 text-sm font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                            {vendorSection.title}
                        </h2>
                        <NavMain items={vendorSection.items} />
                    </div>
                )}
            </SidebarContent>

            {/* Footer utilisateur */}
            <SidebarFooter className="pt-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
