// resources/js/components/ecommerce/cart/EmptyCart.tsx (ou directement dans CartContent)
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyCart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex h-full flex-col items-center justify-center px-4 py-16 text-center"
        >
            <div className="relative mb-8">
                {/* Cercles décoratifs animés */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full bg-primary/10 blur-2xl"
                />
                <motion.div
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                    className="absolute inset-0 rounded-full bg-secondary/10 blur-xl"
                />

                {/* Icône de sac avec animation */}
                <motion.div
                    whileHover={{
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 },
                    }}
                    className="relative flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-primary/10 to-primary/5 shadow-inner"
                >
                    <ShoppingBag
                        className="h-16 w-16 text-primary/70"
                        strokeWidth={1.5}
                    />
                </motion.div>
            </div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-2 font-heading text-2xl font-semibold tracking-tight"
            >
                Votre panier est vide
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 max-w-md text-muted-foreground"
            >
                Découvrez nos produits et profitez d'offres exclusives. Ajoutez
                vos articles préférés et revenez finaliser votre commande.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Button
                    asChild
                    size="lg"
                    className="group gap-2 rounded-full px-8 shadow-lg hover:shadow-xl"
                >
                    <Link href={route('tenant.product.index')}>
                        Explorer la boutique
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </motion.div>

            {/* Suggestions rapides (optionnel) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 grid max-w-lg grid-cols-3 gap-3 text-sm"
            >
                <Link
                    href={route('tenant.product.index', { sort: 'bestseller' })}
                    className="rounded-lg border border-border/50 bg-card/50 p-3 backdrop-blur-sm transition hover:bg-card"
                >
                    <span className="font-medium">🔥 Meilleures ventes</span>
                    <p className="text-xs text-muted-foreground">
                        Les produits populaires
                    </p>
                </Link>
                <Link
                    href={route('tenant.promotions.index')}
                    className="rounded-lg border border-border/50 bg-card/50 p-3 backdrop-blur-sm transition hover:bg-card"
                >
                    <span className="font-medium">🏷️ Promotions</span>
                    <p className="text-xs text-muted-foreground">
                        Jusqu'à -50%
                    </p>
                </Link>
                <Link
                    href={route('tenant.product.category.index')}
                    className="rounded-lg border border-border/50 bg-card/50 p-3 backdrop-blur-sm transition hover:bg-card"
                >
                    <span className="font-medium">📦 Catégories</span>
                    <p className="text-xs text-muted-foreground">
                        Explorez par thème
                    </p>
                </Link>
            </motion.div>
        </motion.div>
    );
}
