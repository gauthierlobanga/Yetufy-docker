import { Link } from '@inertiajs/react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

interface MobileNavigationProps {
    items: NavItem[];
}

export function MobileNavigation({ items }: MobileNavigationProps) {
    const id = useId();

    return (
        <nav className="flex flex-col p-4">
            {items.map((item, index) => {
                // S'assurer que href est une string
                const href =
                    typeof item.href === 'string'
                        ? item.href
                        : (item.href as any)?.url || '#';

                // Créer une clé unique combinant l'ID du composant, l'URL et l'index
                const key = `${id}-${href.replace(/[^a-zA-Z0-9]/g, '-')}-${index}`;

                return (
                    <Link
                        key={key}
                        href={href}
                        className={cn(
                            'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            route().current(href + '*') &&
                                'bg-accent text-accent-foreground',
                        )}
                    >
                        {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}
