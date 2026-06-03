import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/sonner';
import type { AppLayoutProps } from '@/types';
import TenantFooterSection from './app/app-footer-tenant';
import AppHeaderTenantLayout from './app/app-header-tenant-layout';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppShell variant="header">
        <AppHeaderTenantLayout
            children={undefined}
            breadcrumbs={breadcrumbs}
            {...props}
        />
        <AppContent variant="header">{children}</AppContent>
        {/* Toaster pour les notifications */}
        <Toaster
            position="top-right"
            richColors
            closeButton
            expand={true}
            duration={5000}
        />
        <TenantFooterSection />
    </AppShell>
);
