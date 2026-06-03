'use client';

import { Star, HeartIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
    const [selectedImage, setSelectedImage] = useState(0);

    const images = [
        '/images/products/list1.png',
        '/images/products/list5.png',
        '/images/products/list3.png',
        '/images/products/list4.png',
    ];

    return (
        <section className="py-10 lg:py-20">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Image Gallery */}
                    <div className="col-span-2 flex flex-col-reverse gap-4 md:flex-row">
                        {/* Thumbnails */}
                        <div className="flex flex-row gap-2 md:flex-col md:gap-4">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={cn(
                                        'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all md:h-24 md:w-24',
                                        selectedImage === index
                                            ? 'border-foreground'
                                            : 'border-border hover:border-muted-foreground',
                                    )}
                                >
                                    <img
                                        src={image}
                                        alt={`Product view ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <figure className="aspect-square flex-1 overflow-hidden rounded-lg border lg:max-h-4/5">
                            <img
                                src={images[selectedImage]}
                                alt="Nike Pegasus 41 shoes"
                                className="h-full w-full object-cover"
                            />
                        </figure>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col space-y-4 lg:space-y-6">
                        <div>
                            <h1 className="font-heading text-3xl text-foreground md:text-4xl">
                                Nike Pegasus 41 shoes
                            </h1>

                            {/* Rating */}
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((star) => (
                                        <Star
                                            key={star}
                                            className="size-4 fill-amber-500 text-amber-500"
                                        />
                                    ))}
                                    <Star className="size-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    (4)
                                </span>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div>
                            <p className="text-lg text-muted-foreground line-through">
                                $189
                            </p>
                            <p className="text-3xl font-bold text-foreground md:text-4xl">
                                $159
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                (inclusive of all taxes)
                            </p>
                        </div>

                        {/* About Product */}
                        <div className="text-sm">
                            <h2 className="text-base font-semibold text-foreground">
                                About Product
                            </h2>
                            <ul className="mt-4 space-y-3">
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                                    <span>High-quality material</span>
                                </li>
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                                    <span>Comfortable for everyday use</span>
                                </li>
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                                    <span>Available in different sizes</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button variant="outline" size="lg">
                                <HeartIcon />
                                Add to Favorites
                            </Button>
                            <Button size="lg">Add to Cart</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
