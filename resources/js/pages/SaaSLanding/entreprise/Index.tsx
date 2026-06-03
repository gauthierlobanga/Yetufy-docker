// /* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/SaaSLanding/Home.tsx
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import {
    ArrowRight,
    Globe,
    Zap,
    DollarSign,
    TrendingUp,
    Shield,
    Store,
    CheckCircle,
} from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/main-layout';

// ---- Interfaces conservées pour rétrocompatibilité ----
interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    trial_days: number;
    is_featured: boolean;
    is_recommended: boolean;
    features: string[];
    badge: string | null;
    button_text: string | null;
}

interface Testimonial {
    name: string;
    store: string;
    quote: string;
    avatar: string;
}

interface Props {
    plans?: Plan[];
    stats?: {
        stores_created: number;
        products_listed: number;
        countries_served: number;
    };
    testimonials?: Testimonial[];
}

// ---- Animation au scroll ----
function FadeInSection({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SaaSLanding(_props: Props) {
    return (
        <MainLayout>
            <Head title="Créez votre boutique en ligne – Yetu" />

            {/* ========== HERO ========== */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary/30 via-background to-primary/20 text-foreground">
                <div className="absolute inset-0 bg-[radial-linear(ellipse_at_top_right,var(--color-primary)/.15,transparent_50%)]" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:flex lg:items-center lg:py-32 lg:text-left">
                    <FadeInSection className="lg:w-1/2">
                        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Devenez l’entrepreneur
                            <br />
                            que vous rêvez d’être
                        </h1>
                        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                            Rêvez en grand et créez rapidement sur Yetu. La
                            meilleure plateforme de commerce au monde.
                        </p>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                asChild
                                className="rounded-full bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                <Link href={route('vendor.register')}>
                                    Démarrer gratuitement
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="rounded-full border border-white/20 px-8 py-6 text-lg text-foreground hover:bg-white/10"
                            >
                                <a href="#pourquoi">
                                    Pourquoi nous avons créé Yetu
                                </a>
                            </Button>
                        </div>
                    </FadeInSection>
                    <div className="mt-12 lg:mt-0 lg:w-1/2">
                        <motion.img
                            src="storage/images/shopping-basket.jpg"
                            alt="Illustration"
                            className="mx-auto w-full max-w-md"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>
                </div>
            </section>

            {/* ========== VENDEZ PARTOUT ========== */}
            <section className="bg-linear-to-b from-muted to-background py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <FadeInSection className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                                Vendez partout où vos clients
                                <br />
                                font leurs achats.
                            </h2>
                            <p className="mt-6 text-lg text-muted-foreground">
                                En ligne et en personne. Grâce à l’IA et sur les
                                réseaux sociaux. Localement et à
                                l’international.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {[
                                    'Boutique en ligne',
                                    'Points de vente physiques',
                                    'Réseaux sociaux',
                                    'Marketplaces',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3 text-foreground"
                                    >
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 rounded-xl bg-card p-4">
                                <p className="text-sm font-medium text-muted-foreground">
                                    MVA 2 Collection
                                </p>
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                    {[
                                        'Hoodies',
                                        'Sports Bras',
                                        'Leggings',
                                        'Shirts',
                                    ].map((cat) => (
                                        <span
                                            key={cat}
                                            className="rounded-lg bg-muted px-3 py-1 text-xs text-foreground"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-xl bg-card p-4">
                                <p className="text-sm font-semibold text-foreground">
                                    brooklinen
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Meet Brooklinen for Business
                                </p>
                            </div>
                            <div className="rounded-xl bg-card p-4">
                                <p className="text-sm font-semibold text-foreground">
                                    Brooklinen for business
                                </p>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== POUR TOUS ========== */}
            <section className="bg-background py-20">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <FadeInSection>
                        <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                            Pour tous, des entrepreneurs
                            <br />
                            aux grandes entreprises
                        </h2>
                    </FadeInSection>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {[
                            {
                                title: 'Lancez-vous rapidement',
                                desc: 'Jacki Prince a lancé **Guests on Earth** depuis chez elle. C’est aujourd’hui une entreprise de plus de 4 M$.',
                                icon: Zap,
                            },
                            {
                                title: 'Voyez aussi grand que vous le souhaitez',
                                desc: 'D’une boutique ne proposant qu’un seul produit, **Our Place** est devenue un empire des ustensiles de cuisine.',
                                icon: TrendingUp,
                            },
                            {
                                title: 'Passez au niveau supérieur',
                                desc: 'Le fabricant de jouets emblématique vend désormais directement aux consommateurs. Le tout propulsé par Yetu.',
                                icon: Store,
                            },
                        ].map((card, idx) => {
                            const Icon = card.icon;

                            return (
                                <FadeInSection
                                    key={idx}
                                    className="rounded-2xl bg-muted p-8 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {card.title}
                                    </h3>
                                    <p className="mt-3 text-muted-foreground">
                                        {card.desc
                                            .split('**')
                                            .map((part, i) =>
                                                i % 2 === 1 ? (
                                                    <strong key={i}>
                                                        {part}
                                                    </strong>
                                                ) : (
                                                    part
                                                ),
                                            )}
                                    </p>
                                </FadeInSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========== FIABILITÉ & PAIEMENT ========== */}
            <section className="bg-linear-to-br from-muted via-background to-primary/5 py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <FadeInSection className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                                Très rapide et vraiment fiable
                            </h2>
                            <p className="mt-6 text-lg text-muted-foreground">
                                Le processus de paiement offrant le meilleur
                                taux de conversion au monde
                            </p>
                            <div className="mt-10 space-y-8">
                                <div className="flex items-start gap-4">
                                    <TrendingUp className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            +15 %
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            TAUX DE CONVERSION PLUS ÉLEVÉ
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Globe className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            250 M+
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            ACHETEURS À FORTE INTENTION
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-8 text-sm text-muted-foreground">
                                Le checkout de Yetu convertit en moyenne 15 % de
                                plus que les autres plateformes et présente
                                votre marque à 250 millions d’acheteurs prêts.
                            </p>
                        </div>
                        {/* Simulation de checkout */}
                        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Contact
                                    </label>
                                    <input
                                        disabled
                                        value="jordan.chen@domain.com"
                                        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Code promo
                                        </label>
                                        <input
                                            disabled
                                            value="$125.00"
                                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Livraison
                                        </label>
                                        <input
                                            disabled
                                            value="Free"
                                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Taxes estimées
                                    </label>
                                    <input
                                        disabled
                                        value="$10.00"
                                        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                    />
                                </div>
                                <div className="border-t border-border pt-4">
                                    <p className="text-sm font-semibold text-foreground">
                                        Livraison
                                    </p>
                                    <div className="mt-2 space-y-2">
                                        <input
                                            disabled
                                            value="United States"
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                disabled
                                                placeholder="Prénom"
                                                value="Jordan"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                            <input
                                                disabled
                                                placeholder="Nom"
                                                value="Chen"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                        </div>
                                        <input
                                            disabled
                                            value="131 Greene St"
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        />
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                disabled
                                                value="New York"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                            <input
                                                disabled
                                                value="New York"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                            <input
                                                disabled
                                                value="10012"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== STABILITÉ & PERFORMANCE ========== */}
            <section className="bg-background py-20">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <FadeInSection>
                        <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                            Une stabilité à
                            <br />
                            toute épreuve. Une
                            <br />
                            rapidité fulgurante.
                        </h2>
                        <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
                            <div className="flex items-center gap-4">
                                <Globe className="h-8 w-8 text-primary" />
                                <div className="text-left">
                                    <p className="text-3xl font-bold text-foreground">
                                        175
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        PAYS DANS LESQUELS DES
                                        <br />
                                        MARCHANDS VENDENT SUR YETU
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Shield className="h-8 w-8 text-primary" />
                                <div className="text-left">
                                    <p className="text-3xl font-bold text-foreground">
                                        99.99%
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        DISPONIBILITÉ GARANTIE
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="mx-auto mt-10 max-w-2xl text-muted-foreground">
                            Votre boutique reste performante, même lors de vos
                            ventes exceptionnelles les plus intenses.
                        </p>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== YETU CAPITAL ========== */}
            <section className="bg-linear-to-tl from-muted to-background py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <FadeInSection className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                                Yetu s’occupe de vous
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Si votre entreprise a besoin d’un coup de pouce,{' '}
                                <strong>Yetu Capital</strong> est là pour vous
                                accompagner.
                            </p>
                            <div className="mt-10 space-y-6">
                                <div className="flex items-start gap-4">
                                    <DollarSign className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            5 milliards de $ US
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            prêtés à ce jour, investis auprès de
                                            marchands Yetu
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <DollarSign className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            Jusqu’à 5 M$ US
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Des montants adaptés pour répondre à
                                            vos besoins
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Shield className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            0 %
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            de fonds propres – aucune prise de
                                            participation, jamais
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <p className="text-lg text-foreground italic">
                                “Yetu Capital nous a donné les fonds dont nous
                                avions besoin pour maximiser nos stocks et nous
                                développer rapidement.”
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                                    JW
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        Jessica Wise
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        CEO, Hell Babies
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== CRÉEZ RAPIDEMENT ========== */}
            <section className="bg-linear-to-b from-muted to-background py-20">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <FadeInSection>
                        <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                            Créez rapidement sur Yetu
                        </h2>
                    </FadeInSection>
                    <div className="mt-12 grid gap-8 sm:grid-cols-3">
                        {[
                            {
                                step: '01',
                                title: 'Ajoutez votre premier produit',
                            },
                            {
                                step: '02',
                                title: 'Personnalisez votre boutique',
                            },
                            {
                                step: '03',
                                title: 'Configurez les paiements',
                            },
                        ].map((item, idx) => (
                            <FadeInSection
                                key={idx}
                                className="rounded-2xl bg-card p-8 shadow-sm"
                            >
                                <span className="text-4xl font-bold text-primary">
                                    {item.step}
                                </span>
                                <h3 className="mt-4 text-xl font-semibold text-foreground">
                                    {item.title}
                                </h3>
                            </FadeInSection>
                        ))}
                    </div>
                    <FadeInSection className="mt-12">
                        <Button
                            size="lg"
                            asChild
                            className="rounded-full bg-primary px-10 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                            <Link href={route('vendor.register')}>
                                Essayez maintenant
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== CTA FINAL ========== */}
            <section className="bg-primary py-16 text-center text-primary-foreground">
                <FadeInSection>
                    <h2 className="font-serif text-3xl font-bold">
                        Prêt à vous lancer ?
                    </h2>
                    <p className="mt-4 text-lg text-primary-foreground/80">
                        Créez votre boutique gratuitement et commencez à vendre.
                    </p>
                    <Button
                        size="lg"
                        variant="secondary"
                        asChild
                        className="mt-8 rounded-full bg-white px-10 py-6 text-lg font-semibold text-primary hover:bg-muted"
                    >
                        <Link href={route('vendor.register')}>
                            Démarrer gratuitement
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </FadeInSection>
            </section>
        </MainLayout>
    );
}
