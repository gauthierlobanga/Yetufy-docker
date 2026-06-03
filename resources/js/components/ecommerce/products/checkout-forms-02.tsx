import { Check, LoaderCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperSeparator,
    StepperTrigger,
} from '@/components/ui/stepper';
import DeliveryCard from './components/delivery-card';
import OrderItem from './components/order-item';
import OrderSummary from './components/order-summary';
import PaymentMethodCard from './components/payment-method-card';
import { orderItems, deliveryAddress, deliveryInfo } from './data';

const steps = [1, 2, 3, 4];

export default function CheckoutPage() {
    const ApplePayIcon = () => (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-apple size-6"
                viewBox="0 0 16 16"
            >
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
            </svg>
        </div>
    );

    return (
        <section className="py-10 lg:py-20">
            <div className="px-4 lg:px-6">
                <div className="mx-auto max-w-3xl">
                    <Stepper
                        defaultValue={2}
                        indicators={{
                            completed: <Check className="size-4" />,
                            loading: (
                                <LoaderCircleIcon className="size-4 animate-spin" />
                            ),
                        }}
                        className="mb-14 space-y-8"
                    >
                        <StepperNav>
                            {steps.map((step) => (
                                <StepperItem key={step} step={step}>
                                    <StepperTrigger>
                                        <StepperIndicator className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=inactive]:text-gray-500">
                                            {step}
                                        </StepperIndicator>
                                    </StepperTrigger>
                                    {steps.length > step && (
                                        <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>
                    </Stepper>
                </div>
                <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                    {/* Left Column */}
                    <div className="space-y-12">
                        {/* Order Details */}
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-heading text-xl">
                                    Order details
                                </h2>
                            </div>
                            <div>
                                {orderItems.map((item: any, index: any) => (
                                    <OrderItem key={index} {...item} />
                                ))}
                            </div>
                        </section>

                        {/* Delivery */}
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-heading text-xl">
                                    Delivery
                                </h2>
                                <Button variant="secondary" size="sm">
                                    Edit
                                </Button>
                            </div>
                            <DeliveryCard
                                address={deliveryAddress}
                                delivery={deliveryInfo}
                            />
                        </section>

                        {/* Payment Method */}
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-heading text-xl">
                                    Payment method
                                </h2>
                                <Button variant="secondary" size="sm">
                                    Edit
                                </Button>
                            </div>
                            <PaymentMethodCard
                                // eslint-disable-next-line react-hooks/static-components
                                icon={<ApplePayIcon />}
                                title="Apple Pay"
                                description="Swiftly make contactless payments with Apple Pay, ensuring a seamless and secure checkout experience."
                            />
                        </section>
                    </div>

                    {/* Right Column - Summary */}
                    <div>
                        <OrderSummary
                            subtotal="$153.98"
                            discount="$10.00"
                            delivery="Free"
                            total="$143.98"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
