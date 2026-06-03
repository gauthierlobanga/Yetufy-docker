// resources/js/Pages/Shop/Cart/Index.tsx
import { Head } from '@inertiajs/react';
import CartContent from '@/components/ecommerce/cart/CartContent';
import MainLayout from '@/layouts/main-layout';

export default function CartIndex() {
    return (
        <MainLayout>
            <Head title="Panier" />
            <div className="container mx-auto py-8 max-w-7xl">
                <h1 className="mb-6 text-2xl font-bold">Votre panier</h1>
                <CartContent />
            </div>
        </MainLayout>
    );
}
