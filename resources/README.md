# 🎨 Ressources - `resources/`

Ce dossier contient les assets frontend (JavaScript/React, CSS) et templates.

## 📁 Structure

```
resources/
├── js/                  # Composants React + logique frontend
│   ├── components/      # Composants réutilisables
│   ├── layouts/         # Layouts
│   ├── pages/           # Pages (routes)
│   ├── App.tsx          # Composant racine
│   └── app.ts           # Point d'entrée
├── css/                 # Fichiers stylesheets
├── views/               # Templates Blade (emails, etc)
└── fonts/               # Police d'écriture personnalisées
```

## ⚛️ Structure React - `resources/js/`

### Composants - `resources/js/components/`

Composants réutilisables et petits (UI, formulaires).

```
components/
├── ui/                     # Composants UI de base
│   ├── button.tsx         # <Button />
│   ├── input.tsx          # <Input />
│   ├── card.tsx           # <Card />
│   └── ...
├── forms/                  # Formulaires
│   ├── login-form.tsx
│   ├── product-form.tsx
│   └── ...
├── layout/                 # Éléments de layout
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
├── social-login-buttons.tsx  # Boutons OAuth
└── ...
```

**Exemple de Composant:**

```tsx
import { Button } from '@/components/ui/button'

interface ProductCardProps {
    product: Product
    onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <div className="border rounded-lg p-4">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <Button onClick={() => onAddToCart(product)}>
                Add to Cart
            </Button>
        </div>
    )
}
```

### Pages/Routes - `resources/js/pages/`

Composants de niveau page (une par route).

```
pages/
├── auth/
│   ├── login.tsx         # Page de connexion
│   └── register.tsx      # Page d'inscription
├── products/
│   ├── index.tsx         # Catalogue
│   ├── show.tsx          # Détail produit
│   └── create.tsx        # Créer produit (admin)
├── orders/
│   └── index.tsx         # Mes commandes
├── dashboard.tsx         # Dashboard
└── ...
```

**Structure de Page:**

```tsx
import { useRoute } from '@inertiajs/react'
import Layout from '@/layouts/Layout'

interface Product {
    id: string
    name: string
    price: number
}

interface Props {
    product: Product
}

export default function ProductShow({ product }: Props) {
    return (
        <Layout>
            <div className="container mx-auto">
                <h1>{product.name}</h1>
                <p>${product.price}</p>
            </div>
        </Layout>
    )
}
```

### Layouts - `resources/js/layouts/`

Layouts partagés pour les pages.

```
layouts/
├── Layout.tsx            # Layout par défaut
├── AuthLayout.tsx        # Layout authentification
├── AdminLayout.tsx       # Layout admin
└── ...
```

**Exemple de Layout:**

```tsx
import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'
import Footer from '@/components/layout/footer'

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div>
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1">{children}</main>
            </div>
            <Footer />
        </div>
    )
}
```

### Entrée - `resources/js/app.ts`

Point d'entrée de l'application React.

```tsx
import './bootstrap'
import '../css/app.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

const appName = import.meta.env.VITE_APP_NAME || 'Yetufy'

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})
```

## 🎨 CSS - `resources/css/`

Fichiers stylesheets.

```
css/
├── app.css              # CSS global
├── components.css       # Composants
└── utilities.css        # Utilitaires
```

**app.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
    .btn-primary {
        @apply px-4 py-2 rounded bg-blue-500 text-white;
    }
}
```

## 📧 Templates Email - `resources/views/`

Templates Blade pour les emails.

```
views/
├── emails/
│   ├── order-confirmation.blade.php
│   ├── password-reset.blade.php
│   └── notification.blade.php
└── ...
```

**Exemple d'Email:**

```blade
<x-mail::message>
# Order Confirmation

Thanks for your order!

Order #{{ $order->number }}
Total: ${{ $order->total }}

<x-mail::button :url="url('/orders/' . $order->id)">
    View Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
```

## 🔄 Flux de Données

### Request → Component

```
1. Route HTTP
   ↓
2. Controller (app/Http/Controllers)
   ↓
3. Service (logique métier)
   ↓
4. Model (base de données)
   ↓
5. Controller retourne inertia('page-name', $data)
   ↓
6. React Component reçoit les data
   ↓
7. Affichage du composant
```

### Exemple Complet

```php
// routes/web.php
Route::get('/products/{product}', [ProductController::class, 'show'])
    ->name('products.show')

// app/Http/Controllers/ProductController.php
class ProductController {
    public function show(Product $product) {
        return inertia('products/show', [
            'product' => $product,
            'recommendations' => $product->getRecommendations(),
        ])
    }
}

// resources/js/pages/products/show.tsx
export default function ProductShow({ product, recommendations }) {
    return (
        <Layout>
            <ProductHeader product={product} />
            <ProductDetails product={product} />
            <RecommendationsList items={recommendations} />
        </Layout>
    )
}
```

## 📱 Conventions

### Nommage des Fichiers

| Type | Convention | Exemple |
|------|-----------|---------|
| Component | PascalCase | `ProductCard.tsx` |
| Page | kebab-case | `product-show.tsx` |
| Layout | PascalCase | `MainLayout.tsx` |
| Style | Tailwind | `className="..."` |

### Organisation des Composants

```tsx
// ✅ Bon - Structure claire
interface ComponentProps {
    title: string
    onSubmit: (data: FormData) => void
}

export function MyComponent({ title, onSubmit }: ComponentProps) {
    // Logique
    const handleSubmit = (data) => { /* ... */ }
    
    // Render
    return <form onSubmit={handleSubmit}>...</form>
}

// ❌ Mauvais - Pas de types
export function MyComponent(props) {
    return <form>{props.children}</form>
}
```

## 🧪 Tester les Composants

### Tests avec Vitest

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductCard from '@/components/ProductCard'

describe('ProductCard', () => {
    it('renders product name', () => {
        const product = { id: 1, name: 'Test', price: 99 }
        render(<ProductCard product={product} />)
        
        expect(screen.getByText('Test')).toBeInTheDocument()
    })
})
```

## 🚀 Build et Compilation

### Commandes

```bash
# Développement
npm run dev

# Production
npm run build

# Visualiser le bundle
npm run build -- --visualize

# Hot reload (développement)
npm run dev
```

### Configuration - `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.ts',
            ssr: 'resources/js/ssr.ts',
        }),
        react(),
    ],
})
```

## 🎯 Bonnes Pratiques

### 1. Composants Petits et Réutilisables

```tsx
// ✅ Bon - Petit, réutilisable
function ProductPrice({ price }: { price: number }) {
    return <span className="text-lg font-bold">${price}</span>
}

// ❌ Mauvais - Trop de logique
function ProductPrice({ product, user, cart }: Props) {
    const discountedPrice = product.price * (1 - user.discount)
    const withTax = discountedPrice * 1.2
    // 50 lignes de logique...
}
```

### 2. Utiliser des Types TypeScript

```tsx
// ✅ Bon - Typé
interface Props {
    productId: string
    onSelect: (id: string) => void
}

export function ProductSelector({ productId, onSelect }: Props) {
    // ...
}

// ❌ Mauvais - Pas typé
export function ProductSelector(props) {
    // ...
}
```

### 3. Utiliser Tailwind pour le CSS

```tsx
// ✅ Bon - Tailwind
<div className="flex items-center justify-between p-4 bg-white rounded-lg">

// ❌ Mauvais - CSS personnalisé
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
```

## 🔗 Ressources

- [React Documentation](https://react.dev/)
- [Inertia.js](https://inertiajs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

---

**Besoin d'aide?** Consultez la [documentation principale](../README.md)
