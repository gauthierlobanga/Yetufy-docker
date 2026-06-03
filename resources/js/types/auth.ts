//resources/js/types/auth.ts
export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    avatar_url?: string | null;
    permissions: string[];
    roles: string[];
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

// Ajout des types pour les permissions
export type PermissionsMap = Record<string, Record<string, boolean>>;

export type Auth = {
    [x: string]: any;
    user: User | null;  // Peut être null si non connecté
    permissions: string[];  // Liste plate des permissions
    permissions_map: PermissionsMap;  // Structure hiérarchique par modèle
    roles: string[];  // Liste des rôles
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
