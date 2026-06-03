'use client';

import { Head } from '@inertiajs/react';
import { BookOpenIcon, Star } from 'lucide-react';
import { MarqueeEffect } from '@/components/animations/marquee-effect';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/layouts/main-layout';

export interface TestimonialCardProps {
    name: string;
    role: string;
    img?: string;
    description: React.ReactNode;
    className?: string;
    [key: string]: any;
}

const testimonials = [
    {
        name: 'Jordan Hayes',
        role: 'CTO at Quantum Innovations',
        img: 'https://randomuser.me/api/portraits/men/22.jpg',
        description:
            'Bundui completely transformed our workflow. The component system saved us weeks of custom coding and design work, letting the team focus on business logic instead of UI details.',
    },
    {
        name: 'Maya Rodriguez',
        role: 'Lead Developer at Skyline Digital',
        img: 'https://randomuser.me/api/portraits/women/33.jpg',
        description:
            'I was skeptical at first but Bundui exceeded expectations. Its accessibility features and responsive design are outstanding and it balances aesthetics with real functionality.',
    },
    {
        name: 'Ethan Park',
        role: 'Startup Founder at Elevate Labs',
        img: 'https://randomuser.me/api/portraits/men/32.jpg',
        description:
            'As a non-technical founder, Bundui was a game-changer for our MVP. We launched months ahead of schedule thanks to modular components that enabled rapid iteration.',
    },
    {
        name: 'Zoe Bennett',
        role: 'UX Architect at Fusion Systems',
        img: 'https://randomuser.me/api/portraits/women/44.jpg',
        description:
            "Bundui's attention to detail impressed us. The micro-interactions and animations give projects a polished feel, making it our go-to for tight-deadline client work.",
    },
    {
        name: 'Victor Nguyen',
        role: 'Product Lead at FinEdge',
        img: 'https://randomuser.me/api/portraits/men/55.jpg',
        description:
            'Our financial dashboard needed an overhaul and Bundui delivered. The data visualization components are both attractive and practical, and engagement metrics improved significantly.',
    },
    {
        name: 'Amara Johnson',
        role: 'Frontend Specialist at Nimbus Tech',
        img: 'https://randomuser.me/api/portraits/women/67.jpg',
        description:
            'The documentation is excellent. I implemented complex UI patterns in a few hours and the TypeScript support noticeably boosted productivity across the team.',
    },
    {
        name: 'Leo Tanaka',
        role: 'Creative Technologist at Prism Agency',
        img: 'https://randomuser.me/api/portraits/men/78.jpg',
        description:
            'Bundui strikes the right balance between flexibility and structure. We keep brand consistency while still crafting unique experiences that delight clients.',
    },
    {
        name: 'Sophia Martinez',
        role: 'E-commerce Director at StyleHub',
        img: 'https://randomuser.me/api/portraits/women/89.jpg',
        description:
            'Since adopting Bundui our conversion rates went up. The checkout components are optimized for both desktop and mobile, and dark mode was a customer favorite.',
    },
    {
        name: 'Aiden Wilson',
        role: 'Healthcare Solutions Architect',
        img: 'https://randomuser.me/api/portraits/men/92.jpg',
        description:
            'Accessibility features were crucial for our healthcare platform. Bundui helped us meet compliance with minimal extra work; its form components handle complex data entry gracefully.',
    },
    {
        name: 'Olivia Chen',
        role: 'EdTech Product Manager at LearnSphere',
        img: 'https://randomuser.me/api/portraits/women/29.jpg',
        description:
            "We needed a platform usable by students of all ages and abilities. Bundui's inclusive design principles made this possible, and interactive components boosted student engagement.",
    },
];

export function TestimonialCard({ item }: { item: TestimonialCardProps }) {
    return (
        <div className="mb-4 flex w-full cursor-pointer flex-col items-center justify-between gap-4 rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted">
            <div className="space-y-4 text-muted-foreground">
                <p>{item.description}</p>
                <div className="flex flex-row gap-1">
                    <Star className="size-4 fill-orange-500 text-orange-500" />
                    <Star className="size-4 fill-orange-500 text-orange-500" />
                    <Star className="size-4 fill-orange-500 text-orange-500" />
                    <Star className="size-4 fill-orange-500 text-orange-500" />
                    <Star className="size-4 fill-orange-500 text-orange-500" />
                </div>
            </div>

            <div className="flex w-full items-center justify-start gap-3">
                <Avatar>
                    <AvatarImage src={item.img} />
                </Avatar>

                <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
            </div>
        </div>
    );
}

export default function Testimonials() {
    return (
        <MainLayout>
            <Head />
            <section className="py-12 lg:py-20">
                <div className="container mx-auto px-4">
                    {/* Hero Section moderne */}
                    <section className="relative overflow-hidden bg-linear-to-br from-primary/20 via-primary/10 to-background py-20 lg:py-20">
                        <div className="bg-grid-pattern absolute inset-0 opacity-[0.03]" />
                        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl px-4 text-center">
                            <Badge
                                variant="secondary"
                                className="mb-4 px-4 py-1.5 text-sm"
                            >
                                <BookOpenIcon className="mr-2 h-3.5 w-3.5" />
                                Contactez-nous
                            </Badge>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                Découvrez nos derniers
                                <span className="mt-2 block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    articles et actualités
                                </span>
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                                Explorez nos conseils, tutoriels et actualités
                                sur le développement web, l'e-commerce et les
                                technologies modernes.
                            </p>
                        </div>
                    </section>
                    <div className="grid h-60 grid-cols-1 gap-4 overflow-hidden mask-t-from-80% mask-b-from-80% md:grid-cols-2 lg:h-150 lg:grid-cols-3">
                        {[
                            {
                                reverse: false,
                            },
                            {
                                reverse: true,
                            },
                            {
                                reverse: false,
                            },
                        ].map((mq, i) => (
                            <div>
                                <MarqueeEffect
                                    gap={8}
                                    direction="vertical"
                                    reverse={mq.reverse}
                                    speed={5}
                                    pauseOnHover={true}
                                >
                                    {testimonials
                                        .slice(i * 3, (i + 1) * 3)
                                        .map((testimonial, index) => (
                                            <TestimonialCard
                                                key={index}
                                                item={testimonial}
                                            />
                                        ))}
                                </MarqueeEffect>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
