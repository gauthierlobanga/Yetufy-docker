import { Link, usePage } from '@inertiajs/react';
import { Lock, ShieldCheck } from 'lucide-react';
import ShopAccountShell from '@/components/ecommerce/ShopAccountShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import tenant from '@/routes/tenant';

interface Props extends Record<string, unknown> {
    commande: {
        id: string;
        numero_commande: string;
        total: number | string;
        mode_paiement?: string | null;
    };
    clientSecret: string;
}

export default function PaymentPayPage() {
    const { commande, clientSecret } = usePage<Props>().props;

    return (
        <ShopAccountShell
            headTitle="Paiement"
            title={`Paiement ${commande.numero_commande}`}
            description="Finalisez votre commande depuis une etape de paiement simplifiee et securisee."
            active="orders"
            stats={[
                {
                    label: 'Montant',
                    value: `${commande.total} €`,
                    helper: commande.mode_paiement ?? 'Paiement en cours',
                },
            ]}
        >
            <Card className="py-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Paiement securise
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
                        Client secret recu: {clientSecret}
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border p-4 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Cette etape simule un paiement Stripe en attendant le
                        branchement final du provider reel.
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild>
                            <Link
                                href={route('tenant.payment.callback', {
                                    commande_id: commande.id,
                                })}
                            >
                                Confirmer le paiement
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={tenant.checkout.cancel().url}>
                                Annuler
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ShopAccountShell>
    );
}
