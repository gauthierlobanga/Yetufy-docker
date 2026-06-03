'use client';

import { Info, ShoppingCartIcon } from 'lucide-react';
import React from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '../ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { CartListItem } from './cart-item';
import { cartItems } from './data';

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
