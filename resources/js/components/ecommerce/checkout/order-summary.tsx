import { Card, CardContent } from '@/components/ui/card';

interface OrderSummaryProps {
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    total: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const OrderSummary = ({
    subtotal,
    tax,
    shippingCost,
    discount,
    total,
}: OrderSummaryProps) => {
    return (
        <Card className="shadow-none sticky top-20">
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between font-heading text-2xl">
                        <div>Total</div>
                        <div>{formatCurrency(total)}</div>
                    </div>

                    <div className="space-y-3 border-t border-border pt-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Sous-total</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Taxes</span>
                            <span className="font-medium">{formatCurrency(tax)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex items-center justify-between">
                                <span>Réduction</span>
                                <span className="font-medium text-destructive">
                                    -{formatCurrency(discount)}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span>Livraison</span>
                            <span className="font-medium">
                                {shippingCost === 0
                                    ? 'Gratuit'
                                    : formatCurrency(shippingCost)}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                    En passant une commande, vous acceptez nos{' '}
                    <a href="#" className="underline">
                        Politique de confidentialité
                    </a>
                    ,{' '}
                    <a href="#" className="underline">
                        Conditions générales
                    </a>{' '}
                    et{' '}
                    <a href="#" className="underline">
                        Politique d'annulation
                    </a>
                    .
                </p>
            </CardContent>
        </Card>
    );
};

export default OrderSummary;
