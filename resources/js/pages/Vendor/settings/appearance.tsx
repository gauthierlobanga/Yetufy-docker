import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import SettingsLayout from '@/layouts/Vendor/settings/layout';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

export default function Appearance({ tenant }: { tenant: Tenant }) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={`Apparence - ${tenant.raison_sociale}`} />
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <SettingsLayout>
                    <div className="space-y-6">
                        <Heading
                            variant="small"
                            title="Apparence de la boutique"
                            description="Personnalisez le thème, les couleurs et la mise en page"
                        />
                        <AppearanceTabs />
                    </div>
                </SettingsLayout>
            </SidebarInset>
        </SidebarProvider>
    );
}
