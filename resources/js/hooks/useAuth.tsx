/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/hooks/useAuth.js
import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

// Définition des props pour le composant Can
interface CanProps {
    permission?: string | string[];
    roles: string | string[];
    model?: string;
    action?: string;
    resource?: {
        id?: number;
        user_id?: number;
        created_by?: number;
        author_id?: number;
        [key: string]: any;
    };
}

export function useAuth() {
    const { auth, flash } = usePage().props;

    // Mémorisation pour performances optimales
    const permissionsSet = useMemo(
        () => new Set(auth?.permissions || []),
        [auth?.permissions],
    );

    const rolesSet = useMemo(() => new Set(auth?.roles || []), [auth?.roles]);

    const user = useMemo(() => auth?.user, [auth?.user]);

    // Vérification d'une permission spécifique
    const can = useCallback(
        (permission: string | any[]) => {
            if (!user) {
                return false;
            }

            // Super-admin bypass (optionnel selon ta sécurité)
            if (rolesSet.has('super_admin')) {
                return true;
            }

            if (Array.isArray(permission)) {
                return permission.some((p) => permissionsSet.has(p));
            }

            return permissionsSet.has(permission);
        },
        [user, permissionsSet, rolesSet],
    );

    // Vérification nécessitant TOUTES les permissions
    const canAll = useCallback(
        (permissions: any[]) => {
            if (!user) {
                return false;
            }

            if (rolesSet.has('super_admin')) {
                return true;
            }

            return permissions.every((p) => permissionsSet.has(p));
        },
        [user, permissionsSet, rolesSet],
    );

    // Vérification d'un rôle spécifique
    const isRole = useCallback(
        (role: string | any[]) => {
            if (!user) {
                return false;
            }

            if (Array.isArray(role)) {
                return role.some((r) => rolesSet.has(r));
            }

            return rolesSet.has(role);
        },
        [user, rolesSet],
    );

    // Vérification de rôle avec OR
    const hasAnyRole = useCallback(
        (roles: any[]) => {
            if (!user) {
                return false;
            }

            return roles.some((r: string) => rolesSet.has(r));
        },
        [user, rolesSet],
    );

    // Vérification de permission sur ressource spécifique
    const canOnResource = useCallback(
        (permission: string, resourceId: any, resourceType = 'general') => {
            if (!user) {
                return false;
            }

            if (rolesSet.has('super_admin')) {
                return true;
            }

            // Format: "edit product:123"
            const specificPermission = `${permission} ${resourceType}:${resourceId}`;

            if (permissionsSet.has(specificPermission)) {
                return true;
            }

            // Wildcard: "edit product:*"
            const wildcardPermission = `${permission} ${resourceType}:*`;

            if (permissionsSet.has(wildcardPermission)) {
                return true;
            }

            return permissionsSet.has(permission);
        },
        [user, permissionsSet, rolesSet],
    );

    // Vérification si l'utilisateur est propriétaire d'une ressource
    const isOwner = useCallback(
        (resource: {
            user_id: number;
            created_by: number;
            author_id: number;
        }) => {
            if (!user || !resource) {
                return false;
            }

            if (rolesSet.has('super_admin')) {
                return true;
            }

            // Pattern standard: la ressource a un user_id ou created_by
            return (
                resource.user_id === user.id ||
                resource.created_by === user.id ||
                resource.author_id === user.id
            );
        },
        [user, rolesSet],
    );

    // Récupération des permissions sous forme de liste
    const getPermissions = useCallback(() => {
        return Array.from(permissionsSet);
    }, [permissionsSet]);

    // Récupération des rôles sous forme de liste
    const getRoles = useCallback(() => {
        return Array.from(rolesSet);
    }, [rolesSet]);

    return {
        user,
        isAuthenticated: !!user,
        avatar: auth?.avatar,
        permissions: getPermissions(),
        roles: getRoles(),
        can,
        canAll,
        canOnResource,
        isRole,
        hasAnyRole,
        isOwner,
        flash: flash || {},
    };
}
