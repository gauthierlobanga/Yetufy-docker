import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/layouts/main-layout';
import tenant from '@/routes/tenant';

interface Props extends Record<string, unknown> {
    commande: {
        id: string;
        numero_commande: string;
        total: number | string;
        lignes: Array<{ id: string }>;
    };
}

export default function CheckoutSuccessPage() {
    const { commande } = usePage<Props>().props;

    return (
        <MainLayout>
            <Head title="Commande confirmee" />

            <div className="mx-auto max-w-3xl px-4 py-12">
                <Card className="py-0">
                    <CardContent className="space-y-6 p-8 text-center">
                        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
                        <div className="space-y-2">
                            <h1 className="font-heading text-3xl font-semibold">
                                Commande confirmee
                            </h1>
                            <p className="text-muted-foreground">
                                Votre commande {commande.numero_commande} a bien
                                ete enregistree pour un total de{' '}
                                {commande.total} €.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button asChild>
                                <Link
                                    href={tenant.orders.show(commande.id).url}
                                >
                                    Voir ma commande
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={tenant.product.index().url}>
                                    Continuer mes achats
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
