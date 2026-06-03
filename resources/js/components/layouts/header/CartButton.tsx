import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import CartContent from '@/components/ecommerce/cart/CartContent';
import CartPreview from '@/components/ecommerce/cart/CartPreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/ecommerce/use-cart';

export function CartButton() {
    const { itemCount } = useCart();
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 cursor-pointer"
                        aria-label="Panier"
                        onClick={() => setSheetOpen(true)}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {itemCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs"
                            >
                                {itemCount > 99 ? '99+' : itemCount}
                            </Badge>
                        )}
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent
                    side="bottom"
                    align="end"
                    className="w-auto p-0 shadow-xl"
                >
                    <CartPreview />
                </HoverCardContent>
            </HoverCard>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="w-full px-4 pb-20 md:min-w-4xl">
                    <SheetHeader>
                        <SheetTitle>Votre panier</SheetTitle>
                        <SheetDescription className="sr-only">
                            Consultez et gérez les articles de votre panier
                            d'achat
                        </SheetDescription>
                    </SheetHeader>
                    <CartContent />
                </SheetContent>
            </Sheet>
        </>
    );
}
