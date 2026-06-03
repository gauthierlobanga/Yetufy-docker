// resources/js/components/ecommerce/products/DailyOfferProductCard.tsx
import { Link } from '@inertiajs/react';
import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import type { Product } from '@/types/ecommerce/products';

interface DailyOfferProductCardProps {
    product: Product;
    showDiscountBadge?: boolean;
}

// Utilisation
export default function DailyOfferProductCard({
    product,
    showDiscountBadge = false,
}: DailyOfferProductCardProps) {
    const prixActuel = Number(product.prix_actuel) || 0;
    const prixTTC = Number(product.prix_ttc) || 0;
    const noteMoyenne = Number(product.note_moyenne) || 0;
    const soldCount = Number(product.sold_count) || 0;
    const { addToCart } = useCart();

    const imageUrl = resolveImageUrl(product.image_principale);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1);
    };

    return (
        <Link href={product.url} className="block">
            <div className="hover:shadow-md">
                <div className="relative aspect-square overflow-hidden rounded-none bg-muted">
                    <img
                        src={imageUrl}
                        alt={product.nom}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={handleImageFallback()}
                    />
                    {showDiscountBadge && product.reduction_pourcentage && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                            -{product.reduction_pourcentage}%
                        </Badge>
                    )}

                    {/* Bouton Ajouter au panier - animation fluide au survol */}
                    <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <Button
                            onClick={handleAddToCart}
                            size="sm"
                            className="w-full cursor-pointer gap-1.5 bg-black/80 text-white backdrop-blur-sm hover:bg-black"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Ajouter au panier
                        </Button>
                    </div>
                </div>

                <div className="mt-2 space-y-1 p-2">
                    <h4 className="line-clamp-2 text-sm leading-tight font-medium">
                        {product.nom}
                    </h4>

                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-medium">
                            €{Number(prixActuel).toFixed(2)}
                        </span>
                        {product.est_en_promotion && prixTTC > prixActuel && (
                            <span className="text-xs text-muted-foreground line-through">
                                €{Number(prixTTC).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="ml-0.5">
                            {Number(noteMoyenne).toFixed(1)}
                        </span>
                        <span className="mx-1">|</span>
                        <span>
                            <span className="font-extrabold">
                                {Number(soldCount).toFixed(0)}
                            </span>{' '}
                            vendu(s)
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
