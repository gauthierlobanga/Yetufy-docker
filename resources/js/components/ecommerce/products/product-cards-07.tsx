import { Link } from '@inertiajs/react';
import { HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

const product = {
    title: 'White T-Shirt',
    image: '/images/products/list1.png',
    price: '$29.00',
    badge: 'New Season',
};

export type Product = typeof product;

export default function ProductCard() {
    return (
        <div className="mx-auto max-w-80 py-10">
            <Product product={product} />
        </div>
    );
}

const Product = ({ product }: { product: Product }) => (
    <Link href="#" className="group">
        <figure className="relative aspect-square w-full overflow-hidden rounded-md object-cover">
            <img
                className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                src={product.image}
                alt={product.title}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 p-2 opacity-0 transition-opacity group-hover:opacity-100 lg:p-4">
                <ButtonGroup className="w-full">
                    <Button className="grow" variant="outline">
                        Add to Cart
                    </Button>
                    <Button variant="outline">
                        <HeartIcon />
                    </Button>
                </ButtonGroup>
            </div>
        </figure>
        <div className="mt-3 space-y-0.5">
            <p className="font-medium">{product.title}</p>
            <p className="text-muted-foreground">{product.price}</p>
        </div>
    </Link>
);
