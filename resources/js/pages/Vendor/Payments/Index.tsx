// resources/js/Pages/Vendor/Payments/Index.tsx
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import type { PaiementRow } from '../Statistics/Avanced/data-table-payments';
import { DataTablePaiements } from '../Statistics/Avanced/data-table-payments';

interface Props {
    paiements: {
        data: PaiementRow[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export default function PaymentsIndex({ paiements }: Props) {
    return (
        <MainLayout>
            <Head title="Paiements" />
            <div className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">
                    Paiements
                </h1>
                <DataTablePaiements paiements={paiements} />
            </div>
        </MainLayout>
    );
}
