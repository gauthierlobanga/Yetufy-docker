'use client';

import { HeartIcon, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface ProductQuickviewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: {
        id: string;
        title: string;
        price: number;
        rating: number;
        reviewCount: number;
        image: string;
        colors: Array<{ name: string; value: string }>;
        sizes: Array<{ name: string; available: boolean }>;
    };
}

export function ProductQuickviewDialog({
    open,
    onOpenChange,
    product,
}: ProductQuickviewProps) {
    const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedSize, setSelectedSize] = useState('S');

    const renderStars = (rating: number) => {
        return Array(5)
            .fill('')
            .map((_, i) =>
                i < rating ? (
                    <Star
                        key={i}
                        className="size-4 fill-amber-500 text-amber-500 lg:size-5"
                    />
                ) : (
                    <Star
                        key={i}
                        className="size-4 text-muted-foreground lg:size-5"
                    />
                ),
            );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                aria-describedby={undefined}
                className="gap-0 overflow-hidden p-0 sm:max-w-4xl"
            >
                <div className="flex grid-cols-1 flex-col gap-0 md:grid md:grid-cols-2">
                    {/* Product Image */}
                    <figure className="flex items-center justify-center">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="aspect-square h-full w-full object-cover"
                        />
                    </figure>

                    {/* Product Details */}
                    <div className="flex flex-col p-4 md:p-8">
                        <div className="flex-1">
                            <h2 className="mb-4 font-heading text-2xl text-balance lg:text-3xl">
                                {product.title}
                            </h2>

                            <p className="mb-4 text-2xl font-medium lg:mb-6">
                                ${product.price}
                            </p>

                            {/* Rating */}
                            <div className="mb-6 flex items-center gap-3 lg:mb-8">
                                <div className="flex gap-1">
                                    {renderStars(product.rating)}
                                </div>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    {product.reviewCount} reviews
                                </a>
                            </div>

                            {/* Color Selection */}
                            <fieldset className="mb-4 space-y-4 lg:mb-8">
                                <legend className="text-sm leading-none font-medium text-foreground">
                                    Color
                                </legend>
                                <RadioGroup
                                    className="flex gap-1.5"
                                    onValueChange={(value) =>
                                        setSelectedColor(value)
                                    }
                                    defaultValue="blue"
                                >
                                    {product.colors.map((color) => (
                                        <RadioGroupItem
                                            value={color.name}
                                            style={{
                                                backgroundColor: color.value,
                                            }}
                                            aria-label={`Select ${color.name} color`}
                                            className={cn(
                                                'size-6 rounded-full border transition-all',
                                                selectedColor === color.name
                                                    ? 'border-foreground ring ring-foreground ring-offset-2'
                                                    : 'border-border hover:border-foreground/50',
                                            )}
                                        />
                                    ))}
                                </RadioGroup>
                            </fieldset>

                            {/* Size Selection */}
                            <fieldset className="mb-4 space-y-4 lg:mb-8">
                                <legend className="flex w-full items-center justify-between text-sm leading-none font-medium text-foreground">
                                    <span>Size</span>
                                    <a
                                        href="#size-guide"
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        Size guide
                                    </a>
                                </legend>
                                <RadioGroup
                                    className="grid grid-cols-4 gap-2"
                                    onValueChange={(value) =>
                                        setSelectedSize(value)
                                    }
                                    defaultValue="1"
                                >
                                    {product.sizes.map((size) => (
                                        <label
                                            key={`${size.name}`}
                                            className="relative flex cursor-pointer flex-col items-center gap-3 rounded-md border border-input px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 has-data-[state=checked]:border-primary/50 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                                        >
                                            <RadioGroupItem
                                                id={`${size.name}`}
                                                value={size.name}
                                                className="sr-only after:absolute after:inset-0"
                                            />
                                            <p className="text-sm leading-none font-medium text-foreground">
                                                {size.name}
                                            </p>
                                        </label>
                                    ))}
                                </RadioGroup>
                            </fieldset>
                        </div>

                        {/* Add to Bag Button */}
                        <div className="flex gap-2">
                            <Button size="lg" className="grow">
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="lg">
                                <HeartIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
