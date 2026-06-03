// resources/js/components/user-menu-content.tsx
// import { Link, router } from '@inertiajs/react';
// import {
//     ArrowRight,
//     HelpCircle,
//     Heart,
//     LayoutDashboard,
//     LogOut,
//     Settings,
//     ShoppingBag,
//     Store,
// } from 'lucide-react';
// import type { LucideIcon } from 'lucide-react';
// import { useId } from 'react';
// import {
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
// import { UserInfo } from '@/components/user-info';
// import { CanRole } from '@/core/permissions/Can';
// import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
// import { cn } from '@/lib/utils';
// import { logout } from '@/routes';
// import { edit } from '@/routes/tenant/profile';
// import type { User } from '@/types';

// type Props = {
//     user: User;
// };

// interface MenuItem {
//     icon: LucideIcon;
//     label: string;
//     href: string;
//     target?: '_blank';
//     roles?: string[];
//     destructive?: boolean;
// }

// /* -------------------------------------------------------------------------- */
// /*                               Menu Configuration                           */
// /* -------------------------------------------------------------------------- */

// const menuSections: { key: string; items: MenuItem[] }[] = [
//     {
//         key: 'main',
//         items: [
//             {
//                 icon: LayoutDashboard,
//                 label: 'Mon compte',
//                 href: route('dashboard'),
//             },
//             {
//                 icon: Store,
//                 label: 'Ma boutique',
//                 href: route('vendor.dashboard'),
//             },
//             {
//                 icon: ShoppingBag,
//                 label: 'Mes commandes',
//                 href: route('tenant.orders.index'),
//             },
//             {
//                 icon: Heart,
//                 label: 'Liste de souhaits',
//                 href: route('tenant.wishlist.index'),
//             },
//         ],
//     },
//     {
//         key: 'admin',
//         items: [
//             {
//                 icon: LayoutDashboard,
//                 label: 'Administration',
//                 href: route('filament.admin.pages.dashboard'),
//                 roles: ['admin', 'super_admin'],
//                 target: '_blank',
//             },
//         ],
//     },
//     {
//         key: 'account',
//         items: [
//             { icon: Settings, label: 'Paramètres', href: edit().url },
//             {
//                 icon: HelpCircle,
//                 label: "Centre d'aide",
//                 href: route('tenant.page.help'),
//             },
//         ],
//     },
// ];

// /* -------------------------------------------------------------------------- */
// /*                                Menu Item UI                                */
// /* -------------------------------------------------------------------------- */

// function MenuLink({
//     item,
//     onNavigate,
// }: {
//     item: MenuItem;
//     onNavigate: () => void;
// }) {
//     const content = (
//         <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
//             <Link
//                 href={item.href}
//                 target={item.target}
//                 rel={
//                     item.target === '_blank' ? 'noopener noreferrer' : undefined
//                 }
//                 onClick={onNavigate}
//                 className={cn(
//                     'group mx-2 my-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5',
//                     'transition-all duration-200',
//                     'hover:bg-emerald-50/80 hover:text-emerald-700',
//                     'dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400',
//                     item.destructive &&
//                         'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400',
//                 )}
//             >
//                 <div
//                     className={cn(
//                         'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
//                         'bg-slate-100 text-slate-500',
//                         'transition-all duration-200',
//                         'group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-sm',
//                         'dark:bg-slate-800 dark:text-slate-400',
//                         'dark:group-hover:bg-slate-900 dark:group-hover:text-emerald-400',
//                         item.destructive &&
//                             'group-hover:text-red-600 dark:group-hover:text-red-400',
//                     )}
//                 >
//                     <item.icon className="h-4 w-4" />
//                 </div>

//                 <span className="flex-1 text-sm font-medium">{item.label}</span>

//                 {!item.destructive && (
//                     <ArrowRight className="h-3.5 w-3.5 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
//                 )}
//             </Link>
//         </DropdownMenuItem>
//     );

//     if (item.roles) {
//         return <CanRole roles={item.roles}>{content}</CanRole>;
//     }

//     return content;
// }

// /* -------------------------------------------------------------------------- */
// /*                             Main Component                                 */
// /* -------------------------------------------------------------------------- */

// export function UserMenuContent({ user }: Props) {
//     const cleanup = useMobileNavigation();
//     const id = useId();

//     const handleLogout = () => {
//         cleanup();
//         router.post(logout());
//     };

//     return (
//         <>
//             {/* En-tête utilisateur */}
//             <DropdownMenuLabel className="p-0 font-normal">
//                 <div className="relative overflow-hidden px-4 py-4">
//                     <div className="absolute inset-0 bg-linear-to-br from-emerald-50/70 via-white to-slate-50/70 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900" />
//                     <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />
//                     <div className="relative">
//                         <UserInfo user={user} showEmail />
//                     </div>
//                 </div>
//             </DropdownMenuLabel>

//             {/* Sections du menu */}
//             {menuSections.map((section) => (
//                 <div key={`${id}-${section.key}`}>
//                     <DropdownMenuSeparator className="mx-4 bg-slate-200/70 dark:bg-slate-800/70" />
//                     <DropdownMenuGroup className="py-2">
//                         {section.items.map((item) => (
//                             <MenuLink
//                                 key={`${section.key}-${item.label}`}
//                                 item={item}
//                                 onNavigate={cleanup}
//                             />
//                         ))}
//                     </DropdownMenuGroup>
//                 </div>
//             ))}

//             {/* Déconnexion */}
//             <DropdownMenuSeparator className="mx-4 bg-slate-200/70 dark:bg-slate-800/70" />
//             <DropdownMenuItem
//                 onClick={handleLogout}
//                 className="p-0 focus:bg-transparent"
//             >
//                 <button
//                     type="button"
//                     className={cn(
//                         'group mx-2 my-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5',
//                         'transition-all duration-200',
//                         'hover:bg-red-50 hover:text-red-600',
//                         'dark:hover:bg-red-500/10 dark:hover:text-red-400',
//                     )}
//                 >
//                     <div
//                         className={cn(
//                             'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
//                             'bg-red-50 text-red-500',
//                             'transition-all duration-200',
//                             'group-hover:bg-white group-hover:shadow-sm',
//                             'dark:bg-red-500/10 dark:text-red-400',
//                         )}
//                     >
//                         <LogOut className="h-4 w-4" />
//                     </div>

//                     <span className="flex-1 text-left text-sm font-medium">
//                         Se déconnecter
//                     </span>
//                 </button>
//             </DropdownMenuItem>
//         </>
//     );
// }

// resources/js/components/user-menu-content.tsx
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    HelpCircle,
    Heart,
    LayoutDashboard,
    LogOut,
    Settings,
    ShoppingBag,
    Store,
} from 'lucide-react';
import { useId } from 'react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { CanRole } from '@/core/permissions/Can';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { edit } from '@/routes/tenant/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

// ─── Configuration des liens ────────────────────────────────────────────────
const menuLinks = {
    // Vendeur (gestion de la boutique)
    vendor: [
        {
            icon: Store,
            label: 'Tableau de bord',
            href: route('vendor.dashboard'),
        },
        {
            icon: ShoppingBag,
            label: 'Commandes',
            href: route('tenant.orders.index'),
        },
    ],
    // Client / Acheteur
    customer: [
        {
            icon: LayoutDashboard,
            label: 'Mon tableau de bord',
            href: route('acheteur.dashboard'),
        },
        {
            icon: ShoppingBag,
            label: 'Mes commandes',
            href: route('tenant.orders.index'),
        },
        {
            icon: Heart,
            label: 'Liste de souhaits',
            href: route('tenant.wishlist.index'),
        },
    ],
    // Compte (commun)
    account: [
        { icon: Settings, label: 'Paramètres', href: edit().url },
        {
            icon: HelpCircle,
            label: "Centre d'aide",
            href: route('tenant.page.help'),
        },
    ],
    // Administration (super_admin uniquement)
    admin: [
        {
            icon: LayoutDashboard,
            label: 'Administration',
            href: route('filament.admin.pages.dashboard'),
            target: '_blank',
            roles: ['admin', 'super_admin'],
        },
    ],
};

// ─── Composant pour un lien du menu ─────────────────────────────────────────
function MenuLink({
    item,
    onNavigate,
}: {
    item: (typeof menuLinks.vendor)[0] & { roles?: string[] };
    onNavigate: () => void;
}) {
    const content = (
        <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <Link
                href={item.href}
                target={(item as any).target}
                rel={
                    (item as any).target === '_blank'
                        ? 'noopener noreferrer'
                        : undefined
                }
                onClick={onNavigate}
                className={cn(
                    'group mx-2 my-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5',
                    'transition-all duration-200',
                    'hover:bg-emerald-50/80 hover:text-emerald-700',
                    'dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400',
                )}
            >
                <div
                    className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        'bg-slate-100 text-slate-500',
                        'transition-all duration-200',
                        'group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-sm',
                        'dark:bg-slate-800 dark:text-slate-400',
                        'dark:group-hover:bg-slate-900 dark:group-hover:text-emerald-400',
                    )}
                >
                    <item.icon className="h-4 w-4" />
                </div>

                <span className="flex-1 text-sm font-medium">{item.label}</span>

                {!item.roles && (
                    <ArrowRight className="h-3.5 w-3.5 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                )}
            </Link>
        </DropdownMenuItem>
    );

    if (item.roles) {
        return <CanRole roles={item.roles}>{content}</CanRole>;
    }

    return content;
}

// ─── Composant principal ────────────────────────────────────────────────────
export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const id = useId();

    const handleLogout = () => {
        cleanup();
        router.post(logout());
    };

    return (
        <>
            {/* En-tête utilisateur */}
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="relative overflow-hidden px-4 py-4">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-50/70 via-white to-slate-50/70 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900" />
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />
                    <div className="relative">
                        <UserInfo user={user} showEmail />
                    </div>
                </div>
            </DropdownMenuLabel>

            {/* Section Vendeur (propriétaire / manager) */}
            <CanRole roles={['owner', 'manager', 'super_admin']}>
                <DropdownMenuSeparator className="mx-4 bg-slate-200/70 dark:bg-slate-800/70" />
                <DropdownMenuGroup className="py-2">
                    <div className="px-4 pb-1">
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                            Ma boutique
                        </p>
                    </div>
                    {menuLinks.vendor.map((item) => (
                        <MenuLink
                            key={`vendor-${item.label}`}
                            item={item}
                            onNavigate={cleanup}
                        />
                    ))}
                </DropdownMenuGroup>
            </CanRole>

            {/* Section Client (tout le monde connecté) */}
            <DropdownMenuSeparator className="mx-4 bg-slate-200/70 dark:bg-slate-800/70" />
            <DropdownMenuGroup className="py-2">
                <div className="px-4 pb-1">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                        Espace acheteur
                    </p>
                </div>
                {menuLinks.customer.map((item) => (
                    <MenuLink
                        key={`customer-${item.label}`}
                        item={item}
                        onNavigate={cleanup}
                    />
                ))}
            </DropdownMenuGroup>

            {/* Section Compte (commune) */}
            <DropdownMenuSeparator className="mx-4 bg-slate-200/70 dark:bg-slate-800/70" />
            <DropdownMenuGroup className="py-2">
                <div className="px-4 pb-1">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                        Compte
                    </p>
                </div>
                {menuLinks.account.map((item) => (
                    <MenuLink
                        key={`account-${item.label}`}
                        item={item}
                        onNavigate={cleanup}
                    />
                ))}
            </DropdownMenuGroup>

            {/* Section Administration (super_admin) */}
            <CanRole roles={['super_admin']}>
                <DropdownMenuSeparator className="mx-4 bg-slate-200/70 dark:bg-slate-800/70" />
                <DropdownMenuGroup className="py-2">
                    <div className="px-4 pb-1">
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                            Administration
                        </p>
                    </div>
                    {menuLinks.admin.map((item) => (
                        <MenuLink
                            key={`admin-${item.label}`}
                            item={item}
                            onNavigate={cleanup}
                        />
                    ))}
                </DropdownMenuGroup>
            </CanRole>

            {/* Déconnexion */}
            <DropdownMenuSeparator className="mx-4 bg-slate-200/70 dark:bg-slate-800/70" />
            <DropdownMenuItem
                onClick={handleLogout}
                className="p-0 focus:bg-transparent"
            >
                <button
                    type="button"
                    className={cn(
                        'group mx-2 my-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5',
                        'transition-all duration-200',
                        'hover:bg-red-50 hover:text-red-600',
                        'dark:hover:bg-red-500/10 dark:hover:text-red-400',
                    )}
                >
                    <div
                        className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                            'bg-red-50 text-red-500',
                            'transition-all duration-200',
                            'group-hover:bg-white group-hover:shadow-sm',
                            'dark:bg-red-500/10 dark:text-red-400',
                        )}
                    >
                        <LogOut className="h-4 w-4" />
                    </div>

                    <span className="flex-1 text-left text-sm font-medium">
                        Se déconnecter
                    </span>
                </button>
            </DropdownMenuItem>
        </>
    );
}
