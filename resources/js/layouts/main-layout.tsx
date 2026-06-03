/* eslint-disable @typescript-eslint/no-unused-vars */
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import type { AppLayoutProps } from '@/types';
import FooterSection from './app/app-footer';

export default function MainLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const { subscription, tenantTheme, isTenant } = usePage().props as any;

    useEffect(() => {
        if (subscription?.is_expired) {
            window.location.href = route('tenant.subscription.required');
        }
    }, [subscription]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand={true}
                duration={5000}
            />
            <FooterSection />
        </AppLayoutTemplate>
    );
}
