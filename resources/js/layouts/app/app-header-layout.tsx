import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppHeader } from '@/components/layouts/header/AppHeader';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
