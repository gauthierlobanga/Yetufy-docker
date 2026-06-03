// resources/js/hooks/use-tenant.ts
import { usePage } from '@inertiajs/react';

export interface TenantContext {
    isTenant: boolean;
    tenant: {
        id: string;
        raison_sociale: string;
        slug: string;
        logo: string | null;
    } | null;
    tenantRoutePrefix: string;
}

export function useTenant(): TenantContext {
    const { props } = usePage<{
        isTenant?: boolean;
        tenant?: TenantContext['tenant'];
        tenantRoutePrefix?: string;
    }>();

    return {
        isTenant: props.isTenant ?? false,
        tenant: props.tenant ?? null,
        tenantRoutePrefix: props.tenantRoutePrefix ?? '',
    };
}
