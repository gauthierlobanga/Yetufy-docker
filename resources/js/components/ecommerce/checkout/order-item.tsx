/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card } from '@/components/ui/card';

interface OrderItemProps {
    image: string;
    name: string;
    quantity: number;
    price: string;
}

const OrderItem = ({ image, name, quantity, price }: OrderItemProps) => {
    return (
        <div className="mb-3 flex flex-row items-center justify-between gap-4 rounded-lg border-none bg-muted/50 pe-4 shadow-none">
            <img
                src={image}
                alt={name}
                className="aspect-square w-20 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
                <h3 className="font-medium">{name}</h3>
            </div>
            <div className="flex shrink-0 items-center gap-6">
                <span className="text-muted-foreground">{quantity} pc</span>
                <span className="font-medium">{price}</span>
            </div>
        </div>
    );
};

export default OrderItem;
