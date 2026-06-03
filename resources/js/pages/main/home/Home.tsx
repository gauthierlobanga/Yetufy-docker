// resources/js/Pages/main/home/Home.tsx
import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CategoryTabs from '@/components/ecommerce/Categories/CategoryTabs';
import FeaturedProducts from '@/components/ecommerce/products/FeaturedProducts';
import PromoSection from '@/components/ecommerce/products/promo-sections-01';
import TrendingProducts from '@/components/ecommerce/products/TrendingProducts';
import MainLayout from '@/layouts/main-layout';
import type { PageProps, Product } from '@/types/ecommerce/products';
import DailyOffers from './daily-offers';
import HeroSection from './HeroSection';

export default function Home() {
    const { props } = usePage<PageProps>();

    const {
        featuredProducts,
        trendingProducts = [],
        categories = [],
        productsByCategory = {},
        promo,
        bestSellers = [],
        dealOfTheDay = [],
    } = props;

    const featuredProductsData: Product[] = Array.isArray(featuredProducts)
        ? featuredProducts
        : (featuredProducts?.data ?? []);

    const [displayedCount, setDisplayedCount] = useState(12);
    const hasMore = displayedCount < featuredProductsData.length;

    const loadMore = () => {
        setDisplayedCount((prev) =>
            Math.min(prev + 12, featuredProductsData.length),
        );
    };

    const productsToShow = featuredProductsData.slice(0, displayedCount);

    return (
        <MainLayout>
            <Head title="Accueil" />
            <HeroSection categories={categories} />
            {promo && <PromoSection promo={promo} />}

            <DailyOffers
                bestSellers={bestSellers}
                dealOfTheDay={dealOfTheDay}
            />

            <CategoryTabs
                categories={categories}
                productsByCategory={productsByCategory}
            />

            {trendingProducts.length > 0 && (
                <TrendingProducts products={trendingProducts} />
            )}

            <FeaturedProducts
                products={productsToShow}
                loadMore={loadMore}
                hasMore={hasMore}
            />
        </MainLayout>
    );
}
