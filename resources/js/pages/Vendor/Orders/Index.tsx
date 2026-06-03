// resources/js/Pages/Vendor/Orders/Index.tsx
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { DataTableCommandes } from '../Statistics/Avanced/data-table-commandes';
import type { CommandeRow } from '../Statistics/Avanced/data-table-commandes';

interface Props {
    commandes: {
        data: CommandeRow[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export default function OrdersIndex({ commandes }: Props) {
    return (
        <MainLayout>
            <Head title="Commandes" />
            <div className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">
                    Commandes
                </h1>
                <DataTableCommandes commandes={commandes} />
            </div>
        </MainLayout>
    );
}
