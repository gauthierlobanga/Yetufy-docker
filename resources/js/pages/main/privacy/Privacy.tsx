/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link } from '@inertiajs/react';
import { BookOpenIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/layouts/main-layout';

export default function Privacy() {
    return (
        <MainLayout>
            <Head title="Privacy" />
            <section className="py-14 lg:py-20">
                {/* Hero Section moderne */}
                <section className="relative overflow-hidden bg-linear-to-br from-primary/20 via-primary/10 to-background py-20 lg:py-20">
                    <div className="bg-grid-pattern absolute inset-0 opacity-[0.03]" />
                    <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-4 text-center">
                        <Badge
                            variant="secondary"
                            className="mb-4 px-4 py-1.5 text-sm"
                        >
                            <BookOpenIcon className="mr-2 h-3.5 w-3.5" />
                            Contactez-nous
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Découvrez nos derniers
                            <span className="mt-2 block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                articles et actualités
                            </span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Explorez nos conseils, tutoriels et actualités sur
                            le développement web, l'e-commerce et les
                            technologies modernes.
                        </p>
                    </div>
                </section>
            </section>
        </MainLayout>
    );
}
