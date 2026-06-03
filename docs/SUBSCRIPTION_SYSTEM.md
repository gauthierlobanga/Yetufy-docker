# Subscription System Implementation

Complete implementation of subscription management for Yetu with Stripe integration, trial periods, grace periods, and blocking logic.

## Overview

The subscription system implements a complete lifecycle for vendor subscriptions:

### Flow for Free Plans

1. User registers with free plan → initiateRegistration()
2. VendorRequest status = PENDING (auto-approved by admin)
3. Admin approves → approve() → Subscription created with status='active'
4. Redirect directly to vendor/dashboard (no success page)
5. Full access granted immediately

### Flow for Paid Plans

1. User registers with paid plan → initiateRegistration()
2. VendorRequest status = PAYMENT_PENDING
3. Redirect to Stripe Checkout
4. Payment successful → PaymentController::success()
5. Payment verified → approve() → Subscription created with trial dates
6. Stripe webhook calls handleWebhook() if payment confirmed
7. Redirect directly to vendor/dashboard
8. Trial period begins (default 14 days)

### After Trial/Subscription Expiration

1. Subscription status becomes 'expired' after trial_ends_at
2. Grace period begins (14 days) - user warned but can still access
3. After grace_period_ends_at → Subscription marked as is_blocked=true
4. Complete access revocation via CheckTenantAccess middleware
5. Scheduled command (CheckSubscriptionsCommand) blocks expired subscriptions

## Database Models

### Subscription

- **tenant_id** (string FK): Links to tenant
- **user_id** (UUID FK): Subscription owner
- **plan_id** (UUID FK): Selected plan
- **stripe_status**: 'active', 'paused', 'canceled', 'trialing'
- **trial_started_at** / **trial_ends_at**: Trial period
- **current_period_start** / **current_period_end**: Billing period
- **grace_period_ends_at**: After-expiration grace period (14 days)
- **is_blocked** (boolean): Complete access revocation
- **auto_renewal** (boolean): Auto-renew subscription
- **payment_history** (JSON): Historical payments
- **canceled_at** / **cancellation_reason**: Cancellation info

### Invoice

- **subscription_id** (FK): Related subscription
- **stripe_invoice_id**: Stripe reference
- **number**: Auto-generated invoice number
- **status**: 'draft', 'open', 'paid', 'void', 'uncollectible'
- **amount_due** / **amount_paid**: Financial amounts
- **issued_at** / **due_at** / **paid_at**: Timestamps
- **pdf_url**: Stripe hosted PDF link

### PaymentAttempt

- **subscription_id** (FK): Related subscription
- **stripe_charge_id**: Stripe reference
- **status**: 'succeeded', 'failed', 'disputed'
- **amount** / **currency**: Transaction details
- **reason_code** / **failure_message**: Error details
- **attempted_at**: When payment was attempted
- **retry_count**: Retry attempts

## Services

### SubscriptionService

Main service handling all subscription operations:

```php
// Core operations
createSubscription(Tenant $tenant, Plan $plan, User $user): Subscription
renewSubscription(Subscription $subscription): Subscription
cancelSubscription(Subscription $subscription, string $reason = null): Subscription
pauseSubscription(Subscription $subscription): Subscription
resumeSubscription(Subscription $subscription): Subscription

// Plan changes
upgradeToPlan(Subscription $subscription, Plan $newPlan): Subscription
downgradeToPlan(Subscription $subscription, Plan $newPlan): Subscription

// Access control
blockSubscription(Subscription $subscription): Subscription
unblockSubscription(Subscription $subscription): Subscription

// Bulk operations
blockExpiredSubscriptions(): Collection
notifyExpiringSubscriptions(): Collection
syncWithStripe(): Collection

// Webhook handlers
handleStripeEvent(array $event): void
handleSubscriptionCreated($stripeSubscription): void
handleSubscriptionUpdated($stripeSubscription): void
handleSubscriptionDeleted($stripeSubscription): void
handleInvoiceCreated($stripeInvoice): void
handleInvoicePaid($stripeInvoice): void
handlePaymentFailed($stripeInvoice): void
handleChargeFailed($stripeCharge): void
```

### VendorRegistrationService (Updated)

Enhanced to create subscriptions automatically after approval.

**Changes:**

- Now injects SubscriptionService
- approve() calls SubscriptionService::createSubscription()
- Subscriptions created for both free and paid plans

### PaymentService (Updated)

Enhanced to trigger subscription creation after payment.

**Changes:**

- Now injects VendorRegistrationService
- handleCheckoutCompleted() calls VendorRegistrationService::approve()
- Full subscription created immediately after payment success

## Controllers

### Tenant/SubscriptionController

Manages tenant subscriptions:

- **show()**: Display subscription status, plan details, and invoices
- **upgrade()**: Upgrade to higher tier plan
- **downgrade()**: Downgrade to lower tier plan
- **cancel()**: Cancel subscription (with grace period)
- **pause()**: Temporarily pause subscription
- **resume()**: Reactivate paused subscription
- **invoices()**: Paginated invoice history

### Admin/SubscriptionController

Manages all subscriptions (admin only):

- **index()**: List all subscriptions with filters (status, blocked, plan, search)
- **show()**: View subscription details, invoices, and payment attempts
- **block()**: Manually block subscription/tenant access
- **unblock()**: Restore blocked subscription/tenant access
- **renew()**: Manually renew subscription
- **addGracePeriod()**: Extend grace period (max 90 days)
- **expiredToBlock()**: Block all expired subscriptions (scheduled)
- **notifyExpiring()**: Send expiration warnings (scheduled)
- **syncWithStripe()**: Sync all subscriptions with Stripe

## Middlewares

### EnsureTenantSubscription

Protects tenant routes from expired/invalid subscriptions:

- Allows active subscriptions through
- Allows grace period access with warning
- Blocks access after grace period
- Redirects to `tenant.subscription.expired` if blocked

### CheckTenantAccess

Checks if tenant or subscription is blocked:

- Denies if subscription `is_blocked = true`
- Denies if tenant status ≠ STATUT_ACTIF
- Returns 403 Forbidden with custom message

## Events

All events broadcast on private tenant channels for real-time updates:

- **TenantSubscriptionCreated**: When subscription created
- **TenantSubscriptionRenewed**: When subscription renewed
- **TenantSubscriptionCanceled**: When subscription canceled
- **TenantSubscriptionBlocked**: When subscription/tenant blocked
- **PaymentFailed**: When payment fails

## Notifications

All queued for async delivery via mail and database:

- **SubscriptionExpiringNotification**: Warns 7 days before expiration
- **PaymentFailedNotification**: Error details and recovery steps
- **SubscriptionCanceledNotification**: Cancellation confirmation with grace period date
- **SubscriptionRenewedNotification**: Renewal confirmation with new period end

## Commands & Jobs

### CheckSubscriptionsCommand

```bash
php artisan subscriptions:check          # Just block expired
php artisan subscriptions:check --notify # Block + send warnings
```

Checks and blocks expired subscriptions. Runs daily via scheduler.

### RenewSubscriptionJob

Renews individual subscription when dispatched. Checks auto_renewal flag, sends notification, retries on failure.

### NotifyExpiringSubscriptionsJob

Sends expiration warnings for subscriptions expiring within 7 days. Runs daily via scheduler.

## Routes

### Tenant Routes (authenticated users)

```
GET    /subscription              - Show subscription status
POST   /subscription/upgrade      - Upgrade plan
POST   /subscription/downgrade    - Downgrade plan
POST   /subscription/cancel       - Cancel subscription
POST   /subscription/pause        - Pause subscription
POST   /subscription/resume       - Resume subscription
GET    /subscription/invoices     - View invoices
```

### Admin Routes

```
GET    /admin/subscriptions                             - List subscriptions
GET    /admin/subscriptions/{subscription}              - View details
POST   /admin/subscriptions/{subscription}/block        - Block access
POST   /admin/subscriptions/{subscription}/unblock      - Restore access
POST   /admin/subscriptions/{subscription}/renew        - Manual renewal
POST   /admin/subscriptions/{subscription}/add-grace-period - Extend grace
POST   /admin/subscriptions/batch/expired-to-block      - Block all expired
POST   /admin/subscriptions/batch/notify-expiring       - Send warnings
POST   /admin/subscriptions/batch/sync-stripe           - Sync with Stripe
```

### Central Routes (existing)

```
GET    /devenir-vendeur                  - Choose plan
GET    /devenir-vendeur/configurer       - Configure shop
POST   /devenir-vendeur/store            - Submit registration
GET    /devenir-vendeur/paiement         - Payment page
GET    /devenir-vendeur/paiement/checkout - Stripe checkout
GET    /devenir-vendeur/paiement/succes  - Payment success
POST   /stripe/webhook                   - Stripe webhook
```

## Configuration

### .env Settings

```
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

QUEUE_CONNECTION=database  # For notifications
```

### Scheduler (Kernel.php)

```php
$schedule->command('subscriptions:check --notify')
    ->daily()
    ->at('02:00');

$schedule->job(new NotifyExpiringSubscriptionsJob)
    ->daily()
    ->at('08:00');
```

## Key Features

### Trial System

- Free plans: Active immediately, no trial
- Paid plans: Trial period (configurable per plan, default 14 days)
- Trial status: `stripe_status = 'trialing'`
- Trial end triggers grace period

### Grace Period

- Default: 14 days after trial/subscription expiration
- User gets warning but can still access shop
- After grace period ends → Complete block via middleware
- Admin can extend grace period manually (max 90 days)

### Blocking Logic

**Soft Block (During Grace Period):**

- User warned via notification
- Warning displayed in UI
- Full access maintained

**Hard Block (After Grace Period):**

- `is_blocked = true` set on Subscription
- CheckTenantAccess middleware denies all requests
- User redirected to blocked page
- Cannot access dashboard/products/orders

### Auto-Renewal

- Enabled by default
- Only renews if `auto_renewal = true` and payment succeeds
- Triggered by Stripe webhooks or RenewSubscriptionJob
- Payment failures create PaymentAttempt records for retry

## Security Considerations

1. **Access Control**
   - Both EnsureTenantSubscription and CheckTenantAccess protect routes
   - subscription() middleware relationship ensures tenant isolation

2. **Payment Verification**
   - Stripe webhooks used as source of truth
   - Session-based verification as fallback
   - All payments logged with retry count

3. **Grace Period**
   - Prevents sudden access loss
   - Sends multiple warnings before blocking
   - Admin can extend for special cases

4. **Webhook Validation**
   - Stripe signature verification required
   - Stripe API key from config (not secrets file)
   - All webhook events logged

## Testing Checklist

- [ ] Free plan: Registration → Immediate approval → Direct dashboard redirect
- [ ] Free plan: No trial period, immediate access
- [ ] Paid plan: Registration → Payment page → Stripe checkout
- [ ] Paid plan: Payment success → Tenant created → Trial period active
- [ ] Payment success: Redirect to vendor/dashboard (not success page)
- [ ] Trial expiration: Grace period begins with warning
- [ ] Grace period expiration: Subscription blocked, complete access revoked
- [ ] Middleware: EnsureTenantSubscription allows during grace, blocks after
- [ ] Middleware: CheckTenantAccess blocks immediately if is_blocked=true
- [ ] Admin: Can view all subscriptions with filters
- [ ] Admin: Can block/unblock subscriptions manually
- [ ] Admin: Can extend grace period
- [ ] Command: `subscriptions:check --notify` blocks and notifies correctly
- [ ] Notifications: Email sent to user on expiration warnings
- [ ] Notifications: Database notification created
- [ ] Upgrade/Downgrade: Plan change works correctly
- [ ] Cancel: Subscription canceled, grace period set
- [ ] Pause/Resume: Status changes work correctly

## Troubleshooting

**Subscription not created after payment**

- Check PaymentService::handleCheckoutCompleted() is called
- Check webhook logs for Stripe events
- Verify PaymentService has VendorRegistrationService injected

**User blocked unexpectedly**

- Check if grace_period_ends_at has passed
- Check if is_blocked flag was set manually
- Review CheckTenantAccess middleware logic

**Payment failures not recorded**

- Check PaymentAttempt model for stripe_charge_id
- Verify webhook received charge.failed event
- Check SubscriptionService::handleChargeFailed()

**Grace period not working**

- Verify grace_period_ends_at is set to now()->addDays(14)
- Check middleware order: EnsureTenantSubscription must run
- Verify isGracePeriodActive() method logic

## Future Enhancements

- Stripe billing portal integration for self-service management
- Dunning/retry logic for failed payments
- Plan switching proration calculations
- Usage-based billing support
- Subscription pause/resume in Stripe
- Invoice delivery via email
- Subscription transfer between users
