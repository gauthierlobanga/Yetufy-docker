/* eslint-disable @stylistic/brace-style */
// resources/js/components/Permissions/Can.tsx
import type { ReactNode } from 'react';
import { memo } from 'react';
import { usePermissions } from './usePermissions';

// Définition des props pour le composant Can
interface CanProps {
    /** Permission directe au format "Action:Model" ex: "View:Post" */
    permission?: string | string[];
    /** Nom du modèle ex: "Post", "Product" */
    model?: string;
    /** Action à vérifier ex: "View", "Create", "Update" */
    action?: string;
    /** Ressource pour vérification d'ownership */
    resource?: {
        id?: number;
        user_id?: number;
        created_by?: number;
        author_id?: number;
        [key: string]: any;
    };
    /** Contenu à afficher si la permission est accordée */
    children: ReactNode;
    /** Contenu à afficher si la permission est refusée */
    fallback?: ReactNode;
}

/**
 * Composant optimisé avec memo pour éviter re-rendus inutiles
 *
 * @example
 * Utilisation avec permission directe
 * <Can permission="View:Post">
 *   <div>Contenu visible</div>
 * </Can>
 *
 * @example
 * Utilisation avec modèle et action
 * <Can model="Post" action="View">
 *   <div>Contenu visible</div>
 * </Can>
 *
 * @example
 * Avec vérification d'ownership
 * <Can model="Post" action="Update" resource={post}>
 *   <button>Modifier</button>
 * </Can>
 */
export const Can = memo<CanProps>(
    ({ permission, model, action, resource, children, fallback = null }) => {
        const { can, canOnModel, canOnResource } = usePermissions();

        let hasAccess = false;

        // Mode 1: Permission directe
        if (permission) {
            hasAccess = can(permission);
        }

        // Mode 2: Modèle + Action (recommandé pour tes policies)
        else if (model && action) {
            if (resource) {
                hasAccess = canOnResource(model, action, resource);
            } else {
                hasAccess = canOnModel(model, action);
            }
        }

        return hasAccess ? <>{children}</> : <>{fallback}</>;
    },
);

Can.displayName = 'Can';

// Types pour CanAll
interface CanAllProps {
    /** Nom du modèle ex: "Post", "Product" */
    model: string;
    /** Liste des actions à vérifier (toutes doivent être vraies) */
    actions: string[];
    /** Contenu à afficher si toutes les permissions sont accordées */
    children: ReactNode;
    /** Contenu à afficher si une permission est refusée */
    fallback?: ReactNode;
}

/**
 * Version pour vérification multiple sur un modèle (toutes les actions requises)
 *
 * @example
 * <CanAll model="Post" actions={['View', 'Create', 'Update']}>
 *   <div>Accès complet aux articles</div>
 * </CanAll>
 */
export const CanAll = memo<CanAllProps>(
    ({ model, actions, children, fallback = null }) => {
        const { canOnModelAll } = usePermissions();

        return canOnModelAll(model, actions) ? (
            <>{children}</>
        ) : (
            <>{fallback}</>
        );
    },
);

CanAll.displayName = 'CanAll';

// Types pour CanRole
interface CanRoleProps {
    /** Rôle ou liste de rôles (un seul suffit) */
    roles: string | string[];
    /** Contenu à afficher si l'utilisateur a le rôle */
    children: ReactNode;
    /** Contenu à afficher si l'utilisateur n'a pas le rôle */
    fallback?: ReactNode;
}

/**
 * Version basée uniquement sur les rôles
 *
 * @example
 * <CanRole roles="admin">
 *   <div>Zone admin</div>
 * </CanRole>
 *
 * @example
 * <CanRole roles={['admin', 'manager']}>
 *   <div>Zone gestion</div>
 * </CanRole>
 */
export const CanRole = memo<CanRoleProps>(
    ({ roles, children, fallback = null }) => {
        const { hasAnyRole } = usePermissions();
        const rolesArray = Array.isArray(roles) ? roles : [roles];

        return hasAnyRole(rolesArray) ? <>{children}</> : <>{fallback}</>;
    },
);

CanRole.displayName = 'CanRole';

// Types pour CanOwn (propriétaire spécifique)
interface CanOwnProps {
    /** Nom du modèle */
    model: string;
    /** Action à vérifier */
    action: string;
    /** Ressource à vérifier (pour l'ownership) */
    resource: {
        id?: number;
        user_id?: number;
        created_by?: number;
        author_id?: number;
        [key: string]: any;
    };
    /** Contenu à afficher si l'utilisateur est propriétaire ou a la permission */
    children: ReactNode;
    /** Contenu à afficher si non autorisé */
    fallback?: ReactNode;
}

/**
 * Version spécialisée pour vérifier si l'utilisateur est propriétaire de la ressource
 *
 * @example
 * <CanOwn model="Post" action="Update" resource={post}>
 *   <button>Modifier mon article</button>
 * </CanOwn>
 */
export const CanOwn = memo<CanOwnProps>(
    ({ model, action, resource, children, fallback = null }) => {
        const { canOnResource } = usePermissions();

        return canOnResource(model, action, resource) ? (
            <>{children}</>
        ) : (
            <>{fallback}</>
        );
    },
);

CanOwn.displayName = 'CanOwn';
