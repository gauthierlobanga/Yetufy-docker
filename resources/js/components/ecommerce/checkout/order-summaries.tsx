import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function OrderSummaryStatic() {
    const orderItems = [
        {
            id: 1,
            name: 'All In One Chocolate Combo',
            pack: 'Medium',
            quantity: 1,
            price: 50.0,
            image: '/images/products/list4.png',
        },
        {
            id: 2,
            name: 'Desire Of Hearts',
            pack: 'Large',
            quantity: 1,
            price: 50.0,
            image: '/images/products/list5.png',
        },
    ];

    const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
    const shipping = 2.0;
    const tax = 5.0;
    const total = subtotal + shipping + tax;

    return (
        <div className="py-10 lg:py-20">
            <div className="mx-auto max-w-5xl px-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="space-y-8">
                        <div>
                            <h1 className="mb-6 font-heading text-4xl text-balance sm:text-5xl lg:text-5xl">
                                Thank you for your purchase!
                            </h1>
                            <p className="text-base text-balance text-muted-foreground">
                                Your order will be processed within 24 hours
                                during working days. We will notify you by email
                                once your order has been shipped.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h2 className="font-bold">Billing address</h2>

                            <Separator />

                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="font-semibold">Name</dt>
                                    <dd className="col-span-2">Jane Smith</dd>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="font-semibold">Address</dt>
                                    <dd className="col-span-2">
                                        456 Oak St #3b, San Francisco,
                                        <br />
                                        CA 94102, United States
                                    </dd>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="font-semibold">Phone</dt>
                                    <dd className="col-span-2">
                                        +1 (415) 555-1234
                                    </dd>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="font-semibold">Email</dt>
                                    <dd className="col-span-2">
                                        jane.smith@email.com
                                    </dd>
                                </div>
                            </div>

                            <Button size="lg">Track Your Order</Button>
                        </div>
                    </div>

                    <Card className="border-0 bg-muted/50 shadow-none">
                        <CardHeader>
                            <CardTitle className="font-heading text-xl font-normal">
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="mb-6 grid grid-cols-3 gap-4">
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">
                                        Date
                                    </p>
                                    <p className="font-semibold">02 May 2023</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">
                                        Order Number
                                    </p>
                                    <p className="font-semibold">
                                        024-125478956
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">
                                        Payment Method
                                    </p>
                                    <p className="font-semibold">Mastercard</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-6">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="mb-1 font-semibold">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Pack: {item.pack}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right font-semibold">
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Sub Total</span>
                                    <span>${Number(subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>${Number(shipping).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Tax</span>
                                    <span>${Number(tax).toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="font-bold">Order Total</span>
                                <span className="font-bold">
                                    ${Number(total).toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
