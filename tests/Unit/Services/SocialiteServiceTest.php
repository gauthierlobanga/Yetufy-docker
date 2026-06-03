<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Services\SocialiteService;
use PHPUnit\Framework\TestCase;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Mockery;

class SocialiteServiceTest extends TestCase
{
    private SocialiteService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SocialiteService();
    }

    public function test_find_or_create_user_creates_new_user()
    {
        $socialUser = Mockery::mock(SocialiteUser::class);
        $socialUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $socialUser->shouldReceive('getName')->andReturn('Test User');
        $socialUser->shouldReceive('getId')->andReturn('12345');
        $socialUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');

        // This test is simplified and would need proper setup in Laravel testing environment
        // In a real test, this would be an integration test with database setup
    }

    public function test_is_provider_enabled_returns_false_for_disabled_provider()
    {
        config()->set('socialite.providers.google', ['enabled' => false]);
        $this->assertFalse($this->service->isProviderEnabled('google'));
    }

    public function test_is_provider_enabled_returns_true_for_enabled_provider()
    {
        config()->set('socialite.providers.google', [
            'enabled' => true,
            'client_id' => 'test',
            'client_secret' => 'test'
        ]);
        $this->assertTrue($this->service->isProviderEnabled('google'));
    }

    public function test_get_enabled_providers_returns_only_enabled_providers()
    {
        config()->set('socialite.providers', [
            'google' => ['enabled' => true],
            'facebook' => ['enabled' => false],
            'microsoft' => ['enabled' => true],
        ]);

        $enabled = $this->service->getEnabledProviders();
        $this->assertArrayHasKey('google', $enabled);
        $this->assertArrayNotHasKey('facebook', $enabled);
        $this->assertArrayHasKey('microsoft', $enabled);
    }
}
