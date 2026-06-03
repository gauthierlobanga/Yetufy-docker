# 🔔 Système de Notifications - Documentation

## Vue d'Ensemble

Le système de notifications a été complètement refactorisé pour supporter :
- ✅ Notifications en temps réel avec Reverb
- ✅ Différenciation Tenant (vendeurs) / Clients (acheteurs)
- ✅ Notifications par email, base de données, et broadcast
- ✅ API REST pour les notifications
- ✅ Gestion centralisée des notifications

## 📋 Architecture

### Service Principal: NotificationService

Le service `App\Services\NotificationService` centralise toute la logique de notification.

```php
// Utilisation basique
$notificationService->notify(
    user: $user,
    notificationType: OrderNotification::class,
    data: ['order' => $order, 'action' => 'created']
);

// Pour les vendeurs (tenant)
$notificationService->notifyTenantUsers(
    tenant: $shop,
    notificationType: OrderNotification::class,
    data: [...]
);

// Pour les clients acheteurs
$notificationService->notifyCustomer(
    customer: $customer,
    notificationType: OrderNotification::class,
    data: [...]
);
```

### Types de Notifications

#### 1. OrderNotification - Commandes

Utilisée pour les événements de commande (création, confirmation, expédition, etc.)

```php
// Dans le contrôleur
event(new OrderCreated($order));

// Le gestionnaire d'événement notifie automatiquement :
// - Le vendeur (propriétaire du shop)
// - Le client (acheteur)
```

#### 2. PaymentNotification - Paiements

Pour les événements de paiement.

```php
event(new PaymentReceived(
    order: $order,
    amount: 99.99,
    status: 'completed'
));
```

#### 3. ProductNotification - Produits

Pour les vendeurs (création, mise à jour, stock faible, etc.)

```php
$notificationService->notifyTenantUsers(
    tenant: $shop,
    notificationType: ProductNotification::class,
    data: [
        'product' => $product,
        'action' => 'created',
    ]
);
```

#### 4. CustomerNotification - Notifications Clients

Pour les notifications génériques aux clients.

```php
$notificationService->notifyCustomer(
    customer: $user,
    notificationType: CustomerNotification::class,
    data: [
        'title' => 'Promotion spéciale',
        'message' => 'Découvrez nos nouvelles offres',
        'category' => 'promotion',
        'action_url' => route('products.index'),
    ]
);
```

## 🔌 Canaux Reverb

### Canaux Disponibles

```php
// Canal utilisateur personnel
Broadcast::channel('App.Models.User.{id}')

// Canal tenant (vendeurs)
Broadcast::channel('tenant.{tenantId}')

// Canal utilisateur du tenant
Broadcast::channel('tenant.{tenantId}.users.{userId}')

// Canal client
Broadcast::channel('customer.{userId}')

// Canal admin
Broadcast::channel('admin.{adminId}')

// Canal produit
Broadcast::channel('product.{productId}')

// Canal global
Broadcast::channel('notifications.global')
```

### Écouteurs Client (JavaScript/React)

```typescript
// Écouter les notifications du tenant
Echo.private(`tenant.${tenantId}.users.${userId}`)
    .listen('notification.sent', (data) => {
        console.log('Nouvelle notification:', data)
        // Mettre à jour l'interface utilisateur
    })

// Écouter les notifications client
Echo.private(`customer.${userId}`)
    .listen('notification.sent', (data) => {
        console.log('Notification reçue:', data)
    })

// Avec connexion/déconnexion
Echo.private(`tenant.${tenantId}.users.${userId}`)
    .listen('notification.sent', (event) => {
        // Gérer la notification
    })
    .subscribed(() => {
        console.log('Connecté au canal')
    })
    .error((error) => {
        console.log('Erreur:', error)
    })
    .leaving(() => {
        console.log('Déconnecté')
    })
```

## 📱 API REST

### Endpoints Disponibles

```
GET    /api/notifications                    # Toutes les notifications
GET    /api/notifications/unread             # Non lues seulement
GET    /api/notifications/unread-count       # Compte des non lues
POST   /api/notifications/{id}/read          # Marquer comme lue
POST   /api/notifications/mark-all-read      # Tout marquer comme lu
DELETE /api/notifications/{id}               # Supprimer une notification
DELETE /api/notifications/delete-read        # Supprimer les lues
```

### Exemples de Requêtes

```bash
# Récupérer les notifications non lues
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/notifications/unread

# Obtenir le compte des non lues
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/notifications/unread-count

# Marquer comme lue
curl -X POST -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/notifications/abc123/read

# Marquer toutes comme lues
curl -X POST -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/notifications/mark-all-read
```

### Réponses JSON

```json
{
  "success": true,
  "data": [
    {
      "id": "abc-123",
      "type": "OrderNotification",
      "notifiable_id": "user-1",
      "data": {
        "title": "Nouvelle commande",
        "message": "Commande #12345",
        "order_id": "order-1",
        "icon": "heroicon-o-shopping-bag",
        "color": "info"
      },
      "read_at": null,
      "created_at": "2026-06-01T12:00:00Z"
    }
  ],
  "count": 5
}
```

## 🎯 Cas d'Usage

### 1. Nouvelle Commande

```php
// Dans OrderController
$order = Order::create($data);
event(new OrderCreated($order));

// Résultat:
// - Email au vendeur: "Nouvelle commande reçue"
// - Email au client: "Votre commande a été reçue"
// - Notification DB pour le vendeur
// - Notification DB pour le client
// - Broadcast Reverb sur les canaux appropriés
```

### 2. Changement de Statut

```php
// Mise à jour du statut
$order->update(['status' => 'shipped']);
event(new OrderStatusChanged($order, 'processing', 'shipped'));

// Résultat:
// - Notification vendeur: "Commande expédiée"
// - Notification client: "Votre commande est en route"
// - Emails à tous les deux
// - Broadcast en temps réel
```

### 3. Notification Personnalisée

```php
// Pour un client
$notificationService->notifyCustomer(
    customer: $user,
    notificationType: CustomerNotification::class,
    data: [
        'title' => 'Flash sale!',
        'message' => '50% de réduction pendant 24h',
        'category' => 'promotion',
        'action_text' => 'Voir l\'offre',
        'action_url' => route('products.sale'),
    ]
);

// Pour tous les vendeurs
$notificationService->notifyAdmins(
    notificationType: OrderNotification::class,
    data: ['order' => $order, 'action' => 'created']
);
```

## 🔧 Configuration

### Variables d'Environnement

```env
# Reverb Configuration
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_secret
REVERB_HOST=localhost
REVERB_PORT=8081

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=

# Queue Configuration
QUEUE_CONNECTION=redis
```

### Configuration Reverb (config/broadcasting.php)

```php
'reverb' => [
    'driver' => 'reverb',
    'key' => env('REVERB_APP_KEY'),
    'secret' => env('REVERB_APP_SECRET'),
    'app_id' => env('REVERB_APP_ID'),
    'options' => [
        'host' => env('REVERB_HOST', '127.0.0.1'),
        'port' => env('REVERB_PORT', 8080),
        'scheme' => env('REVERB_SCHEME', 'http'),
    ],
],
```

## 🚀 Utilisation dans les Composants React

### Composant Notification Bell

```tsx
import { useEffect, useState } from 'react'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        // Initialiser Echo
        const echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT,
        })

        const userId = window.AUTH_USER?.id

        if (userId) {
            // Écouter les notifications
            echo.private(`customer.${userId}`)
                .listen('notification.sent', (event) => {
                    setNotifications(prev => [event.data, ...prev])
                    setUnreadCount(prev => prev + 1)
                })
        }

        return () => {
            echo.leave(`customer.${userId}`)
        }
    }, [])

    return (
        <div className="relative">
            <button className="relative">
                🔔
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5">
                        {unreadCount}
                    </span>
                )}
            </button>
            {/* ... */}
        </div>
    )
}
```

## 🐛 Dépannage

### Reverb ne fonctionne pas

```bash
# 1. Vérifier que Reverb est en cours d'exécution
php artisan reverb:start

# 2. Vérifier les variables d'environnement
php artisan config:show broadcasting

# 3. Vérifier les logs
tail -f storage/logs/laravel.log
```

### Les notifications ne s'envoient pas

```bash
# 1. Vérifier que le queue est en cours d'exécution
php artisan queue:listen

# 2. Vérifier la configuration de la queue
php artisan config:show queue

# 3. Vérifier les jobs en attente
php artisan queue:failed
```

### Notifications ne s'affichent pas en temps réel

```javascript
// 1. Vérifier que Echo est correctement initialisé
console.log(window.Echo)

// 2. Vérifier la connexion Reverb
window.Echo.connector.pusher.connection.state

// 3. Vérifier les canaux écoutés
window.Echo.channels
```

## 📊 Types de Notifications Récapitulatif

| Notification | Destinataires | Canaux | Usage |
|--------------|---------------|--------|-------|
| OrderNotification | Vendeur + Client | Mail, DB, Broadcast | Commandes |
| PaymentNotification | Vendeur + Client | Mail, DB, Broadcast | Paiements |
| ProductNotification | Vendeur | Mail, DB, Broadcast | Produits |
| CustomerNotification | Client | Mail, DB, Broadcast | Promos, Alertes |

## 🔗 Ressources

- [Laravel Notifications](https://laravel.com/docs/notifications)
- [Laravel Broadcasting](https://laravel.com/docs/broadcasting)
- [Reverb Documentation](https://reverb.laravel.com)
- [Laravel Echo](https://laravel.com/docs/broadcasting#client-side-installation)

---

**Documentation du système de notifications complète!** ✅
