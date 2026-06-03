import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const product = {
    title: 'White T-Shirt',
    image: '/images/products/list1.png',
    price: '$29.00',
    badge: 'New Season',
    rating: 4,
    colors: [
        'rgb(119 119 218)',
        'rgb(218 119 163)',
        'rgb(125 376 306)',
        'rgb(255 255 255)',
    ],
};

export type Product = typeof product;

export default function Page() {
    return (
        <div className="mx-auto max-w-80 py-10">
            <Link href="#" className="group">
                <figure className="relative aspect-square w-full overflow-hidden rounded-md object-cover">
                    <Image
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                        src={product.image}
                        alt={product.title}
                    />
                    <Badge
                        variant="secondary"
                        className="absolute end-2 top-2 bg-white/30 dark:bg-black/30"
                    >
                        {product.badge}
                    </Badge>
                    <div className="absolute start-3 bottom-3 flex items-center justify-between gap-2">
                        {product.colors.map((color, i) => (
                            <span
                                key={i}
                                className="block size-3 rounded-full"
                                style={{ backgroundColor: color }}
                            ></span>
                        ))}
                    </div>
                </figure>
                <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                        <p className="font-medium">{product.title}</p>
                        <p className="text-muted-foreground">{product.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {Array(5)
                            .fill('')
                            .map((_, i) =>
                                i < product.rating ? (
                                    <Star
                                        key={i}
                                        className="size-4 fill-amber-500 text-amber-500"
                                    />
                                ) : (
                                    <Star
                                        key={i}
                                        className="size-4 text-muted-foreground"
                                    />
                                ),
                            )}
                        <span className="ms-1 text-xs text-muted-foreground">
                            (4.5 out of 5)
                        </span>
                    </div>
                </div>
                <Button variant="secondary" className="mt-4 w-full">
                    Add to Cart
                </Button>
            </Link>
        </div>
    );
}

const Product = ({ product }: { product: Product }) => (
    <Link href="#" className="group">
        <figure className="relative aspect-square w-full overflow-hidden rounded-md object-cover">
            <Image
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                src={product.image}
                alt={product.title}
            />
            <Badge
                variant="secondary"
                className="absolute end-2 top-2 bg-white/30 dark:bg-black/30"
            >
                {product.badge}
            </Badge>
            <div className="absolute start-3 bottom-3 flex items-center justify-between gap-2">
                {product.colors.map((color, i) => (
                    <span
                        key={i}
                        className="block size-3 rounded-full"
                        style={{ backgroundColor: color }}
                    ></span>
                ))}
            </div>
        </figure>
        <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-1">
                <p className="font-medium">{product.title}</p>
                <p className="text-muted-foreground">{product.price}</p>
            </div>
            <div className="flex items-center gap-1">
                {Array(5)
                    .fill('')
                    .map((_, i) =>
                        i < product.rating ? (
                            <Star
                                key={i}
                                className="size-4 fill-amber-500 text-amber-500"
                            />
                        ) : (
                            <Star
                                key={i}
                                className="size-4 text-muted-foreground"
                            />
                        ),
                    )}
                <span className="ms-1 text-xs text-muted-foreground">
                    (4.5 out of 5)
                </span>
            </div>
        </div>
        <Button variant="secondary" className="mt-4 w-full">
            Add to Cart
        </Button>
    </Link>
);
