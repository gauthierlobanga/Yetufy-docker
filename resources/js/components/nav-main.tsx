import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

// ---------- Type local pour UrlMethodPair (à importer si déjà défini) ----------
type UrlMethodPair = {
    url: string;
    method?: string;
};

// ---------- Helpers ----------
const getHrefString = (
    href: string | UrlMethodPair | undefined,
): string | null => {
    if (!href) {
        return null;
    }

    return typeof href === 'string' ? href : href.url;
};

const isHrefActive = (
    currentUrl: string,
    href: string | UrlMethodPair | undefined,
): boolean => {
    const hrefStr = getHrefString(href);

    if (!hrefStr) {
        return false;
    }

    return currentUrl === hrefStr || currentUrl.startsWith(hrefStr + '/');
};

// ---------- Composant ----------
export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url: currentUrl } = usePage(); // ← Correction : usePage().url, pas props

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    const active = isHrefActive(currentUrl, item.href);
                    const hrefStr = getHrefString(item.href);

                    // Élément sans URL (label désactivé)
                    if (!hrefStr) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton disabled size="lg">
                                    {item.icon && (
                                        <item.icon className="h-5 w-5" />
                                    )}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                size="lg"
                                className={cn(active && 'font-semibold')}
                            >
                                <Link href={hrefStr} prefetch>
                                    {item.icon && (
                                        <item.icon className="h-5 w-5" />
                                    )}
                                    <span>{item.title}</span>
                                    {item.badge && (
                                        <span className="ml-auto flex h-5 items-center rounded-full bg-emerald-100 px-2 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
