// resources/js/layouts/MegaMenu.tsx
import { Link } from '@inertiajs/react';
import type { HeaderCategory } from '@/types/ecommerce/products';

interface MegaMenuProps {
    categories: HeaderCategory[];
}

export function MegaMenu({ categories }: MegaMenuProps) {
    // Organiser les catégories en colonnes (3 colonnes)
    const columns = [[], [], []] as HeaderCategory[][];
    categories.forEach((cat, i) => columns[i % 3].push(cat));

    return (
        <div className="grid grid-cols-3 gap-6">
            {columns.map((col, idx) => (
                <div key={idx} className="space-y-4">
                    {col.map((cat) => (
                        <div key={cat.id}>
                            <Link
                                href={cat.url}
                                className="mb-2 block text-sm font-semibold hover:text-primary"
                            >
                                {cat.nom}
                            </Link>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
