'use client';

import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductQuickviewDialog } from './product-quickview-modal';

const productData = {
    id: '1',
    title: 'Skater Jeans',
    price: 49,
    rating: 4,
    reviewCount: 117,
    image: '/images/products/list2.png',
    colors: [
        { name: 'White', value: '#FFFFFF' },
        { name: 'Gray', value: '#9CA3AF' },
        { name: 'Crimson', value: 'crimson' },
        { name: 'Navy', value: '#1E293B' },
    ],
    sizes: [
        { name: 'XXS', available: true },
        { name: 'XS', available: true },
        { name: 'S', available: true },
        { name: 'M', available: true },
        { name: 'L', available: true },
        { name: 'XL', available: true },
        { name: 'XXL', available: true },
        { name: 'XXXL', available: false },
    ],
};

export default function ProductQuickviewsPage() {
    const [open, setOpen] = useState(true);

    return (
        <>
            <div className="mx-auto max-w-80 py-60 md:py-24">
                <Link href="#" className="group">
                    <figure className="relative aspect-square w-full overflow-hidden rounded-md object-cover">
                        <img
                            className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                            src={productData.image}
                            alt={productData.title}
                        />
                    </figure>
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-1">
                            <p className="font-medium">{productData.title}</p>
                            <p className="text-muted-foreground">
                                {productData.price}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        variant="secondary"
                        className="mt-4 w-full"
                    >
                        Quick View
                    </Button>
                </Link>
            </div>
            <ProductQuickviewDialog
                open={open}
                onOpenChange={setOpen}
                product={productData}
            />
        </>
    );
}
