'use client';

import { Link } from '@inertiajs/react';
import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const products = [
    {
        title: 'White T-Shirt',
        image: '/images/products/list1.png',
        price: '$29.00',
    },
    {
        title: 'White T-Shirt',
        image: '/images/products/list2.png',
        price: '$29.00',
    },
    {
        title: 'White T-Shirt',
        image: '/images/products/list3.png',
        price: '$29.00',
    },
    {
        title: 'White T-Shirt',
        image: '/images/products/list4.png',
        price: '$29.00',
    },
    {
        title: 'White T-Shirt',
        image: '/images/products/list5.png',
        price: '$29.00',
    },
    {
        title: 'White T-Shirt',
        image: '/images/products/list6.png',
        price: '$29.00',
    },
];

export type Product = (typeof products)[number];

const colorFilters = [
    {
        name: 'Blue',
        classNames:
            'border-blue-500 bg-blue-500 shadow-none data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500',
    },
    {
        name: 'Pink',
        classNames:
            'border-pink-500 bg-pink-500 shadow-none data-[state=checked]:border-pink-500 data-[state=checked]:bg-pink-500',
    },
    {
        name: 'Red',
        classNames:
            'border-red-500 bg-red-500 shadow-none data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500',
    },
    {
        name: 'Orange',
        classNames:
            'border-amber-500 bg-amber-500 shadow-none data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500',
    },
    {
        name: 'Green',
        classNames:
            'border-emerald-500 bg-emerald-500 shadow-none data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500',
    },
];

const categories = [
    { name: 'T-Shirts' },
    { name: 'Hoodies' },
    { name: 'Jackets' },
    { name: 'Accessories' },
    { name: 'Sweaters' },
    { name: 'Shorts' },
    { name: 'Bags' },
];

const sizes = [{ name: 'SM' }, { name: 'LG' }, { name: 'XL' }, { name: 'XXL' }];

const sortFilters = [
    { key: 'featured', name: 'Featured' },
    { key: 'best_selling', name: 'Best Selling' },
    { key: 'price_low_high', name: 'Price: Low to High' },
    { key: 'price_high_low', name: 'Price: High to Low' },
    { key: 'newest', name: 'Newest Arrivals' },
    { key: 'rating', name: 'Customer Rating' },
    { key: 'discount', name: 'Discount: High to Low' },
];

export default function CategoryFilter() {
    const min_price = 5;
    const max_price = 1240;
    const [value, setValue] = useState([min_price, max_price]);

    const formatPrice = (price: number) => {
        return price === max_price
            ? `$${price.toLocaleString()}+`
            : `$${price.toLocaleString()}`;
    };

    return (
        <section className="py-10 lg:py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-[240px_1fr] gap-8">
                    <div></div>
                    <header className="mb-6 flex items-center justify-between space-y-2">
                        <h2 className="font-heading text-2xl lg:text-3xl">
                            New Season Products
                        </h2>
                        <Select defaultValue={sortFilters[0].key}>
                            <SelectTrigger>
                                <span className="text-sm text-muted-foreground">
                                    Sort by
                                </span>
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:inset-e-2">
                                {sortFilters.map((item, i) => (
                                    <SelectItem key={item.key} value={item.key}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </header>
                </div>
                <div className="grid grid-cols-[240px_1fr] gap-8">
                    <div className="space-y-10">
                        {/* Filter group */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                Keywords
                            </div>
                            <Input type="text" placeholder="Search..." />
                        </div>

                        {/* Filter group */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span className="flex justify-between text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Price
                                </span>

                                <Label className="text-xs">
                                    From {formatPrice(value[0])} to{' '}
                                    {formatPrice(value[1])}
                                </Label>
                            </div>
                            <div className="*:not-first:mt-3">
                                <Slider
                                    value={value}
                                    onValueChange={setValue}
                                    min={min_price}
                                    max={max_price}
                                    aria-label="Price range slider"
                                />
                            </div>
                        </div>

                        {/* Filter group */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                Categories
                            </div>
                            <div className="space-y-3">
                                {categories.map((item, i) => (
                                    <div className="flex items-center gap-2">
                                        <Checkbox id={`category-${i}`} />
                                        <Label
                                            htmlFor={`category-${i}`}
                                            className="text-muted-foreground"
                                        >
                                            {item.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filter group */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                Colours
                            </div>
                            <fieldset>
                                <RadioGroup
                                    className="flex flex-col gap-3"
                                    defaultValue="Blue"
                                >
                                    {colorFilters.map((item, i) => (
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem
                                                id={`color-${i}`}
                                                value={item.name}
                                                aria-label="Blue"
                                                className={cn(
                                                    'size-4',
                                                    item.classNames,
                                                )}
                                            />
                                            <Label
                                                htmlFor={`color-${i}`}
                                                className="text-muted-foreground"
                                            >
                                                {item.name}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </fieldset>
                        </div>

                        {/* Filter group */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                Sizes
                            </div>
                            <div className="space-y-3">
                                {sizes.map((item, i) => (
                                    <div className="flex items-center gap-2">
                                        <Checkbox id={`size-${i}`} />
                                        <Label
                                            htmlFor={`size-${i}`}
                                            className="text-muted-foreground"
                                        >
                                            {item.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                            {products.map((product, i) => (
                                <Product key={i} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const Product = ({ product }: { product: Product }) => (
    <Link href="#" className="group">
        <figure className="relative aspect-9/16 w-full overflow-hidden object-cover">
            <img
                className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                src={product.image}
                alt={product.title}
            />
        </figure>
        <div className="mt-3 space-y-0.5">
            <p className="font-medium">{product.title}</p>
            <p className="text-muted-foreground">{product.price}</p>
        </div>
    </Link>
);
