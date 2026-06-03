/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChevronRight, SendIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CTASection() {
    return (
        <section className="py-10 lg:py-16">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-4 flex justify-center">
                    <Badge variant="secondary">Get Started</Badge>
                </div>

                <div className="mx-auto mb-8 max-w-3xl text-center">
                    <h2 className="mb-6 font-heading text-4xl text-balance lg:text-5xl lg:leading-14">
                        Your Vistaing journey starts{' '}
                        <span className="font-serif italic">right now</span>
                    </h2>
                    <p className="mx-auto max-w-xl text-balance text-muted-foreground">
                        Book a free 30 min call and see how we turn property
                        views into serious buyers
                    </p>
                </div>

                {/* CTA Button */}
                <div className="mb-16 flex justify-center">
                    <Button size="lg" className="rounded-full">
                        <SendIcon />
                        Get Started
                    </Button>
                </div>

                {/* Property Images Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1444084316824-dc26d6657664?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Modern mountain house with stone and glass exterior"
                            className="object-cover"
                        />
                    </div>
                    <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Dubai skyline at sunset with luxury properties"
                            className="object-cover"
                        />
                    </div>
                    <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1667718297886-64ed2c454bcd?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Modern waterfront property with palm trees"
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
