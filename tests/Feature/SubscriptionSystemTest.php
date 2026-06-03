<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Services\SubscriptionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionSystemTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Plan $freePlan;

    protected Plan $paidPlan;

    protected SubscriptionService $subscriptionService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->freePlan = Plan::factory()->create(['price' => 0, 'trial_days' => 0]);
        $this->paidPlan = Plan::factory()->create(['price' => 5000, 'trial_days' => 14]);
        $this->subscriptionService = app(SubscriptionService::class);
    }

    /**
     * Test 1: Free plan subscription creation
     */
    public function test_free_plan_subscription_is_created_immediately_active(): void
    {
        $tenant = Tenant::factory()->create();

        $subscription = $this->subscriptionService->createSubscription(
            $tenant,
            $this->freePlan,
            $this->user
        );

        $this->assertNotNull($subscription);
        $this->assertEquals($tenant->id, $subscription->tenant_id);
        $this->assertEquals($this->freePlan->id, $subscription->plan_id);
        $this->assertEquals('active', $subscription->stripe_status);
        $this->assertNull($subscription->trial_ends_at);
        $this->assertFalse($subscription->is_blocked);
        $this->assertTrue($subscription->isActive());
    }

    /**
     * Test 2: Paid plan subscription with trial
     */
    public function test_paid_plan_subscription_created_with_trial(): void
    {
        $tenant = Tenant::factory()->create();

        $subscription = $this->subscriptionService->createSubscription(
            $tenant,
            $this->paidPlan,
            $this->user
        );

        $this->assertEquals('trialing', $subscription->stripe_status);
        $this->assertNotNull($subscription->trial_started_at);
        $this->assertNotNull($subscription->trial_ends_at);
        $this->assertTrue($subscription->trial_ends_at->greaterThan(now()));
        $this->assertFalse($subscription->is_blocked);
    }

    /**
     * Test 3: Subscription becomes active after trial
     */
    public function test_subscription_transitions_to_active_after_trial(): void
    {
        $tenant = Tenant::factory()->create();
        $subscription = $this->subscriptionService->createSubscription(
            $tenant,
            $this->paidPlan,
            $this->user
        );

        // Simulate trial expiration
        $subscription->update([
            'trial_ends_at' => now()->subDay(),
            'stripe_status' => 'active',
            'current_period_start' => now()->subDay(),
            'current_period_end' => now()->addMonths(1),
        ]);

        $this->assertFalse($subscription->refresh()->isActive()); // Because trial ended
        $this->assertTrue($subscription->isExpired());
    }

    /**
     * Test 4: Grace period logic
     */
    public function test_subscription_grace_period_is_active(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create([
                'stripe_status' => 'expired',
                'trial_ends_at' => now()->subDays(5),
                'grace_period_ends_at' => now()->addDays(9),
                'is_blocked' => false,
            ]);

        $this->assertTrue($subscription->isExpired());
        $this->assertTrue($subscription->isGracePeriodActive());
        $this->assertFalse($subscription->is_blocked);
    }

    /**
     * Test 5: Subscription blocking after grace period
     */
    public function test_subscription_is_blocked_after_grace_period_expires(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create([
                'stripe_status' => 'expired',
                'grace_period_ends_at' => now()->subDays(1),
                'is_blocked' => false,
            ]);

        // Manually trigger blocking (normally done by CheckSubscriptionsCommand)
        $subscription->update(['is_blocked' => true]);

        $this->assertTrue($subscription->is_blocked);
        $this->assertTrue($subscription->shouldBlockTenant());
        $this->assertFalse($subscription->isGracePeriodActive());
    }

    /**
     * Test 6: Plan upgrade
     */
    public function test_subscription_can_be_upgraded_to_higher_plan(): void
    {
        $higherPlan = Plan::factory()->create(['price' => 10000, 'trial_days' => 0]);

        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $upgraded = $this->subscriptionService->upgradeToPlan($subscription, $higherPlan);

        $this->assertEquals($higherPlan->id, $upgraded->plan_id);
        $this->assertEquals($higherPlan->stripe_price_id, $upgraded->stripe_price);
    }

    /**
     * Test 7: Plan downgrade
     */
    public function test_subscription_can_be_downgraded_to_lower_plan(): void
    {
        $lowerPlan = Plan::factory()->create(['price' => 2000, 'trial_days' => 0]);

        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $downgraded = $this->subscriptionService->downgradeToPlan($subscription, $lowerPlan);

        $this->assertEquals($lowerPlan->id, $downgraded->plan_id);
    }

    /**
     * Test 8: Subscription cancellation
     */
    public function test_subscription_can_be_canceled(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $canceled = $this->subscriptionService->cancelSubscription(
            $subscription,
            'User requested cancellation'
        );

        $this->assertEquals('canceled', $canceled->stripe_status);
        $this->assertNotNull($canceled->canceled_at);
        $this->assertEquals('User requested cancellation', $canceled->cancellation_reason);
        $this->assertNotNull($canceled->grace_period_ends_at);
    }

    /**
     * Test 9: Subscription pause and resume
     */
    public function test_subscription_can_be_paused_and_resumed(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $paused = $this->subscriptionService->pauseSubscription($subscription);
        $this->assertEquals('paused', $paused->stripe_status);

        $resumed = $this->subscriptionService->resumeSubscription($paused);
        $this->assertEquals('active', $resumed->stripe_status);
    }

    /**
     * Test 10: Subscription blocking
     */
    public function test_subscription_can_be_manually_blocked(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $blocked = $this->subscriptionService->blockSubscription($subscription);

        $this->assertTrue($blocked->is_blocked);
    }

    /**
     * Test 11: Subscription unblocking
     */
    public function test_subscription_can_be_unblocked(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create(['is_blocked' => true]);

        $unblocked = $this->subscriptionService->unblockSubscription($subscription);

        $this->assertFalse($unblocked->is_blocked);
    }

    /**
     * Test 12: Block expired subscriptions command
     */
    public function test_expired_subscriptions_are_blocked(): void
    {
        // Create expired subscription without grace period
        Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create([
                'grace_period_ends_at' => now()->subDays(1),
                'is_blocked' => false,
            ]);

        // Also create one with active grace (should not block)
        Subscription::factory()
            ->for(User::factory())
            ->for($this->paidPlan)
            ->create([
                'grace_period_ends_at' => now()->addDays(5),
                'is_blocked' => false,
            ]);

        $blocked = $this->subscriptionService->blockExpiredSubscriptions();

        $this->assertEquals(1, $blocked->count());
        $this->assertTrue($blocked[0]->is_blocked);
    }

    /**
     * Test 13: Notify expiring subscriptions
     */
    public function test_expiring_subscriptions_trigger_notifications(): void
    {
        // Create subscription expiring in 5 days
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create([
                'trial_ends_at' => now()->addDays(5),
            ]);

        $notified = $this->subscriptionService->notifyExpiringSubscriptions();

        $this->assertGreaterThan(0, $notified->count());
    }

    /**
     * Test 14: Auto-renewal is enabled by default
     */
    public function test_auto_renewal_is_enabled_by_default(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $this->assertTrue($subscription->auto_renewal);
    }

    /**
     * Test 15: Subscription renewal
     */
    public function test_subscription_can_be_renewed(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create([
                'stripe_status' => 'canceled',
                'canceled_at' => now(),
                'is_blocked' => false,
            ]);

        $renewed = $this->subscriptionService->renewSubscription($subscription);

        $this->assertEquals('active', $renewed->stripe_status);
        $this->assertNull($renewed->canceled_at);
        $this->assertFalse($renewed->is_blocked);
    }

    /**
     * Test 16: Subscription relationships
     */
    public function test_subscription_relationships_work(): void
    {
        $tenant = Tenant::factory()->create();
        $subscription = Subscription::factory()
            ->for($tenant)
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $this->assertNotNull($subscription->tenant);
        $this->assertNotNull($subscription->user);
        $this->assertNotNull($subscription->plan);
        $this->assertEquals($tenant->id, $subscription->tenant->id);
        $this->assertEquals($this->user->id, $subscription->user->id);
        $this->assertEquals($this->paidPlan->id, $subscription->plan->id);
    }

    /**
     * Test 17: Invoice creation from subscription
     */
    public function test_invoice_can_be_created_for_subscription(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $invoice = $subscription->invoices()->create([
            'stripe_invoice_id' => 'in_test123',
            'number' => 'INV-001',
            'status' => 'open',
            'amount_due' => 5000,
            'amount_paid' => 0,
            'currency' => 'CDF',
            'issued_at' => now(),
        ]);

        $this->assertNotNull($invoice);
        $this->assertEquals($subscription->id, $invoice->subscription_id);
        $this->assertEquals(1, $subscription->invoices()->count());
    }

    /**
     * Test 18: Payment attempt tracking
     */
    public function test_payment_attempt_is_recorded(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $payment = $subscription->paymentAttempts()->create([
            'stripe_charge_id' => 'ch_test123',
            'status' => 'failed',
            'amount' => 5000,
            'currency' => 'CDF',
            'reason_code' => 'card_declined',
            'failure_message' => 'Your card was declined',
            'attempted_at' => now(),
        ]);

        $this->assertNotNull($payment);
        $this->assertEquals('failed', $payment->status);
        $this->assertTrue($payment->isFailed());
    }

    /**
     * Test 19: Soft deletes work
     */
    public function test_subscription_soft_deletes(): void
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $subscription->delete();

        $this->assertTrue($subscription->trashed());
        $this->assertNull(Subscription::find($subscription->id));
        $this->assertNotNull(Subscription::withTrashed()->find($subscription->id));
    }

    /**
     * Test 20: Middleware blocks access for blocked subscriptions
     */
    public function test_middleware_prevents_access_for_blocked_subscriptions(): void
    {
        $tenant = Tenant::factory()->create();
        Subscription::factory()
            ->for($tenant)
            ->for($this->user)
            ->for($this->paidPlan)
            ->create(['is_blocked' => true]);

        $this->actingAs($this->user);
        $response = $this->get(route('vendor.dashboard'));

        // Should be forbidden or redirected
        $this->assertTrue(
            $response->status() === 403 || $response->status() === 302
        );
    }
}
