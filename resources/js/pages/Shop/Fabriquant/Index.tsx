import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';

export default function Fabriquant() {
    return (
        <MainLayout>
            <Head title="Fabriquants" />
            <section className="py-14 lg:py-20">Fabriquants</section>
        </MainLayout>
    );
}
