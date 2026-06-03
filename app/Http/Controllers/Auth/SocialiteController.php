<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SocialiteService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function __construct(
        protected SocialiteService $socialiteService
    ) {}

    public function socialiteShopRedirect($provider)
    {
        // Valider que le provider est autorisé
        if (! $this->isProviderEnabled($provider)) {
            return redirect()->route('tenant.login')
                ->with('error', "Le fournisseur d'authentification {$provider} n'est pas disponible.");
        }

        try {
            $redirect = Socialite::driver($provider)->redirect();

            // Pour les providers qui nécessitent des scopes supplémentaires
            if ($provider === 'microsoft') {
                return Socialite::driver($provider)
                    ->scopes(['openid', 'profile', 'email'])
                    ->redirect();
            }

            return $redirect;
        } catch (\Exception $e) {
            Log::error("Socialite redirect error for {$provider}: ".$e->getMessage());

            return redirect()->route('tenant.login')
                ->with('error', 'Une erreur est survenue lors de la redirection. Veuillez réessayer.');
        }
    }

    public function socialiteShopCallback($provider)
    {
        // Valider que le provider est autorisé
        if (! $this->isProviderEnabled($provider)) {
            return redirect()->route('tenant.login')
                ->with('error', "Le fournisseur d'authentification {$provider} n'est pas disponible.");
        }

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            Log::error("Socialite callback error for {$provider}: ".$e->getMessage());

            return redirect()->route('tenant.login')
                ->with('error', 'Authentification échouée. Veuillez réessayer.');
        }

        try {
            $user = $this->socialiteService->findOrCreateUser($socialUser, $provider);

            Auth::login($user, remember: true);

            return redirect()->intended(route('tenant.home', absolute: false));
        } catch (\Exception $e) {
            Log::error("Error creating/updating user for {$provider}: ".$e->getMessage());

            return redirect()->route('tenant.login')
                ->with('error', 'Une erreur est survenue lors du traitement de votre compte. Veuillez contacter le support.');
        }
    }

    private function isProviderEnabled(string $provider): bool
    {
        $config = config("socialite.providers.{$provider}");

        return $config && $config['enabled'] ?? false;
    }
}
