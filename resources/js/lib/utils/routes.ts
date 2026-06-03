// resources/js/utils/routes.ts
import { useTenant } from "@/hooks/useTenant";

/**
 * Retourne le nom complet de la route en fonction du contexte (central ou tenant).
 * Exemple: tenantRoute('login') => 'tenant.login' si isTenant === true, sinon 'login'.
 */
export function useTenantRoute() {
    const { tenantRoutePrefix } = useTenant();

    return function (routeName: string, params?: any) {
        return route(tenantRoutePrefix + routeName, params ?? undefined);
    };
}
