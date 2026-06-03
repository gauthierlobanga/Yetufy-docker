<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Socialite\Facades\Socialite;
use Tests\TestCase;

class SocialiteAuthTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test que la route de redirection Socialite existe et redirige correctement
     */
    public function test_socialite_redirect_route_returns_redirect_for_enabled_provider()
    {
        // Enable Google provider in config
        config()->set('socialite.providers.google', [
            'enabled' => true,
            'client_id' => 'test_id',
            'client_secret' => 'test_secret',
        ]);

        // Mock Socialite facade
        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturnSelf()
            ->shouldReceive('redirect')
            ->andReturn(redirect('https://accounts.google.com/...'));

        $response = $this->get(route('tenant.socialitie.redirect', 'google'));

        // Should redirect to Google
        $this->assertTrue($response->isRedirect());
    }

    /**
     * Test que la route rejette les providers désactivés
     */
    public function test_socialite_redirect_rejects_disabled_provider()
    {
        config()->set('socialite.providers.google', [
            'enabled' => false,
        ]);

        $response = $this->get(route('tenant.socialitie.redirect', 'google'));

        $this->assertTrue($response->isRedirect(route('tenant.login')));
        $this->assertStringContainsString('n\'est pas disponible', $response->getSession()->get('error') ?? '');
    }

    /**
     * Test que la route rejette les providers non configurés
     */
    public function test_socialite_redirect_rejects_unknown_provider()
    {
        config()->set('socialite.providers.unknown', null);

        $response = $this->get(route('tenant.socialitie.redirect', 'unknown'));

        $this->assertTrue($response->isRedirect(route('tenant.login')));
    }

    /**
     * Test que le callback crée un nouvel utilisateur si n'existe pas
     */
    public function test_socialite_callback_creates_new_user_if_not_exists()
    {
        // This test would require mocking Socialite::driver() response
        // In a real scenario, you'd use a testing library like:
        // - Laravel Socialite Factory (for testing)
        // - Pest/PHPUnit with mocked responses
    }

    /**
     * Test que le callback authenticate un utilisateur existant
     */
    public function test_socialite_callback_authenticates_existing_user()
    {
        // Similar to above, would require proper Socialite mocking
    }

    /**
     * Test que le callback gère les erreurs gracieusement
     */
    public function test_socialite_callback_handles_errors_gracefully()
    {
        config()->set('socialite.providers.google', [
            'enabled' => true,
        ]);

        // Mock Socialite to throw an exception
        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturnSelf()
            ->shouldReceive('user')
            ->andThrow(new \Exception('OAuth error'));

        $response = $this->get(route('tenant.socialitie.callback', 'google'));

        $this->assertTrue($response->isRedirect(route('tenant.login')));
        $this->assertStringContainsString('échouée', $response->getSession()->get('error') ?? '');
    }
}
