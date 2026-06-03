# Subscription System Testing Guide

Complete testing procedures for the subscription system implementation.

## Prerequisites

```bash
# Set up test database
php artisan migrate:fresh --env=testing

# Seed test data
php artisan db:seed --env=testing

# Run tests
php artisan test --env=testing

# Run with coverage
php artisan test --env=testing --coverage
```

## Manual Testing Checklist

### 1. Free Plan Registration & Activation

**Scenario: Free plan → Immediate access**

Steps:

1. Go to `/devenir-vendeur`
2. Select "Gratuit" (free) plan
3. Fill configuration form (shop name, slug, etc.)
4. Submit registration (vendeurStore)
5. ✓ Should see immediate VendorRequest creation
6. ✓ Admin approves VendorRequest
7. ✓ Subscription created with status='active'
8. ✓ Tenant status set to ACTIF
9. ✓ Redirected directly to `/vendor/dashboard`
10. ✓ No success page shown
11. ✓ User has full access immediately
12. ✓ No trial period active
13. ✓ subscription.trial_ends_at = NULL

**Expected Database State:**

```
Subscription:
  - stripe_status = 'active'
  - trial_ends_at = NULL
  - is_blocked = false
  - auto_renewal = true
  - current_period_end = NULL (free plans)

VendorRequest:
  - status = 'approved'

Tenant:
  - statut = 'actif'
  - date_activation = NOW
  - date_expiration = NULL (no trial)
```

---

### 2. Paid Plan Registration & Stripe Checkout

**Scenario: Paid plan → Checkout → Payment → Subscription with trial**

Steps:

1. Go to `/devenir-vendeur`
2. Select "Pro" (paid) plan (e.g., 5000 CDF)
3. Fill configuration form
4. Submit registration (vendeurStore)
5. ✓ VendorRequest created with status='payment_pending'
6. ✓ Redirected to `/devenir-vendeur/paiement`
7. ✓ Payment page shows plan details with formatted price
8. ✓ Click "Payer..." button
9. ✓ Redirected to Stripe Checkout
10. ✓ Fill test card: `4242 4242 4242 4242`
11. ✓ Enter future expiry (MM/YY)
12. ✓ Enter any CVC (3 digits)
13. ✓ Enter email address
14. ✓ Click "Pay"
15. ✓ Redirected to `/devenir-vendeur/paiement/succes?session_id=...`
16. ✓ Payment verified successfully
17. ✓ VendorRequest status updated to 'approved'
18. ✓ Tenant created with plan_id set
19. ✓ Subscription created with:
    - stripe_status = 'trialing'
    - trial_started_at = NOW
    - trial_ends_at = NOW + 14 days
    - is_blocked = false
20. ✓ Redirected to `/vendor/dashboard`
21. ✓ User has full access

**Expected Database State:**

```
Subscription:
  - stripe_status = 'trialing'
  - trial_started_at = NOW
  - trial_ends_at = NOW + 14 days
  - current_period_end = NULL (during trial)
  - is_blocked = false
  - auto_renewal = true

VendorRequest:
  - status = 'approved'
  - payment_status = 'paid'

Invoice:
  - status = 'draft' (pending first billing)
  
Tenant:
  - plan_id = <paid_plan_id>
  - date_activation = NOW
  - date_expiration = NOW + 14 days
```

---

### 3. Trial Expiration → Grace Period

**Scenario: Trial expires but grace period active**

Prerequisites:

- Subscription with trial_ends_at = 5 days ago

Steps:

1. Run `php artisan subscriptions:check`
2. ✓ Subscription NOT blocked yet (grace period active)
3. ✓ User still has full dashboard access
4. ✓ /subscription shows warning:
   - "Your subscription has expired"
   - "You have access until [grace_period_end_date]"
5. ✓ Try accessing /products, /orders → All work
6. ✓ User receives notification email: "Subscription expiring"
7. ✓ Database shows:
   - grace_period_ends_at = trial_ends_at + 14 days
   - is_blocked = false

**Verification Commands:**

```bash
# Check middleware allows access during grace
php artisan tinker
> $subscription = Subscription::first();
> $subscription->isActive();  // false
> $subscription->isGracePeriodActive();  // true
> $subscription->grace_period_ends_at; // future date
```

---

### 4. Grace Period Expiration → Complete Block

**Scenario: Grace period ends, access completely blocked**

Prerequisites:

- Subscription with grace_period_ends_at = 1 day ago

Steps:

1. Run `php artisan subscriptions:check --notify`
2. ✓ Subscription marked as blocked:
   - is_blocked = true
3. ✓ Try accessing any tenant route → 403 Forbidden
4. ✓ Redirected to access-denied error page
5. ✓ Message: "Your access has been blocked"
6. ✓ /vendor/dashboard → 403 with custom error
7. ✓ /subscription → 403 (can't view own subscription)
8. ✓ /products, /orders → All return 403
9. ✓ Can still view public shop (if not behind auth)

**Verification Commands:**

```bash
# Check blocking logic
php artisan tinker
> $subscription = Subscription::first();
> $subscription->is_blocked;  // true
> $subscription->isGracePeriodActive();  // false
> $subscription->isExpired();  // true

# Check middleware blocks all routes
curl -H "Cookie: LARAVEL_SESSION=..." http://tenant.localhost/vendor/dashboard
# Should return 403
```

---

### 5. Admin Manual Blocking

**Scenario: Admin blocks tenant for policy violation**

Steps:

1. Login as admin
2. Go to `/admin/subscriptions`
3. ✓ See list of all subscriptions
4. Click subscription to view details
5. Click "Block subscription" button
6. ✓ Subscription.is_blocked = true
7. ✓ Event TenantSubscriptionBlocked dispatched
8. Tenant tries to access shop
9. ✓ Returns 403 Forbidden immediately
10. ✓ Admin can view blocking reason in subscription details

**Expected State:**

```
Subscription:
  - is_blocked = true
  - grace_period_ends_at = NULL (hard block, no grace)

Event:
  - TenantSubscriptionBlocked fired
```

---

### 6. Admin Unblocking

**Scenario: Admin restores blocked subscription**

Steps:

1. Admin goes to blocked subscription details
2. Click "Unblock subscription" button
3. ✓ Subscription.is_blocked = false
4. ✓ Event TenantSubscriptionUnblocked (implied in code)
5. Tenant tries to access shop
6. ✓ Access restored if subscription is otherwise valid
7. ✓ Dashboard loads successfully

---

### 7. Upgrade Plan

**Scenario: User upgrades from Starter to Pro**

Prerequisites:

- Active subscription on "Starter" plan (1000 CDF/month)
- User viewing /subscription page

Steps:

1. Click "Change plan" button
2. ✓ Shown available plans (excluding current plan)
3. Select "Pro" plan (5000 CDF/month)
4. Confirm upgrade
5. ✓ POST to `/subscription/upgrade`
6. ✓ Subscription.plan_id updated
7. ✓ Subscription.stripe_price updated
8. ✓ Stripe subscription updated via API
9. ✓ Redirected back to /subscription
10. ✓ Message: "Plan upgraded successfully"
11. ✓ Plan name changed to "Pro"
12. ✓ Price shown as new price

**Expected State:**

```
Subscription:
  - plan_id = <pro_plan_id>
  - stripe_price = <pro_stripe_price>
```

---

### 8. Downgrade Plan

**Scenario: User downgrades from Pro to Starter**

Steps:

1. From /subscription, click "Change plan"
2. Select lower-tier plan
3. Confirm downgrade
4. ✓ Subscription updated
5. ✓ Stripe subscription downgraded
6. ✓ Takes effect on next billing cycle
7. ✓ Success message shown

---

### 9. Cancel Subscription

**Scenario: User cancels subscription**

Steps:

1. Click "Cancel subscription" button on /subscription
2. Modal appears asking confirmation
3. Optionally enter cancellation reason
4. Click "Cancel my subscription"
5. ✓ POST to `/subscription/cancel`
6. ✓ Subscription updated:
   - stripe_status = 'canceled'
   - canceled_at = NOW
   - grace_period_ends_at = NOW + 14 days
   - is_blocked = false (still have grace!)
7. ✓ Redirected back to /subscription
8. ✓ Message: "Subscription canceled. You have access for 14 more days"
9. ✓ Subscription page shows "Canceled" status
10. ✓ Grace period countdown displayed
11. ✓ User receives notification email

**Behavior After Cancel:**

- Days 1-14 (Grace): Full access, warning shown
- Day 15+: Complete block via middleware

---

### 10. Pause & Resume

**Scenario: User pauses then resumes subscription**

Steps - Pause:

1. Click "Pause subscription"
2. ✓ Subscription.stripe_status = 'paused'
3. ✓ No charge during pause
4. ✓ Access continues

Steps - Resume:

1. Click "Resume subscription"
2. ✓ Subscription.stripe_status = 'active'
3. ✓ Billing resumes
4. ✓ Full access continues

---

### 11. Invoice Generation & Download

**Scenario: Invoice created and available**

Prerequisites:

- Active paid subscription

Steps:

1. Subscription enters active billing period
2. Stripe creates invoice automatically
3. Webhook received: `invoice.created`
4. ✓ Invoice record created in DB:
   - stripe_invoice_id = set
   - number = auto-generated
   - status = 'draft' → 'open'
5. ✓ Invoice appears in /subscription/invoices
6. Click "Download" button
7. ✓ Navigates to Stripe PDF URL
8. ✓ PDF opens (hosted on Stripe)
9. ✓ invoice.pdf_url = valid URL

**Invoice Lifecycle:**

```
draft (just created) → open (awaiting payment) → paid (payment received)
```

---

### 12. Payment Failure & Retry

**Scenario: Payment fails, system handles it**

Steps:

1. Subscription configured with declined payment method
2. Billing date arrives
3. Stripe attempts payment
4. ✓ Payment fails
5. Webhook received: `charge.failed`
6. ✓ PaymentAttempt record created:
   - status = 'failed'
   - reason_code = 'card_declined' (example)
   - failure_message = detailed error
7. ✓ User receives email notification
8. ✓ Subscription remains active (no immediate block)
9. ✓ Admin can see retry count and failures
10. Stripe retries multiple times (3 retries default)

---

### 13. Admin Subscription Management

**Scenario: Admin views and manages subscriptions**

Steps:

1. Admin goes to `/admin/subscriptions`
2. ✓ Sees paginated list of ALL subscriptions
3. ✓ Can filter by:
   - Status (active, trialing, canceled, paused)
   - Blocked (yes/no)
   - Plan
   - Search by tenant name/slug
4. Click subscription to view full details
5. ✓ Detailed page shows:
   - Current status and dates
   - Invoice history
   - Payment attempts (failed attempts)
   - All historical information
6. Admin can:
   - Block/unblock subscription
   - Manually renew
   - Add grace period (specify days, max 90)
7. Admin can trigger batch operations:
   - `/admin/subscriptions/batch/expired-to-block`
     → Blocks all expired without grace
   - `/admin/subscriptions/batch/notify-expiring`
     → Sends expiration warnings for those expiring in 7 days
   - `/admin/subscriptions/batch/sync-stripe`
     → Syncs all subscriptions with Stripe

---

### 14. Database Integrity

**Scenario: Check database state after each operation**

Commands to verify:

```bash
php artisan tinker

# Check subscription exists
> $sub = Subscription::first();

# Verify relationships
> $sub->tenant;           // Should exist
> $sub->user;            // Should exist
> $sub->plan;            // Should exist
> $sub->invoices;        // Collection
> $sub->paymentAttempts; // Collection

# Check dates
> $sub->trial_started_at;      // datetime or null
> $sub->trial_ends_at;         // datetime or null
> $sub->current_period_start;  // datetime
> $sub->current_period_end;    // datetime
> $sub->grace_period_ends_at;  // datetime or null
> $sub->canceled_at;           // datetime or null

# Check flags
> $sub->is_blocked;     // boolean
> $sub->auto_renewal;   // boolean

# Check methods
> $sub->isActive();              // true/false
> $sub->isExpired();             // true/false
> $sub->isGracePeriodActive();   // true/false
> $sub->shouldBlockTenant();     // true/false
```

---

## Automated Tests

Create test file: `tests/Feature/SubscriptionTest.php`

```php
<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Plan $freePlan;
    protected Plan $paidPlan;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->freePlan = Plan::factory()->free()->create();
        $this->paidPlan = Plan::factory()->paid()->create();
    }

    /** @test */
    public function free_plan_user_redirects_to_dashboard()
    {
        $this->actingAs($this->user);
        
        $response = $this->post(route('vendor.store'), [
            'plan_id' => $this->freePlan->id,
            'shop_name' => 'Test Shop',
            'shop_slug' => 'test-shop',
        ]);

        // Check subscription created
        $subscription = Subscription::latest()->first();
        $this->assertNotNull($subscription);
        $this->assertTrue($subscription->isActive());
        $this->assertNull($subscription->trial_ends_at);

        // Check redirect to dashboard
        $response->assertRedirect(route('vendor.dashboard'));
    }

    /** @test */
    public function paid_plan_redirects_to_checkout()
    {
        $this->actingAs($this->user);
        
        $response = $this->post(route('vendor.store'), [
            'plan_id' => $this->paidPlan->id,
            'shop_name' => 'Test Shop',
            'shop_slug' => 'test-shop',
        ]);

        $response->assertRedirect(route('vendor.payment'));
    }

    /** @test */
    public function subscription_created_with_correct_trial_dates()
    {
        $tenant = Tenant::factory()->create();
        $subscription = Subscription::factory()
            ->for($tenant)
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $this->assertTrue($subscription->isActive());
        $this->assertFalse($subscription->isExpired());
        $this->assertFalse($subscription->is_blocked);
    }

    /** @test */
    public function expired_subscription_can_be_blocked()
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->expired()
            ->create();

        $daysAfterGrace = now()->addDays(15);
        $subscription->update(['grace_period_ends_at' => $daysAfterGrace->subDays(16)]);

        $this->assertTrue($subscription->isExpired());
        $this->assertTrue($subscription->isGracePeriodActive() === false);
        $this->assertTrue($subscription->shouldBlockTenant());
    }

    /** @test */
    public function grace_period_allows_access()
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->expired()
            ->create([
                'grace_period_ends_at' => now()->addDays(7),
            ]);

        $this->assertTrue($subscription->isExpired());
        $this->assertTrue($subscription->isGracePeriodActive());
        $this->assertFalse($subscription->is_blocked);
    }

    /** @test */
    public function plan_upgrade_updates_subscription()
    {
        $newPlan = Plan::factory()->paid()->create(['price' => 10000]);
        
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $this->subscriptionService->upgradeToPlan($subscription, $newPlan);

        $this->assertEquals($newPlan->id, $subscription->refresh()->plan_id);
    }

    /** @test */
    public function subscription_can_be_canceled()
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $this->subscriptionService->cancelSubscription($subscription, 'User requested');

        $subscription->refresh();
        $this->assertEquals('canceled', $subscription->stripe_status);
        $this->assertNotNull($subscription->canceled_at);
        $this->assertNotNull($subscription->grace_period_ends_at);
    }

    /** @test */
    public function blocked_subscriptions_prevent_access()
    {
        $tenant = Tenant::factory()->create();
        $subscription = Subscription::factory()
            ->for($tenant)
            ->for($this->user)
            ->for($this->paidPlan)
            ->create(['is_blocked' => true]);

        $this->actingAs($this->user)->get(route('vendor.dashboard'))
            ->assertStatus(403);
    }

    /** @test */
    public function invoice_is_created_from_webhook()
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $event = [
            'type' => 'invoice.created',
            'data' => [
                'object' => [
                    'id' => 'in_test123',
                    'subscription' => $subscription->stripe_subscription_id,
                    'status' => 'draft',
                    'amount_due' => 500000,
                    'amount_paid' => 0,
                    'currency' => 'cdf',
                    'created' => now()->timestamp,
                    'due_date' => now()->addDays(30)->timestamp,
                    'hosted_invoice_url' => 'https://stripe.com/...',
                ],
            ],
        ];

        $this->subscriptionService->handleStripeEvent($event);

        $this->assertTrue($subscription->invoices()->exists());
    }

    /** @test */
    public function payment_attempt_recorded_on_charge_failed()
    {
        $subscription = Subscription::factory()
            ->for($this->user)
            ->for($this->paidPlan)
            ->create();

        $event = [
            'type' => 'charge.failed',
            'data' => [
                'object' => [
                    'id' => 'ch_test123',
                    'customer' => $subscription->stripe_customer_id,
                    'amount' => 500000,
                    'currency' => 'cdf',
                    'failure_code' => 'card_declined',
                    'failure_message' => 'Your card was declined',
                    'created' => now()->timestamp,
                ],
            ],
        ];

        $this->subscriptionService->handleStripeEvent($event);

        $this->assertTrue($subscription->paymentAttempts()->exists());
    }
}
```

---

## Stripe Test Cards

Use these cards for testing different scenarios:

| Card Number | Result |
|------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 0069 | Expired card |
| 4000 0000 0000 3220 | Requires authentication |
| 5555 5555 5555 4444 | Mastercard success |

---

## Load Testing

Test scheduled commands under load:

```bash
# Test CheckSubscriptionsCommand with many subscriptions
php artisan db:seed --env=testing --class=SubscriptionSeeder

# Run command
time php artisan subscriptions:check --notify

# Expected: Completes in < 5 seconds for 10,000 subscriptions
```

---

## Performance Benchmarks

Expected performance metrics:

- Subscription creation: < 200ms
- Upgrade/downgrade: < 300ms
- Stripe sync (1000 subs): < 5s
- Middleware check (per request): < 10ms
- Database queries: All indexed

---

## Troubleshooting Test Failures

**Webhook not processing:**

- Check STRIPE_WEBHOOK_SECRET in .env
- Verify webhook signature validation

**Subscription not transitioning to blocked:**

- Check grace_period_ends_at is in the past
- Verify CheckSubscriptionsCommand runs
- Check middleware is applied to route

**Invoice not appearing:**

- Verify stripe_subscription_id is set
- Check invoice.created webhook received
- Look at payment_history JSON field

---

## CI/CD Integration

Add to `.github/workflows/tests.yml`:

```yaml
- name: Run subscription tests
  run: |
    php artisan migrate:fresh --env=testing
    php artisan test --env=testing tests/Feature/SubscriptionTest.php --coverage
```
