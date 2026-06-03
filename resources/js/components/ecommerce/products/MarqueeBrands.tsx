import { useGSAP } from '@gsap/react';
import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { Brand } from '@/types/ecommerce/products';

interface MarqueeBrandsProps {
    brands: Brand[];
}

export default function MarqueeBrands({ brands }: MarqueeBrandsProps) {
    const marqueeRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const marquee = marqueeRef.current;

            if (!marquee) {
                return;
            }

            const items = gsap.utils.toArray<HTMLElement>(marquee.children);
            const totalWidth = items.reduce(
                (acc, el) => acc + el.offsetWidth,
                0,
            );

            gsap.to(items, {
                x: -totalWidth / 2, // déplace d'une moitié de la largeur totale (car on duplique)
                repeat: -1,
                duration: brands.length * 2, // vitesse proportionnelle au nombre d'items
                ease: 'linear',
                modifiers: {
                    x: gsap.utils.unitize(
                        (x) => parseFloat(x) % (totalWidth / 2),
                    ),
                },
            });
        },
        { scope: marqueeRef, dependencies: [brands.length] },
    );

    // Si aucune marque, on n'affiche rien
    if (brands.length === 0) {
        return null;
    }

    return (
        <section className="border-y bg-muted/20 py-8">
            <div className="overflow-hidden">
                <div
                    ref={marqueeRef}
                    className="flex gap-12 px-4 whitespace-nowrap"
                >
                    {/* Dupliquer pour un effet de boucle continue */}
                    {[...brands, ...brands].map((brand, index) => (
                        <Link
                            key={`${brand.id}-${index}`}
                            href={brand.url}
                            className="inline-flex h-36 w-28 items-center justify-center grayscale transition hover:grayscale-0"
                        >
                            {brand.logo ? (
                                <img
                                    src={brand.logo}
                                    alt={brand.nom}
                                    className="h-36 max-h-full w-28 max-w-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <span className="text-sm font-medium text-muted-foreground">
                                    {brand.nom}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
