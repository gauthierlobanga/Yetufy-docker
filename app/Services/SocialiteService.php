<?php

namespace App\Services;

use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class SocialiteService
{
    /**
     * Find existing user or create a new one from socialite provider
     */
    public function findOrCreateUser(SocialiteUser $socialUser, string $provider): User
    {
        $email = $socialUser->getEmail();

        $user = User::where('email', $email)->first();

        if ($user) {
            // Update provider info if user already exists but doesn't have this provider linked
            if (! $user->provider_id || $user->provider !== $provider) {
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar() ?? $user->avatar,
                ]);
            }

            return $user;
        }

        // Create new user
        return User::create([
            'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? $email,
            'email' => $email,
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'email_verified_at' => now(),
            'password' => bcrypt(uniqid()), // Random password since they use OAuth
        ]);
    }

    /**
     * Get enabled providers
     */
    public function getEnabledProviders(): array
    {
        $providers = config('socialite.providers', []);
        $enabled = [];

        foreach ($providers as $name => $config) {
            if ($config['enabled'] ?? false) {
                $enabled[$name] = $config;
            }
        }

        return $enabled;
    }

    /**
     * Check if a provider is enabled
     */
    public function isProviderEnabled(string $provider): bool
    {
        $config = config("socialite.providers.{$provider}");

        return $config && ($config['enabled'] ?? false);
    }
}
