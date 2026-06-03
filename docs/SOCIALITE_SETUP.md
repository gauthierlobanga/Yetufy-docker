# Configuration de l'Authentification Sociale avec Laravel Socialite

Ce guide explique comment configurer les fournisseurs OAuth (Google, Facebook, Instagram et Microsoft) pour votre plateforme Yetufy.

## 📋 Fournisseurs Supportés

- ✅ Google
- ✅ Facebook
- ✅ Instagram
- ✅ Microsoft

## 🔧 Configuration Générale

### 1. Installation (déjà effectuée)

```bash
composer require laravel/socialite
```

### 2. Configuration des URLs de Redirection

Assurez-vous que votre domaine est correctement configuré dans `.env` :

```env
APP_URL=http://localhost # ou votre domaine en production
```

Les URLs de callback seront générées automatiquement :

```
{APP_URL}/auth/{provider}/callback
```

---

## 🔑 Configuration par Provider

### Google

1. **Allez à** : [Google Cloud Console](https://console.cloud.google.com/)

2. **Créez un nouveau projet** (si nécessaire)

3. **Activez Google+ API** :
   - Recherchez "Google+ API" dans la marketplace
   - Cliquez sur "Activer"

4. **Créez les credentials OAuth 2.0** :
   - Allez à "Identifiants"
   - Cliquez "Créer des identifiants" → "OAuth 2.0 Client ID"
   - Sélectionnez "Application Web"
   - Ajoutez vos URIs autorisés :

     ```
     http://localhost
     http://localhost/auth/google/callback
     https://votre-domaine.com
     https://votre-domaine.com/auth/google/callback
     ```

5. **Mettez à jour votre .env** :

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback
```

---

### Facebook

1. **Allez à** : [Meta Developers](https://developers.facebook.com/)

2. **Créez une nouvelle application** :
   - Cliquez "Mon Espace"
   - Cliquez "Créer une application"
   - Choisissez le type "Consommateur"

3. **Configurez la connexion Facebook** :
   - Dans les paramètres de l'application, allez à "Paramètres de base"
   - Notez votre ID d'application et secret

4. **Configurez les URIs de redirection** :
   - Allez à "Produits" → "Connexion Facebook" → "Paramètres"
   - Ajoutez vos URIs valides :

     ```
     http://localhost/auth/facebook/callback
     https://votre-domaine.com/auth/facebook/callback
     ```

5. **Configurez les domaines d'application** :
   - Dans "Paramètres" → "Général", ajoutez :

     ```
     localhost
     votre-domaine.com
     ```

6. **Mettez à jour votre .env** :

```env
FACEBOOK_CLIENT_ID=your_app_id
FACEBOOK_CLIENT_SECRET=your_app_secret
FACEBOOK_REDIRECT_URI=http://localhost/auth/facebook/callback
```

---

### Instagram

Instagram utilise les credentials Facebook (même application).

1. **Utilisez votre application Facebook existante**

2. **Activez Instagram Basic Display** :
   - Dans votre application Facebook
   - Allez à "Produits" → "Ajouter un produit"
   - Cherchez et ajoutez "Instagram Basic Display"

3. **Configurez les paramètres** :
   - Allez à "Instagram Basic Display" → "Paramètres"
   - Ajoutez vos URIs valides :

     ```
     http://localhost/auth/instagram/callback
     https://votre-domaine.com/auth/instagram/callback
     ```

4. **Mettez à jour votre .env** :

```env
INSTAGRAM_CLIENT_ID=your_app_id
INSTAGRAM_CLIENT_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost/auth/instagram/callback
```

---

### Microsoft

1. **Allez à** : [Azure Portal](https://portal.azure.com/)

2. **Créez une nouvelle inscription d'application** :
   - Allez à "Inscriptions d'applications"
   - Cliquez "Nouvelle inscription"
   - Donnez un nom à votre application

3. **Configurez les URIs de redirection** :
   - Dans "Authentification", cliquez "Ajouter une plateforme"
   - Sélectionnez "Application Web"
   - Ajoutez votre URI de redirection :

     ```
     http://localhost/auth/microsoft/callback
     https://votre-domaine.com/auth/microsoft/callback
     ```

4. **Générez un secret client** :
   - Allez à "Certificats et secrets"
   - Cliquez "Nouveau secret client"
   - Copiez la valeur du secret

5. **Notez vos credentials** :
   - ID d'application (client ID)
   - Valeur du secret client

6. **Mettez à jour votre .env** :

```env
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_REDIRECT_URI=http://localhost/auth/microsoft/callback
MICROSOFT_TENANT=common
```

---

## 🧪 Test de Configuration

### 1. Vérifiez que les credentials sont correctement définis

```bash
php artisan tinker
```

```php
>>> config('socialite.providers')
// Vous devriez voir vos providers avec enabled: true
```

### 2. Testez manuellement

Visitez ces URLs dans votre navigateur :

- `http://localhost/auth/google/redirect`
- `http://localhost/auth/facebook/redirect`
- `http://localhost/auth/instagram/redirect`
- `http://localhost/auth/microsoft/redirect`

Vous devriez être redirigé vers la page de connexion du provider.

---

## 🔐 Bonnes Pratiques en Production

1. **N'utilisez jamais vos secrets en dur**
   - Utilisez des variables d'environnement
   - Utilisez un gestionnaire de secrets (AWS Secrets Manager, HashiCorp Vault, etc.)

2. **Configurez les domaines de production**
   - Mettez à jour les URIs de redirection autorisés pour chaque provider
   - Utilisez HTTPS en production

3. **Surveillez les erreurs**
   - Vérifiez les logs : `storage/logs/laravel.log`
   - Activez le mode debug uniquement en développement

4. **Testez les cas d'erreur**
   - Refus de l'utilisateur
   - Comptes déjà existants
   - Erreurs de réseau

---

## 🐛 Dépannage

### Le redirect ne fonctionne pas

- Vérifiez que le provider est activé dans `config('socialite.providers')`
- Vérifiez que les credentials sont correctement définis dans `.env`
- Vérifiez que les URIs de redirection correspondent exactement

### L'erreur "Provider not enabled"

- Vérifiez que les variables d'environnement CLIENT_ID et CLIENT_SECRET sont définies
- Relancez `php artisan config:cache` après les modifications de `.env`

### L'utilisateur reçoit "Authentication failed"

- Vérifiez les logs dans `storage/logs/laravel.log`
- Vérifiez les permissions de l'application OAuth

### Problèmes de CORS

- Assurez-vous que votre domaine est autorisé dans la configuration CORS
- Vérifiez `config('cors.php')`

---

## 📝 Notes Additionnelles

### Champs Utilisateur Disponibles

Après l'authentification sociale, les champs suivants sont sauvegardés :

- `name` : Nom du profil
- `email` : Email (vérifié automatiquement)
- `provider` : Nom du fournisseur (google, facebook, instagram, microsoft)
- `provider_id` : ID utilisateur du fournisseur
- `avatar` : Photo de profil (si disponible)

### Linking Multiple Providers

Un utilisateur peut se connecter avec plusieurs providers :

- S'il se connecte avec un email qui existe déjà, le provider sera lié
- Si le email n'existe pas, un nouveau compte sera créé

### Routes Disponibles

```
GET  /auth/{provider}/redirect  - Redirection vers le provider
GET  /auth/{provider}/callback  - Callback après authentification
```

Exemple d'utilisation dans le frontend :

```html
<a href="/auth/google/redirect">Se connecter avec Google</a>
<a href="/auth/facebook/redirect">Se connecter avec Facebook</a>
<a href="/auth/instagram/redirect">Se connecter avec Instagram</a>
<a href="/auth/microsoft/redirect">Se connecter avec Microsoft</a>
```

---

## 📚 Ressources

- [Laravel Socialite Documentation](https://laravel.com/docs/socialite)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
