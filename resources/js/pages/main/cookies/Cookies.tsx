import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import blog from '@/routes/tenant/blog';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blog',
        href: blog.index().url,
    },
];

export default function Cookies() {
    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactez-nous" />
            <section className="py-14 lg:py-20"></section>
        </MainLayout>
    );
}
