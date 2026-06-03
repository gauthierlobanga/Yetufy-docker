import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';

export default function Seller() {
    return (
        <MainLayout>
            <Head title="Fournisseurs" />
            <section className="py-14 lg:py-20">Fournisseurs</section>
        </MainLayout>
    );
}
