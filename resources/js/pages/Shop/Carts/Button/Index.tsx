'use client';

import { Info, ShoppingCartIcon } from 'lucide-react';
import { XIcon } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ShoppingCartSheet() {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <div className="flex h-180 items-center justify-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <div className="text-center">
                        <Button
                            variant="outline"
                            size="icon"
                            className="relative"
                        >
                            <ShoppingCartIcon />
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                3
                            </span>
                        </Button>
                    </div>
                </SheetTrigger>
                <SheetContent side="right" className="flex w-full flex-col">
                    <div className="border-b p-4">
                        <h3 className="font-bold lg:text-lg">Shopping Cart</h3>
                    </div>
                    <div className="grow overflow-y-auto p-4 pt-0">
                        <div className="divide-y *:py-4">
                            {cartItems.map((item, key) => (
                                <CartListItem key={key} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="flex flex-col space-y-6 rounded-lg bg-muted/50 p-6">
                        <div className="space-y-4">
                            <h2 className="font-semibold">Order summary</h2>

                            <div className="flex justify-between text-sm">
                                <p>Subtotal</p>
                                <p className="font-medium">$255.00</p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <p>Shipping estimate</p>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="ml-1 size-3 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Delivery in 10 days is planned.
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <p className="font-medium">$5.00</p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <p>Tax estimate</p>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="ml-1 size-3 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                There is a country specific
                                                taxation system.
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <p className="font-medium">$4.50</p>
                            </div>

                            <div className="flex justify-between border-t border-gray-200 pt-4 text-sm font-medium">
                                <p>Order total</p>
                                <p>$264.50</p>
                            </div>
                        </div>

                        <Button className="w-full">Checkout</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export function CartListItem({ item }: { item: CartItem }) {
    return (
        <div key={item.id} className="flex items-start space-x-4">
            <div className="relative shrink-0">
                <img
                    src={item.image}
                    className="aspect-square rounded-md object-cover"
                    width={60}
                    height={60}
                    alt={item.title}
                    //   unoptimized
                />
            </div>

            <div className="flex-1">
                <div className="flex justify-between">
                    <div className="space-y-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <span className="text-xs">
                            {item.variant} | {item.size}
                        </span>
                        <p className="text-sm">{item.price}</p>
                    </div>

                    <div className="flex flex-col space-x-4 sm:flex-row">
                        <Select defaultValue={String(item.quantity)}>
                            <SelectTrigger>
                                <SelectValue placeholder="1" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" size="icon">
                            <XIcon size={18} />
                            <span className="sr-only">Remove item</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const cartItems: CartItem[] = [
    {
        id: 3,
        title: 'Classic Hoodie',
        price: '$45.00',
        variant: 'Black',
        size: 'Medium',
        quantity: 1,
        image: '/images/products/list1.png',
        in_stock: true,
    },
    {
        id: 4,
        title: 'Denim Jacket',
        price: '$80.00',
        variant: 'Blue',
        size: 'Large',
        quantity: 2,
        image: '/images/products/list2.png',
        in_stock: false,
    },
    {
        id: 5,
        title: 'Slim Fit Jeans',
        price: '$50.00',
        variant: 'Dark Wash',
        size: '32',
        quantity: 1,
        image: '/images/products/list3.png',
        in_stock: true,
    },
];

export type CartItem = {
    id: number;
    title: string;
    price: string;
    variant: string;
    size: string;
    quantity: number;
    image: string;
    in_stock: boolean;
};
