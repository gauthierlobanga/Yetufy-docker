import { Head, Link, usePage } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/main-layout';

interface Review {
    id: string;
    note: number;
    commentaire: string;
    date_avis?: string | null;
    client?: {
        full_name?: string;
    } | null;
}

interface Props extends Record<string, unknown> {
    product: {
        nom: string;
        url: string;
    };
    reviews: {
        data: Review[];
    };
}

export default function ProductReviewsPage() {
    const { product, reviews } = usePage<Props>().props;

    return (
        <MainLayout>
            <Head title={`Avis - ${product.nom}`} />

            <div className="mx-auto max-w-5xl px-4 py-8">
                <div className="mb-6">
                    <Link
                        href={product.url}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Retour au produit
                    </Link>
                    <h1 className="mt-3 font-heading text-3xl font-semibold">
                        Avis clients sur {product.nom}
                    </h1>
                </div>

                <div className="grid gap-4">
                    {reviews.data.map((review) => (
                        <Card key={review.id} className="py-0">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span>
                                        {review.client?.full_name ?? 'Client'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-current text-amber-500" />
                                        {review.note}/5
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {review.commentaire}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {review.date_avis ?? 'Avis recent'}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
