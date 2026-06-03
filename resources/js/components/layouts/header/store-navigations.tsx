'use client';

import { Link } from '@inertiajs/react';
import { HeartIcon, MenuIcon, SearchIcon, ShoppingBag } from 'lucide-react';
import * as React from 'react';

import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    BagIcon,
    BeltIcon,
    HatIcon,
    JewelryIcon,
    OtherIcon,
    SunglassesIcon,
} from './icon';

type ListItemType = {
    title: string;
    href?: string;
    description?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const accessoriesMenuItems: ListItemType[] = [
    {
        title: 'Bags',
        href: '#',
        icon: BagIcon,
    },
    {
        title: 'Jewelry',
        href: '#',
        icon: JewelryIcon,
    },
    {
        title: 'Sunglasses',
        href: '#',
        icon: SunglassesIcon,
    },
    {
        title: 'Hats & Beanies',
        href: '#',
        icon: HatIcon,
    },
    {
        title: 'Belts',
        href: '#',
        icon: BeltIcon,
    },
    {
        title: 'All  Accessories',
        href: '#',
        icon: OtherIcon,
    },
];

const collectionItems = [
    {
        title: 'Trends',
        href: '#',
        description: "Discover this summer's trendy products.",
    },
    {
        title: 'Best Sellers',
        href: '#',
        description: "We've collected the best-selling products for you.",
    },
    {
        title: 'New Arrivals',
        href: '#',
        description: 'Discover the most favorited products.',
    },
];

export default function NavigationMenuStore({ breadcrumbs = [] }: Props) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <header>
                <div className="flex grid-cols-3 items-center justify-between p-4">
                    {/* left content and log */}
                    <Link
                        href={dashboard()}
                        className="flex items-center gap-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* main navigation */}
                    <NavigationMenu className="hidden lg:block">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Collections
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-0 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="#"
                                                    className="block space-y-2"
                                                    onClick={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    <img
                                                        src="/images/products/list1.png"
                                                        alt="..."
                                                        className="aspect-4/3 w-96 rounded object-cover"
                                                    />
                                                    <div className="space-y-1">
                                                        <div className="text-sm leading-none font-medium">
                                                            Timeless Classics
                                                        </div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                            Elevate your style
                                                            with essentials
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        {collectionItems.map((item) => (
                                            <Link
                                                href={`${item.href}`}
                                                className="gap-2 space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <div className="text-sm leading-none font-medium">
                                                    {item.title}
                                                </div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            </Link>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Accessories
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-100 list-none grid-cols-2 gap-3 lg:w-75">
                                        {accessoriesMenuItems.map((item) => (
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={`${item.href}`}
                                                    className="flex justify-center gap-2 space-y-1 rounded-md p-3 text-center leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    onClick={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    {item.icon ? (
                                                        <item.icon className="mx-auto size-8 text-muted-foreground" />
                                                    ) : null}
                                                    <span className="block text-sm leading-none font-medium">
                                                        {item.title}
                                                    </span>
                                                </Link>
                                            </NavigationMenuLink>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="#"
                                        className={navigationMenuTriggerStyle()}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Women
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="#"
                                        className={navigationMenuTriggerStyle()}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Men
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* right content */}
                    <div className="flex items-center gap-1">
                        <Button variant="ghost">
                            <SearchIcon />
                        </Button>
                        <Button variant="ghost">
                            <HeartIcon />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            aria-label="Cart"
                        >
                            <ShoppingBag aria-hidden="true" />
                            <Badge className="absolute -top-1 left-full size-4 -translate-x-1/2 rounded-full p-0 text-[10px]">
                                4
                            </Badge>
                        </Button>
                        <div className="ms-3 flex items-center gap-1">
                            <Button variant="secondary">Sign in</Button>
                            <Button
                                variant="ghost"
                                onClick={() => setOpen(true)}
                                className="lg:hidden"
                            >
                                <MenuIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* for mobile navigation */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="space-y-4 overflow-auto p-4">
                    <div className="space-y-2">
                        <div className="font-medium">Collections</div>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="#"
                                    className="block space-y-2 rounded-md border p-3"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <img
                                        src="/images/products/list1.png"
                                        alt="..."
                                        className="aspect-4/3 w-96 rounded object-cover"
                                    />
                                    <div className="space-y-1">
                                        <div className="text-sm leading-none font-medium">
                                            Timeless Classics
                                        </div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            Elevate your style with essentials
                                        </p>
                                    </div>
                                </Link>
                            </li>
                            {collectionItems.map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={`${item.href}`}
                                        className="block gap-2 space-y-1 leading-none no-underline outline-none"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <div className="text-sm leading-none font-medium">
                                            {item.title}
                                        </div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="font-medium">Accessories</div>
                        <ul className="grid list-none grid-cols-2 gap-2">
                            {accessoriesMenuItems.map((item, i) => (
                                <Link
                                    key={i}
                                    href={`${item.href}`}
                                    className="flex flex-col justify-center gap-2 space-y-1 rounded-md bg-muted/50 p-3 text-center leading-none no-underline transition-colors"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    {item.icon ? (
                                        <item.icon className="mx-auto size-8 text-muted-foreground" />
                                    ) : null}
                                    <span className="block text-sm leading-none font-medium">
                                        {item.title}
                                    </span>
                                </Link>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Link
                            href="#"
                            className="flex flex-col justify-center gap-2 space-y-1 rounded-md bg-muted/50 p-3 text-center leading-none no-underline transition-colors"
                        >
                            Men
                        </Link>

                        <Link
                            href="#"
                            className="flex flex-col justify-center gap-2 space-y-1 rounded-md bg-muted/50 p-3 text-center leading-none no-underline transition-colors"
                        >
                            Women
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>

            {/* fake content */}
            <main className="min-h-125 bg-muted/50"></main>
            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="border-b border-border/40">
                    <div className="container mx-auto flex h-10 items-center px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
