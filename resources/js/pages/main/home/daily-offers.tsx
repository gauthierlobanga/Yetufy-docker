// resources/js/components/home/daily-offers.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Package,
    Sparkles,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import DailyOfferProductCard from '@/components/ecommerce/products/DailyOfferProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce/products';

import 'swiper/css';
import 'swiper/css/navigation';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface DailyOffersProps {
    bestSellers: Product[];
    dealOfTheDay: Product[];
}

/* -------------------------------------------------------------------------- */
/*                              Animation Variants                            */
/* -------------------------------------------------------------------------- */

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export default function DailyOffers({
    bestSellers,
    dealOfTheDay,
}: DailyOffersProps) {
    return (
        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-b from-emerald-50/70 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
            <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-emerald-500/8 blur-3xl dark:bg-emerald-400/10" />
            <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-400/8 blur-3xl dark:bg-amber-400/5" />
            <div className="absolute inset-0 bg-[radial-linear(circle_at_1px_1px,rgba(148,163,184,0.12)_1px,transparent_0)] bg-size-[28px_28px] dark:bg-[radial-linear(circle_at_1px_1px,rgba(71,85,105,0.18)_1px,transparent_0)]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="mx-auto mb-12 max-w-3xl text-center lg:mb-16"
                >
                    <Badge
                        variant="outline"
                        className="rounded-full border-emerald-200/70 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase shadow-sm backdrop-blur dark:border-emerald-800/60 dark:bg-emerald-500/10 dark:text-emerald-300"
                    >
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        Offres exclusives
                    </Badge>

                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                        Les meilleures offres du moment
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
                        Découvrez nos produits les plus populaires et les
                        promotions du jour sélectionnées pour vous.
                    </p>
                </motion.div>

                {/* Content */}
                <div className="grid gap-8 xl:grid-cols-2">
                    <OfferSection
                        title="Meilleures ventes"
                        description="Les produits les plus appréciés par nos clients."
                        badge="Top ventes"
                        badgeIcon={TrendingUp}
                        badgeClassName="text-emerald-700 dark:text-emerald-300"
                        link={route('tenant.product.index', {
                            sort: 'popular',
                        })}
                        linkLabel="Voir tout"
                        items={bestSellers}
                        prevClass="best-prev"
                        nextClass="best-next"
                        emptyTitle="Aucune meilleure vente"
                        emptyDescription="Les produits les plus populaires apparaîtront ici."
                        emptyLink={route('tenant.product.index')}
                        emptyLinkLabel="Explorer les produits"
                    />

                    <OfferSection
                        title="Deal du jour"
                        description="Des réductions exceptionnelles à durée limitée."
                        badge="Flash deal"
                        badgeIcon={Zap}
                        badgeClassName="text-rose-700 dark:text-rose-300"
                        link={route('tenant.promotions.index')}
                        linkLabel="Voir tout"
                        items={dealOfTheDay}
                        prevClass="deal-prev"
                        nextClass="deal-next"
                        showDiscount
                        highlighted
                        emptyTitle="Aucun deal en cours"
                        emptyDescription="Les promotions du jour apparaîtront ici."
                        emptyLink={route('tenant.promotions.index')}
                        emptyLinkLabel="Voir les promotions"
                    />
                </div>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*                               Offer Section                                */
/* -------------------------------------------------------------------------- */

interface OfferSectionProps {
    title: string;
    description: string;
    badge: string;
    badgeIcon: React.ElementType;
    badgeClassName?: string;
    link: string;
    linkLabel: string;
    items: Product[];
    prevClass: string;
    nextClass: string;
    showDiscount?: boolean;
    highlighted?: boolean;
    emptyTitle: string;
    emptyDescription: string;
    emptyLink: string;
    emptyLinkLabel: string;
}

function OfferSection({
    title,
    description,
    badge,
    badgeIcon: BadgeIcon,
    badgeClassName,
    link,
    linkLabel,
    items,
    prevClass,
    nextClass,
    showDiscount = false,
    highlighted = false,
    emptyTitle,
    emptyDescription,
    emptyLink,
    emptyLinkLabel,
}: OfferSectionProps) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className={cn(
                'relative overflow-hidden rounded-[2rem] border',
                'backdrop-blur-2xl',
                'shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)]',
                highlighted
                    ? 'border-rose-200/60 bg-linear-to-br from-rose-50/80 via-white to-amber-50/70 dark:border-rose-900/30 dark:from-rose-950/20 dark:via-slate-950 dark:to-amber-950/10'
                    : 'border-slate-200/70 bg-white/90 dark:border-slate-800/70 dark:bg-slate-900/70',
            )}
        >
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className={cn(
                        'absolute -top-20 right-0 h-56 w-56 rounded-full blur-3xl',
                        highlighted
                            ? 'bg-rose-400/10 dark:bg-rose-400/10'
                            : 'bg-emerald-400/10 dark:bg-emerald-400/10',
                    )}
                />
            </div>

            <div className="relative p-5 sm:p-6 lg:p-7">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <Badge
                            variant="secondary"
                            className={cn(
                                'mb-3 rounded-full border border-transparent bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase shadow-sm dark:bg-slate-800/80',
                                badgeClassName,
                            )}
                        >
                            <BadgeIcon className="mr-1.5 h-3.5 w-3.5" />
                            {badge}
                        </Badge>

                        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    </div>

                    {items.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="shrink-0 rounded-xl text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                            <Link href={link}>
                                {linkLabel}
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Content */}
                {items.length > 0 ? (
                    <Carousel
                        items={items}
                        prevClass={prevClass}
                        nextClass={nextClass}
                        showDiscount={showDiscount}
                    />
                ) : (
                    <EmptyState
                        icon={Package}
                        title={emptyTitle}
                        description={emptyDescription}
                        link={emptyLink}
                        linkText={emptyLinkLabel}
                    />
                )}
            </div>
        </motion.div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  Carousel                                  */
/* -------------------------------------------------------------------------- */

interface CarouselProps {
    items: Product[];
    prevClass: string;
    nextClass: string;
    showDiscount?: boolean;
}

function Carousel({
    items,
    prevClass,
    nextClass,
    showDiscount = false,
}: CarouselProps) {
    const loop = items.length > 3;

    return (
        <div className="group/carousel relative -mx-2">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                loop={loop}
                speed={650}
                watchOverflow
                autoplay={
                    items.length > 1
                        ? {
                              delay: 4500,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true,
                          }
                        : false
                }
                navigation={{
                    prevEl: `.${prevClass}`,
                    nextEl: `.${nextClass}`,
                }}
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                    },
                    1280: {
                        slidesPerView: 3,
                    },
                }}
                className="px-2 pb-3"
            >
                {items.map((product) => (
                    <SwiperSlide key={product.id} className="h-auto">
                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{
                                duration: 0.25,
                                ease: 'easeOut',
                            }}
                            className="h-full"
                        >
                            <DailyOfferProductCard
                                product={product}
                                showDiscountBadge={showDiscount}
                            />
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {items.length > 1 && (
                <>
                    <NavButton className={prevClass} direction="prev" />
                    <NavButton className={nextClass} direction="next" />
                </>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                               Nav Button                                   */
/* -------------------------------------------------------------------------- */

function NavButton({
    className,
    direction,
}: {
    className: string;
    direction: 'prev' | 'next';
}) {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            className={cn(
                className,
                'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border',
                'border-white/80 bg-white/85 text-slate-700 backdrop-blur-xl',
                'shadow-[0_12px_30px_-12px_rgba(15,23,42,0.22)]',
                'opacity-0 transition-all duration-300',
                'group-hover/carousel:opacity-100 xl:flex',
                'hover:scale-105 hover:text-emerald-600',
                'dark:border-slate-700/80 dark:bg-slate-900/85 dark:text-slate-300',
                'dark:hover:text-emerald-400',
                direction === 'prev' ? 'left-3' : 'right-3',
            )}
            aria-label={
                direction === 'prev' ? 'Produit précédent' : 'Produit suivant'
            }
        >
            <Icon className="h-4.5 w-4.5" />
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/*                                Empty State                                 */
/* -------------------------------------------------------------------------- */

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    link: string;
    linkText: string;
}

function EmptyState({
    icon: Icon,
    title,
    description,
    link,
    linkText,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-70 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/70 bg-slate-50/60 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700">
                <Icon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>

            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                {title}
            </h4>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
            </p>

            <Button
                variant="outline"
                size="sm"
                asChild
                className="mt-5 rounded-xl"
            >
                <Link href={link}>{linkText}</Link>
            </Button>
        </div>
    );
}
