import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
        {/* Toaster pour les notifications */}
        <Toaster
            position="top-right"
            richColors
            closeButton
            expand={true}
            duration={5000}
        />
    </AppLayoutTemplate>
);
