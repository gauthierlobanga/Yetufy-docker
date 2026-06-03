import { Link, router } from '@inertiajs/react';
import { Minus, Plus, Trash2, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

interface CartItemProps {
    item: {
        id: number;
        product_id: number;
        name: string;
        slug?: string;
        price: number;
        original_price?: number;
        quantity: number;
        max_quantity?: number;
        image?: string;
        options?: Record<string, string>;
        stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
    };
    compact?: boolean;
    onUpdate?: () => void;
}

export function CartItem({ item, compact = false, onUpdate }: CartItemProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [quantity, setQuantity] = useState(item.quantity);

    const hasDiscount = item.original_price && item.original_price > item.price;
    const discountPercentage = hasDiscount
        ? Math.round(
              ((item.original_price! - item.price) / item.original_price!) *
                  100,
          )
        : 0;

    const isOutOfStock = item.stock_status === 'out_of_stock';
    const isLowStock = item.stock_status === 'low_stock';
    const maxQuantity = item.max_quantity || 99;

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > maxQuantity) {
            return;
        }

        if (newQuantity === quantity) {
            return;
        }

        setIsUpdating(true);
        setQuantity(newQuantity);

        try {
            await router.patch(
                route('tenant.cart.update', { id: item.id }),
                { quantity: newQuantity },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        onUpdate?.();
                    },
                    onError: () => {
                        setQuantity(item.quantity);
                    },
                    onFinish: () => {
                        setIsUpdating(false);
                    },
                },
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setQuantity(item.quantity);
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);

        try {
            await router.delete(route('tenant.cart.remove', { id: item.id }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    onUpdate?.();
                },
                onFinish: () => {
                    setIsRemoving(false);
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setIsRemoving(false);
        }
    };

    const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);

        if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
            handleQuantityChange(value);
        }
    };

    const itemTotal = item.price * quantity;
    const originalTotal = item.original_price
        ? item.original_price * quantity
        : itemTotal;

    if (compact) {
        return (
            <div className="flex items-start gap-3 py-2">
                {/* Image */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">
                                No img
                            </span>
                        </div>
                    )}
                    {isUpdating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    )}
                </div>

                {/* Détails */}
                <div className="min-w-0 flex-1">
                    <Link
                        href={route('tenant.product.show', {
                            slug: item.slug || item.product_id,
                        })}
                        className="line-clamp-1 text-sm font-medium hover:underline"
                    >
                        {item.name}
                    </Link>

                    {item.options && Object.keys(item.options).length > 0 && (
                        <div className="mt-1 space-y-0.5">
                            {Object.entries(item.options).map(
                                ([key, value]) => (
                                    <p
                                        key={key}
                                        className="text-xs text-muted-foreground"
                                    >
                                        <span className="font-medium">
                                            {key}:
                                        </span>{' '}
                                        {value}
                                    </p>
                                ),
                            )}
                        </div>
                    )}

                    <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                                {formatPrice(item.price)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                <X />
                            </span>
                            <span className="text-sm">{quantity}</span>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={handleRemove}
                            disabled={isRemoving}
                        >
                            {isRemoving ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Trash2 className="h-3 w-3" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative flex gap-4 py-4',
                isUpdating && 'pointer-events-none opacity-60',
            )}
        >
            {/* Image du produit */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-sm text-muted-foreground">
                            Pas d'image
                        </span>
                    </div>
                )}

                {/* Badge de réduction */}
                {hasDiscount && (
                    <div className="absolute top-1 left-1">
                        <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                            -{discountPercentage}%
                        </span>
                    </div>
                )}
            </div>

            {/* Détails du produit */}
            <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                    <div className="flex-1">
                        <Link
                            href={route('tenant.product.show', {
                                slug: item.slug || item.product_id,
                            })}
                            className="text-base font-medium hover:underline"
                        >
                            {item.name}
                        </Link>

                        {/* Options du produit */}
                        {item.options &&
                            Object.keys(item.options).length > 0 && (
                                <div className="mt-1 space-y-0.5">
                                    {Object.entries(item.options).map(
                                        ([key, value]) => (
                                            <p
                                                key={key}
                                                className="text-sm text-muted-foreground"
                                            >
                                                <span className="font-medium">
                                                    {key}:
                                                </span>{' '}
                                                {value}
                                            </p>
                                        ),
                                    )}
                                </div>
                            )}

                        {/* Statut du stock */}
                        {isOutOfStock && (
                            <p className="mt-1 text-sm font-medium text-destructive">
                                Rupture de stock
                            </p>
                        )}
                        {isLowStock && (
                            <p className="mt-1 text-sm font-medium text-yellow-600 dark:text-yellow-500">
                                Stock limité
                            </p>
                        )}
                    </div>

                    {/* Prix */}
                    <div className="text-right">
                        {hasDiscount ? (
                            <>
                                <p className="text-sm text-muted-foreground line-through">
                                    {formatPrice(originalTotal)}
                                </p>
                                <p className="text-lg font-semibold text-primary">
                                    {formatPrice(itemTotal)}
                                </p>
                            </>
                        ) : (
                            <p className="text-lg font-semibold">
                                {formatPrice(itemTotal)}
                            </p>
                        )}
                        {hasDiscount && (
                            <p className="text-xs text-green-600 dark:text-green-500">
                                Économisez{' '}
                                {formatPrice(originalTotal - itemTotal)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between">
                    {/* Contrôles de quantité */}
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        handleQuantityChange(quantity - 1)
                                    }
                                    disabled={quantity <= 1 || isUpdating}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Diminuer la quantité</p>
                            </TooltipContent>
                        </Tooltip>

                        <Input
                            type="number"
                            min="1"
                            max={maxQuantity}
                            value={quantity}
                            onChange={handleQuantityInput}
                            className="h-8 w-16 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            disabled={isUpdating}
                        />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        handleQuantityChange(quantity + 1)
                                    }
                                    disabled={
                                        quantity >= maxQuantity || isUpdating
                                    }
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Augmenter la quantité</p>
                            </TooltipContent>
                        </Tooltip>

                        {quantity >= maxQuantity && (
                            <span className="text-xs text-muted-foreground">
                                Max: {maxQuantity}
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Bouton supprimer avec confirmation */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-destructive"
                                    disabled={isRemoving}
                                >
                                    {isRemoving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    Supprimer
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Supprimer l'article ?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir retirer "
                                        {item.name}" de votre panier ? Cette
                                        action est irréversible.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleRemove}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Supprimer
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Sauvegarder pour plus tard (Wishlist) */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                        router.post(
                                            route('tenant.wishlist.toggle', {
                                                product: item.product_id,
                                            }),
                                            {},
                                            { preserveState: true },
                                        );
                                    }}
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ajouter à la liste de souhaits</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Message de mise à jour */}
                {isUpdating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                        <div className="flex items-center gap-2 rounded-lg bg-background px-4 py-2 shadow-lg">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Mise à jour...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
