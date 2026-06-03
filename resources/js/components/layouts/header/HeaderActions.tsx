import { usePage } from '@inertiajs/react';
import AppearanceToogle from '@/components/appearance-toogle';
import SearchExperience from '@/components/search-my-input';
import { CartButton } from './CartButton';
import { NotificationsDropdown } from './NotificationsDropdown';
import { RegionSelectorForm } from './RegionSelectorForm';

export function HeaderActions() {
    const { auth } = usePage().props;

    const isCartPage = route().current('cart.index');

    return (
        <>
            {/* Search */}
            <div className="hidden md:block">
                <SearchExperience />
            </div>

            {/* Region & Language Selector */}
            <RegionSelectorForm />

            {/* Theme Toggle */}
            <AppearanceToogle />

            {/* Cart - Visible pour tous */}
            {!isCartPage && <CartButton />}

            {/* Notifications - Visible uniquement pour utilisateurs connectés */}
            {auth.user && <NotificationsDropdown />}
        </>
    );
}
