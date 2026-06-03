<?php

use Illuminate\Support\Facades\Broadcast;

/**
 * Canaux de Broadcasting Reverb
 * Permet la communication en temps réel avec Reverb
 */

/**
 * Canal utilisateur personnel
 */
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (string) $user->getKey() === (string) $id;
});

/**
 * Canal tenant - Pour les vendeurs (propriétaires du shop)
 * Format: tenant.{tenantId}
 */
Broadcast::channel('tenant.{tenantId}', function ($user, $tenantId) {
    // Vérifier si l'utilisateur appartient à ce tenant
    if (function_exists('tenant') && tenant()?->id) {
        return (string) tenant()->id === (string) $tenantId;
    }

    // Ou vérifier via la relation
    return $user->tenants()->whereKey($tenantId)->exists();
});

/**
 * Canal tenant privé - Pour un utilisateur spécifique dans un tenant
 * Format: tenant.{tenantId}.users.{userId}
 */
Broadcast::channel('tenant.{tenantId}.users.{userId}', function ($user, $tenantId, $userId) {
    if ((string) $user->getKey() !== (string) $userId) {
        return false;
    }

    if (function_exists('tenant') && tenant()?->id) {
        return (string) tenant()->id === (string) $tenantId;
    }

    return $user->tenants()->whereKey($tenantId)->exists();
});

/**
 * Canal client - Pour les acheteurs individuels
 * Format: customer.{userId}
 */
Broadcast::channel('customer.{userId}', function ($user, $userId) {
    return (string) $user->getKey() === (string) $userId;
});

/**
 * Canal notifications client
 * Format: customer.{userId}.notifications
 */
Broadcast::channel('customer.{userId}.notifications', function ($user, $userId) {
    return (string) $user->getKey() === (string) $userId;
});

/**
 * Canal admin
 * Format: admin.{adminId}
 */
Broadcast::channel('admin.{adminId}', function ($user, $adminId) {
    if ((string) $user->getKey() !== (string) $adminId) {
        return false;
    }

    return $user->hasRole('super_admin');
});

/**
 * Canal pour les notifications du shop
 * Format: shop.{shopId}
 */
Broadcast::channel('shop.{shopId}', function ($user, $shopId) {
    return $user->tenants()->whereKey($shopId)->exists();
});

/**
 * Canal pour les notifications de produit
 * Format: product.{productId}
 */
Broadcast::channel('product.{productId}', function ($user) {
    // Tous les utilisateurs authentifiés peuvent écouter les produits
    return true;
});

/**
 * Canal public pour les notifications globales
 */
Broadcast::channel('notifications.global', function ($user) {
    return true;
});
