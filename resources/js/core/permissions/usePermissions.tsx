/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/core/permissions/usePermissions.ts
import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';
import type { Auth, User, PermissionsMap } from '@/types/auth';

interface ResourceInterface {
    id?: number;
    user_id?: number;
    created_by?: number;
    author_id?: number;
    [key: string]: any;
}

interface AbilityActions {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    restore: boolean;
    forceDelete: boolean;
    viewAny: boolean;
    replicate: boolean;
    reorder: boolean;
}

interface AbilityMap {
    [key: string]:
        | AbilityActions
        | { export: boolean; import: boolean; viewDashboard: boolean };
    global: {
        export: boolean;
        import: boolean;
        viewDashboard: boolean;
    };
}

/**
 * Hook optimisé pour gérer 500+ permissions
 * Utilise Set pour recherche O(1) et Map pour accès rapide
 */
export function usePermissions() {
    // Typage correct avec la structure Auth
    const { auth } = usePage().props as { auth: Auth };

    // Optimisation: Conversion en Set pour recherche O(1)
    const permissionsSet = useMemo(
        () => new Set(auth?.permissions || []),
        [auth?.permissions],
    );

    // Map hiérarchique pour accès rapide par modèle
    const permissionsMap = useMemo(
        () => auth?.permissions_map || {},
        [auth?.permissions_map],
    );

    const user = auth?.user;
    const roles = useMemo(() => new Set(auth?.roles || []), [auth?.roles]);

    /**
     * Vérification directe de permission (format "Action:Model")
     * Performance: O(1) grâce au Set
     */
    const can = useCallback(
        (permission: string | string[]): boolean => {
            if (!user) {
                return false;
            }

            // Super-admin bypass
            if (roles.has('super_admin')) {
                return true;
            }

            // Vérification multiple
            if (Array.isArray(permission)) {
                return permission.some((p) => permissionsSet.has(p));
            }

            return permissionsSet.has(permission);
        },
        [user, permissionsSet, roles],
    );

    /**
     * Vérification par modèle et action
     * Exemple: canOnModel('Post', 'View') => vérifie 'View:Post'
     */
    const canOnModel = useCallback(
        (model: string, action: string): boolean => {
            if (!user) {
                return false;
            }

            if (roles.has('super_admin')) {
                return true;
            }

            const permission = `${action} ${model}`;

            return permissionsSet.has(permission);
        },
        [user, permissionsSet, roles],
    );

    /**
     * Vérification multiple sur le même modèle
     * Exemple: canOnModelAll('Post', ['View', 'Create', 'Update'])
     */
    const canOnModelAll = useCallback(
        (model: string, actions: string[]): boolean => {
            if (!user) {
                return false;
            }

            if (roles.has('super_admin')) {
                return true;
            }

            return actions.every((action) => {
                const permission = `${action} ${model}`;

                return permissionsSet.has(permission);
            });
        },
        [user, permissionsSet, roles],
    );

    /**
     * Récupère toutes les permissions d'un modèle
     * Exemple: getModelPermissions('Post') => ['View', 'Create', 'Update', 'Delete']
     */
    const getModelPermissions = useCallback(
        (model: string): string[] => {
            const modelPermissions = permissionsMap[model];

            if (!modelPermissions) {
                return [];
            }

            return Object.keys(modelPermissions);
        },
        [permissionsMap],
    );

    /**
     * Vérification de permission avec ressource spécifique
     */
    const canOnResource = useCallback(
        (
            model: string,
            action: string,
            resource: ResourceInterface,
        ): boolean => {
            if (!user) {
                return false;
            }

            // Vérification permission de base
            if (!canOnModel(model, action)) {
                return false;
            }

            // Vérification ownership
            const isOwner =
                resource &&
                (resource.user_id === user.id ||
                    resource.created_by === user.id ||
                    resource.author_id === user.id);

            // Permission spéciale pour ses propres ressources
            const ownPermission = `${action}:own:${model}`;

            if (isOwner && permissionsSet.has(ownPermission)) {
                return true;
            }

            return true;
        },
        [user, canOnModel, permissionsSet],
    );

    /**
     * Vérification basée sur les rôles
     */
    const isRole = useCallback(
        (role: string | string[]): boolean => {
            if (!user) {
                return false;
            }

            if (Array.isArray(role)) {
                return role.some((r) => roles.has(r));
            }

            return roles.has(role);
        },
        [user, roles],
    );

    /**
     * Vérifie si l'utilisateur a au moins un des rôles
     */
    const hasAnyRole = useCallback(
        (roleList: string[]): boolean => {
            if (!user) {
                return false;
            }

            return roleList.some((role) => roles.has(role));
        },
        [user, roles],
    );

    /**
     * Vérifications rapides pré-calculées pour les actions courantes
     */
    const ability = useMemo((): AbilityMap => {
        if (!user) {
            return {
                global: { export: false, import: false, viewDashboard: false },
            } as AbilityMap;
        }

        const abilities: any = {};
        const models = [
            'Post',
            'Product',
            'User',
            'Order',
            'Category',
            'Client',
        ];

        models.forEach((model) => {
            abilities[model.toLowerCase()] = {
                view: canOnModel(model, 'View'),
                create: canOnModel(model, 'Create'),
                update: canOnModel(model, 'Update'),
                delete: canOnModel(model, 'Delete'),
                restore: canOnModel(model, 'Restore'),
                forceDelete: canOnModel(model, 'ForceDelete'),
                viewAny: canOnModel(model, 'ViewAny'),
                replicate: canOnModel(model, 'Replicate'),
                reorder: canOnModel(model, 'Reorder'),
            };
        });

        // Permissions globales
        abilities.global = {
            export: permissionsSet.has('Export Data'),
            import: permissionsSet.has('Import Data'),
            viewDashboard: permissionsSet.has('View Dashboard'),
        };

        return abilities;
    }, [user, canOnModel, permissionsSet]);

    /**
     * Debug: Affiche toutes les permissions dans la console
     */
    const debug = useCallback((): void => {
        console.group('🔐 User Permissions Debug');
        console.log('User:', user?.email);
        console.log('User ID:', user?.id);
        console.log('Roles:', Array.from(roles));
        console.log('Total Permissions:', permissionsSet.size);
        console.log('Permissions List:', Array.from(permissionsSet));
        console.log('Permissions Map:', permissionsMap);
        console.groupEnd();
    }, [user, roles, permissionsSet, permissionsMap]);

    return {
        // Données utilisateur
        user,
        isAuthenticated: !!user,

        // Permissions et rôles sous forme de tableaux
        roles: Array.from(roles),
        permissions: Array.from(permissionsSet),

        // Méthodes principales
        can, // Vérification directe: can('View:Post')
        canOnModel, // Vérification par modèle: canOnModel('Post', 'View')
        canOnModelAll, // Vérification multiple: canOnModelAll('Post', ['View', 'Create'])
        canOnResource, // Vérification avec ressource
        isRole,
        hasAnyRole,

        // Abilities pré-calculées pour performance
        ability,

        // Utilitaires
        getModelPermissions,
        debug,
    };
}

// Helper pour utilisation hors composant React
export const createPermissionsHelper = (auth: Auth) => {
    const permissionsSet = new Set(auth?.permissions || []);
    const rolesSet = new Set(auth?.roles || []);
    const user = auth?.user;

    return {
        user,
        isAuthenticated: !!user,
        can: (permission: string | string[]): boolean => {
            if (!user) {
                return false;
            }

            if (rolesSet.has('super_admin')) {
                return true;
            }

            if (Array.isArray(permission)) {
                return permission.some((p) => permissionsSet.has(p));
            }

            return permissionsSet.has(permission);
        },
        isRole: (role: string | string[]): boolean => {
            if (!user) {
                return false;
            }

            if (Array.isArray(role)) {
                return role.some((r) => rolesSet.has(r));
            }

            return rolesSet.has(role);
        },
    };
};
