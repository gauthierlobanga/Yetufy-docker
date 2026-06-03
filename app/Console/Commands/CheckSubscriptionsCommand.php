<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckSubscriptionsCommand extends Command
{
    protected $signature = 'subscriptions:check {--notify}';

    protected $description = 'Check and block expired subscriptions, optionally send notifications';

    public function handle(SubscriptionService $subscriptionService)
    {
        $this->info('Checking subscriptions...');

        try {
            // Block expired subscriptions
            $blocked = $subscriptionService->blockExpiredSubscriptions();
            $this->info("Blocked {$blocked->count()} expired subscription(s).");

            // Optionally send notifications for expiring subscriptions
            if ($this->option('notify')) {
                $notified = $subscriptionService->notifyExpiringSubscriptions();
                $this->info("Notified {$notified->count()} user(s) of expiring subscriptions.");
            }

            Log::info('Subscriptions check completed', [
                'blocked_count' => $blocked->count(),
                'notified' => $this->option('notify'),
            ]);

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Error checking subscriptions: {$e->getMessage()}");
            Log::error('Error checking subscriptions', [
                'error' => $e->getMessage(),
            ]);

            return Command::FAILURE;
        }
    }
}
