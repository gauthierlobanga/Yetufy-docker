// resources/js/components/navigation/ProductsMenuContent.tsx
import { usePage } from '@inertiajs/react';
import { ProductsMegaMenu } from './ExplorerCategory';

export function ProductCategoryMenuContent() {
    const { megaMenuCategories } = usePage().props as any;

    if (!megaMenuCategories || megaMenuCategories.length === 0) {
        return null;
    }

    return <ProductsMegaMenu categories={megaMenuCategories} />;
}
