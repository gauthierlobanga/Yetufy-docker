import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderTenantLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeaderTenantLayout
                breadcrumbs={breadcrumbs}
                children={undefined}
            />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
