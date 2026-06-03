<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Auth\TenantSsoLoginController;
use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Main\LocationController;
use App\Http\Controllers\Pages\PageController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Shop\AccountDashboardController;
use App\Http\Controllers\Shop\AddressController;
use App\Http\Controllers\Shop\BrandController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CategoryController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\LoyaltyController;
use App\Http\Controllers\Shop\NewsletterController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\PaymentController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\PromotionController;
use App\Http\Controllers\Shop\ReturnController;
use App\Http\Controllers\Shop\ReviewController;
use App\Http\Controllers\Shop\WishlistController;
use App\Http\Controllers\Vendor\AnalyticsController;
use App\Http\Controllers\Vendor\Settings\ParametresController;
use App\Http\Controllers\Vendor\Settings\ParametresSecurityController;
use App\Http\Controllers\Vendor\SubscriptionController;
use App\Http\Controllers\Vendor\TenantAiController;
use App\Http\Controllers\Vendor\TenantDashboardNotificationController;
use App\Http\Controllers\Vendor\TenantOrderController;
use App\Http\Controllers\Vendor\TenantPaymentController;
use App\Http\Controllers\Vendor\TenantProductController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use App\Http\Controllers\Vendor\VendorSettingsController;
use App\Http\Controllers\Vendor\VendorStatisticsController;
use App\Http\Controllers\Vendor\ShopThemeController;
use App\Http\Controllers\Vendor\VisitorAnalyticsController;
use App\Http\Controllers\Vendor\VisitorStatsController;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {

    /*
      |--------------------------------------------------------------------------
      | ROUTES PUBLICS TENANT
      |--------------------------------------------------------------------------
      */
    Route::get('/', [HomeController::class, 'homeIndex'])->name('tenant.home');

    Route::get('/tenant-sso-login', [TenantSsoLoginController::class, '__invoke'])
        ->name('tenant.sso.login');



    /*
      |--------------------------------------------------------------------------
      | ROUTES AUTHENTIFICATION TENANT (acheteurs)
      |--------------------------------------------------------------------------
      */
    Route::middleware('guest')
        ->group(function () {

            Route::get('/login', function () {
                return inertia('auth/login', [
                    'canResetPassword' => true,
                    'canRegister' => true,
                ]);
            })->name('tenant.login');

            Route::get('/register', function () {
                return inertia('auth/register');
            })->name('tenant.register');

            Route::get('/forgot-password', function () {
                return inertia('auth/forgot-password');
            })->name('tenant.password.request');

            Route::get('/reset-password/{token}', function (Request $request, $token) {
                return inertia('auth/reset-password', [
                    'email' => $request->email,
                    'token' => $token,
                ]);
            })->name('tenant.password.reset');
        });

    /*
      |--------------------------------------------------------------------------
      | ROUTES PUBLICS TENANT
      |--------------------------------------------------------------------------
      */
    Route::middleware(['auth', 'verified'])->group(function () {

        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'adminDashboardIndex'])->name('dashboard');

            Route::prefix('subscriptions')->name('admin.subscriptions.')->group(function () {
                Route::get('/', [AdminSubscriptionController::class, 'index'])->name('index');
                Route::get('/{subscription}', [AdminSubscriptionController::class, 'show'])->name('show');
                Route::post('/{subscription}/block', [AdminSubscriptionController::class, 'block'])->name('block');
                Route::post('/{subscription}/unblock', [AdminSubscriptionController::class, 'unblock'])->name('unblock');
                Route::post('/{subscription}/renew', [AdminSubscriptionController::class, 'renew'])->name('renew');
                Route::post('/{subscription}/add-grace-period', [AdminSubscriptionController::class, 'addGracePeriod'])->name('add-grace-period');
                Route::post('/batch/expired-to-block', [AdminSubscriptionController::class, 'expiredToBlock'])->name('expired-to-block');
                Route::post('/batch/notify-expiring', [AdminSubscriptionController::class, 'notifyExpiring'])->name('notify-expiring');
                Route::post('/batch/sync-stripe', [AdminSubscriptionController::class, 'syncWithStripe'])->name('sync-stripe');
            });
        });

        Route::prefix('acheteur')->group(function () {
            Route::get('/account', [AccountDashboardController::class, 'AccountDashboardIndex'])->name('acheteur.dashboard');
        });

        Route::get('/vendor/dashboard', [VendorDashboardController::class, 'index'])
            ->name('vendor.dashboard');

        Route::prefix('subscription')->name('subscription.')->group(function () {
            Route::get('/', [SubscriptionController::class, 'show'])->name('show');
            Route::post('/upgrade', [SubscriptionController::class, 'upgrade'])->name('upgrade');
            Route::post('/downgrade', [SubscriptionController::class, 'downgrade'])->name('downgrade');
            Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
            Route::post('/pause', [SubscriptionController::class, 'pause'])->name('pause');
            Route::post('/resume', [SubscriptionController::class, 'resume'])->name('resume');
            Route::get('/invoices', [SubscriptionController::class, 'invoices'])->name('invoices');
        });

        Route::prefix('notifications')->name('tenant.notifications.')->group(function () {
            Route::post('/{id}/mark-as-read', [TenantDashboardNotificationController::class, 'markAsRead'])
                ->name('mark-as-read');
            Route::post('/mark-all-as-read', [TenantDashboardNotificationController::class, 'markAllAsRead'])
                ->name('mark-all-as-read');
        });

    });

    /*
    |--------------------------------------------------------------------------
    | ROUTES PUBLICS TENANT
    |--------------------------------------------------------------------------
    */
    Route::prefix('tenant')->middleware(['auth'])->group(function () {
        Route::redirect('settings', 'Vendor/settings/profile');
        Route::get('settings/profile', [ParametresController::class, 'edit'])->name('tenant.profile.edit');
        Route::patch('settings/profile', [ParametresController::class, 'update'])->name('tenant.profile.update');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::delete('tenant/settings/profile', [ParametresController::class, 'destroy'])->name('tenant.profile.destroy');

        Route::get('tenant/settings/security', [ParametresSecurityController::class, 'edit'])->name('tenant.security.edit');

        Route::put('tenant/settings/password', [ParametresSecurityController::class, 'update'])
            ->middleware('throttle:6,1')
            ->name('tenant.user-password.update');

        Route::inertia('tenant/settings/appearance', 'Vendor/settings/appearance')
            ->name('tenant.appearance.edit');

        Route::get('/parametres', [VendorSettingsController::class, 'edit'])
            ->name('vendor.settings');

        Route::put('/parametres', [VendorSettingsController::class, 'update'])
            ->name('vendor.settings.update');

        Route::get('/statistiques', [VendorStatisticsController::class, 'index'])
            ->name('vendor.statistics');

        Route::prefix('api/theme')->name('shop.theme.')->group(function () {
            Route::get('/', [ShopThemeController::class, 'show'])->name('show');
            Route::post('/', [ShopThemeController::class, 'update'])->name('update');
            Route::post('/preset/{preset}', [ShopThemeController::class, 'applyPreset'])->name('preset');
            Route::post('/revert/{version}', [ShopThemeController::class, 'revert'])->name('revert');
            Route::get('/export', [ShopThemeController::class, 'export'])->name('export');
            Route::post('/import', [ShopThemeController::class, 'import'])->name('import');
            Route::post('/compare', [ShopThemeController::class, 'compare'])->name('compare');
            Route::get('/history', [ShopThemeController::class, 'history'])->name('history');
            Route::post('/reset', [ShopThemeController::class, 'reset'])->name('reset');
        });

        Route::get('/products', [TenantProductController::class, 'index'])->name('dashboard.products.index');

        Route::get('/vendor/stats/visitors', [VisitorStatsController::class, 'index'])->name('vendor.stats.visitors');
    });

    Route::middleware(['auth', 'verified'])->prefix('analytics')->name('tenant.analytics.')->group(function () {
        Route::get('/', [VisitorAnalyticsController::class, 'dashboard'])->name('dashboard');
        Route::get('/visitors', [VisitorAnalyticsController::class, 'visitorsList'])->name('visitors');
        Route::get('/visitor/{id}', [VisitorAnalyticsController::class, 'visitorDetail'])->name('visitor.show');
        Route::get('/events/recent', [VisitorAnalyticsController::class, 'recentEvents'])->name('events.recent');
        Route::get('/vendor/stats/visitors', [VisitorStatsController::class, 'index'])->name('vendor.stats.visitors');
        Route::get('/vendor/analytics', [AnalyticsController::class, 'index'])->name('avance');
    });

    Route::middleware(['auth', 'verified'])->prefix('ai')->name('ai.')->group(function () {
        Route::post('/toggle', [TenantAiController::class, 'toggle'])
            ->name('toggle');
        Route::post('/chat', [TenantAiController::class, 'chat'])->name('chat');
        Route::get('/recommendations', [TenantAiController::class, 'recommendations'])->name('recommendations');
        Route::post('/generate-product', [TenantAiController::class, 'generateProduct'])->name('generate-product');
    });
    /*
    |--------------------------------------------------------------------------
    | ROUTES PUBLICS TENANT
    |--------------------------------------------------------------------------
    */
    Route::name('tenant.')->group(function () {

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/countries', [LocationController::class, 'countries'])->name('addresses.countries');
            Route::get('/countries/{country}/cities', [LocationController::class, 'cities'])->name('addresses.cities');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES PAGES STATIQUES (aide, conditions, politique de confidentialité, etc.)
        |--------------------------------------------------------------------------
        */
        Route::get('/api/search', [SearchController::class, 'shopSearch'])->name('search');
        Route::get('/search', [SearchController::class, 'shopApi'])->name('api');

        Route::prefix('page')->group(function () {
            Route::get('/contact', [ContactController::class, 'contactIndex'])->name('page.contact');
            Route::post('/contact', [ContactController::class, 'contactStore'])->name('page.contact.store');

            Route::get('/help', [PageController::class, 'pageHelp'])->name('page.help');
            Route::get('/about', [PageController::class, 'pageAbout'])->name('page.about');
            Route::get('/terms', [PageController::class, 'pageTerms'])->name('page.terms');
            Route::get('/privacy', [PageController::class, 'pagePrivacy'])->name('page.privacy');
            Route::get('/cookies', [PageController::class, 'pageCookies'])->name('page.cookies');
            Route::get('/support', [PageController::class, 'pageSupport'])->name('page.support');
            Route::get('/faq', [PageController::class, 'pageFaq'])->name('page.faq');
            Route::get('/testimonials', [PageController::class, 'pageTestimonials'])->name('page.testimonials');
        });
        /*
        |--------------------------------------------------------------------------
        | ROUTES BLOG PUBLIQUES
        |--------------------------------------------------------------------------
        */
        Route::prefix('blog')->group(function () {
            Route::get('/', [BlogController::class, 'blogIndex'])->name('blog.index');
            Route::get('/category/{category:slug}', [BlogController::class, 'blogByCategory'])->name('blog.category');
            Route::get('/{post:slug}', [BlogController::class, 'blogShow'])->name('blog.show');
            Route::post('/{post}/comment', [BlogController::class, 'blogComment'])->middleware('auth')->name('blog.comment');
            Route::post('/{post}/like', [BlogController::class, 'blogLike'])->middleware('auth')->name('blog.like');
            Route::post('/{post}/bookmark', [BlogController::class, 'blogBookmark'])->middleware('auth')->name('blog.bookmark');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES GESTION BLOG ADMIN
        |--------------------------------------------------------------------------
        */
        Route::middleware(['auth', 'verified'])->group(function () {
            Route::prefix('dashboard')->group(function () {
                Route::post('/posts/reorder', [DashboardController::class, 'postsReorder'])->name('posts.reorder');
            });
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES GESTION BLOG ADMIN
        |--------------------------------------------------------------------------
        */
        Route::name('socialitie.')->middleware('guest')->group(function () {
            Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'socialiteShopRedirect'])->name('redirect');
            Route::get('/auth/{provider}/callback', [SocialiteController::class, 'socialiteShopCallback'])->name('callback');
        });
        /*
        |--------------------------------------------------------------------------
        | ROUTES AUTHENTIFIÉES (commentaires, avis, wishlist)
        |--------------------------------------------------------------------------
        */
        Route::middleware('auth:sanctum')->prefix('comments')->name('comments.')->group(function () {
            Route::get('/', [CommentController::class, 'commentsIndex'])->name('index');
            Route::post('/', [CommentController::class, 'commentsStore'])->name('store');
            Route::post('/{comment}/like', [CommentController::class, 'commentsLike'])->name('like');
            Route::post('/{comment}/report', [CommentController::class, 'commentsReport'])->name('report');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES E-COMMERCE PUBLIQUES
        |--------------------------------------------------------------------------
        */
        // =====================
        // CATÉGORIES
        // =====================
        Route::prefix('product/category')->group(function () {
            Route::get('/', [CategoryController::class, 'categoriesIndex'])->name('product.category.index');
            Route::get('/{category:slug}', [CategoryController::class, 'categoriesShow'])->name('product.category.show');
        });

        // =====================
        // PRODUITS
        // =====================
        Route::prefix('product')->group(function () {
            Route::get('/', [ProductController::class, 'productsIndex'])->name('product.index');
            Route::get('/quick-view/{produit:slug}', [ProductController::class, 'productsQuickView'])->name('product.quick-view');
            Route::get('/{produit:slug}', [ProductController::class, 'productsShow'])->name('product.show');
            Route::post('/search/by-image', [ProductController::class, 'searchByImage'])->name('product.search.by-image');
            Route::get('/{produit:slug}/reviews', [ReviewController::class, 'productsReviewsIndex'])->name('product.reviews.index');
        });

        // Marques
        Route::get('/brands', [BrandController::class, 'brandsIndex'])->name('brands.index');
        Route::get('brands/{brand:slug}', [BrandController::class, 'brandsShow'])->name('brands.show');

        // Promotions
        Route::get('/promotions', [PromotionController::class, 'promotionsIndex'])->name('promotions.index');

        // Panier
        Route::prefix('cart')->group(function () {
            Route::get('/', [CartController::class, 'cartIndex'])->name('cart.index');
            Route::post('/add/{produit}', [CartController::class, 'cartAdd'])->name('cart.add');
            Route::patch('/update/{item}', [CartController::class, 'cartUpdate'])->name('cart.update');
            Route::delete('/remove/{item}', [CartController::class, 'cartRemove'])->name('cart.remove');
            Route::post('/clear', [CartController::class, 'cartClear'])->name('cart.clear');
            Route::post('/apply-coupon', [CartController::class, 'cartApplyCoupon'])->name('cart.apply-coupon');
            Route::delete('/remove-coupon', [CartController::class, 'cartRemoveCoupon'])->name('cart.remove-coupon');
            Route::post('/calculate', [CartController::class, 'cartCalculate'])->name('cart.calculate');
        });

        // Wishlist
        Route::prefix('wishlist')->group(function () {
            Route::get('/', [WishlistController::class, 'wishlistIndex'])->name('wishlist.index');
            Route::post('/toggle/{produit}', [WishlistController::class, 'wishlistToggle'])->name('wishlist.toggle');
            Route::delete('/remove/{produit}', [WishlistController::class, 'wishlistRemove'])->name('wishlist.remove');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES E-COMMERCE CLIENT (nécessite authentification)
        |--------------------------------------------------------------------------
        */
        Route::middleware(['auth', 'verified'])->group(function () {

            // Checkout et commandes
            Route::prefix('checkout')->group(function () {
                Route::get('/', [CheckoutController::class, 'checkoutIndex'])->name('checkout.index');
                Route::post('/process', [CheckoutController::class, 'checkoutProcess'])->name('checkout.process');
                Route::get('/success/{commande}', [CheckoutController::class, 'checkoutSuccess'])->name('checkout.success');
                Route::get('/cancel', [CheckoutController::class, 'checkoutCancel'])->name('checkout.cancel');
            });

            // Commandes client
            Route::prefix('orders')->group(function () {
                Route::get('/', [OrderController::class, 'ordersIndex'])->name('orders.index');
                Route::get('/{commande}', [OrderController::class, 'ordersShow'])->name('orders.show');
                Route::post('/{commande}/cancel', [OrderController::class, 'ordersCancel'])->name('orders.cancel');
                Route::get('/{commande}/invoice', [OrderController::class, 'ordersInvoice'])->name('orders.invoice');
                Route::get('/admin/{commande}/invoice', [AdminOrderController::class, 'adminOrdersInvoice'])->name('admin.orders.invoice');
            });

            // Retours et remboursements
            Route::prefix('return')->group(function () {
                Route::get('/', [ReturnController::class, 'returnsIndex'])->name('return.index');
                Route::get('/{commande}/request', [ReturnController::class, 'returnsCreate'])->name('return.create');
                Route::post('/', [ReturnController::class, 'returnsStore'])->name('return.store');
                Route::get('/{retour}', [ReturnController::class, 'returnsShow'])->name('return.show');
            });

            // Adresses
            Route::prefix('addresses')->group(function () {
                Route::resource('addresses', AddressController::class)->except(['edit', 'create']);
                Route::post('/{address}/default', [AddressController::class, 'addressesSetDefault'])->name('addresses.default');
            });
            // Paiements

            Route::prefix('payment')->group(function () {
                Route::post('/{commande}/pay', [PaymentController::class, 'paymentPay'])->name('payment.pay');
                Route::get('/callback', [PaymentController::class, 'PaymentCallback'])->name('payment.callback');
            });
            // Avis produits (écriture)

            Route::prefix('product')->group(function () {
                Route::post('/{produit}/review', [ReviewController::class, 'productsReviewsStore'])->name('products.reviews.store');
                Route::put('/review/{avis}', [ReviewController::class, 'productsReviewsUpdate'])->name('products.reviews.update');
                Route::delete('/review/{avis}', [ReviewController::class, 'productsReviewsDestroy'])->name('products.reviews.destroy');
            });

            // Programme de fidélité
            Route::prefix('loyalty')->group(function () {
                Route::get('/', [LoyaltyController::class, 'loyaltyIndex'])->name('loyalty.index');
                Route::post('/redeem', [LoyaltyController::class, 'loyaltyRedeem'])->name('loyalty.redeem');
            });
            // Newsletter

            Route::prefix('newsletter')->group(function () {
                Route::post('/subscribe', [NewsletterController::class, 'newsletterSubscribe'])->name('newsletter.subscribe');
                Route::post('/unsubscribe', [NewsletterController::class, 'newsletterUnsubscribe'])->name('newsletter.unsubscribe');
            });

            Route::get('/vendor/orders', [TenantOrderController::class, 'index'])
                ->name('vendor.orders.index');
            Route::get('/vendor/orders/{commande}', [TenantOrderController::class, 'show'])
                ->name('vendor.orders.show');
            Route::get('/vendor/payments', [TenantPaymentController::class, 'index'])
                ->name('vendor.payments.index');
        });
    });

    Route::get('/subscription/required', function () {
        return inertia('Subscription/Required');
    })->name('tenant.subscription.required');

    Route::post('/flash/clear', function () {
        session()->forget(['success', 'error']);

        return response()->noContent();
    })->name('flash.clear');

    Route::post('/track-duration', function (Request $request) {
        $sessionId = session()->getId();
        $lastVisit = Visit::where('session_id', $sessionId)
            ->orderBy('visited_at', 'desc')
            ->first();
        if ($lastVisit && $lastVisit->duration == 0) {
            $lastVisit->update(['duration' => $request->input('duration')]);
        }

        return response()->noContent();
    })->name('track.duration')->middleware('web');

});
