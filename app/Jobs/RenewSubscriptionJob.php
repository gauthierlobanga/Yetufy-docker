<?php

namespace App\Jobs;

use App\Models\Subscription;
use App\Notifications\SubscriptionRenewedNotification;
use App\Services\SubscriptionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Notification;

class RenewSubscriptionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly Subscription $subscription
    ) {}

    public function handle(SubscriptionService $subscriptionService): void
    {
        try {
            // Check if auto-renewal is enabled
            if (! $this->subscription->auto_renewal) {
                Log::info('Subscription auto-renewal disabled', [
                    'subscription_id' => $this->subscription->id,
                ]);
                return;
            }

            // Renew the subscription
            $renewed = $subscriptionService->renewSubscription($this->subscription);

            // Notify user
            if ($renewed->user) {
                Notification::send($renewed->user, new SubscriptionRenewedNotification(
                    $renewed->tenant,
                    $renewed->current_period_end
                ));
            }

            Log::info('Subscription renewed successfully', [
                'subscription_id' => $this->subscription->id,
                'tenant_id' => $this->subscription->tenant_id,
                'new_period_end' => $renewed->current_period_end,
            ]);
        } catch (\Exception $e) {
            Log::error('Error renewing subscription', [
                'subscription_id' => $this->subscription->id,
                'error' => $e->getMessage(),
            ]);

            // Retry the job
            $this->release(delay: 60); // Retry after 60 seconds
        }
    }
}
