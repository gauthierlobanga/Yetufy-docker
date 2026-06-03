<?php

namespace App\Providers;

use App\Listeners\RedirectVendorAfterLogin;
use App\Models\Client;
use App\Models\Commande;
use App\Models\ItemPanier;
use App\Models\MouvementStock;
use App\Models\Paiement;
use App\Models\Panier;
use App\Models\Produit;
use App\Models\Promotion;
use App\Models\Retour;
use App\Models\User;
use App\Observers\TenantRealtimeActivityObserver;
use App\Observers\UserObserver;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthenticationRedirects();
        $this->registerTenantRealtimeObservers();
        View::addNamespace('layouts', resource_path('views/layouts'));

        if (! app()->runningInConsole() && ! tenancy()->initialized) {
            User::observe(UserObserver::class);
        }

        Event::listen(Login::class, RedirectVendorAfterLogin::class);

        Authenticate::redirectUsing(function ($request) {
            if (! $request->expectsJson()) {
                return route('central.login');
            }
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function registerTenantRealtimeObservers(): void
    {
        $observer = TenantRealtimeActivityObserver::class;

        Commande::observe($observer);
        Paiement::observe($observer);
        Produit::observe($observer);
        Promotion::observe($observer);
        Client::observe($observer);
        Panier::observe($observer);
        ItemPanier::observe($observer);
        Retour::observe($observer);
        MouvementStock::observe($observer);
    }

    protected function configureAuthenticationRedirects(): void
    {
        // Redirection quand l'utilisateur N'EST PAS connecté
        Authenticate::redirectUsing(function ($request) {
            if (! $request->expectsJson()) {
                return route('central.login');
            }
        });

        // Redirection quand l'utilisateur EST DÉJÀ connecté
        RedirectIfAuthenticated::redirectUsing(function (Request $request): string {
            $user = $request->user();

            if (function_exists('tenancy') && tenancy()->initialized) {
                if ($user && $this->userOwnsCurrentTenant($user->id)) {
                    return '/vendor/dashboard';
                }

                return route('acheteur.dashboard');
            }

            if ($user && $user->tenants()->wherePivot('is_owner', true)->exists()) {
                return route('central.account-selection.index');
            }

            return route('plan.index');
        });
    }

    protected function userOwnsCurrentTenant(string $userId): bool
    {
        $tenant = tenant();

        if (! $tenant) {
            return false;
        }

        return DB::connection(config('tenancy.database.central_connection', config('database.default')))
            ->table('user_tenant')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $userId)
            ->where('is_owner', true)
            ->exists();
    }
}
