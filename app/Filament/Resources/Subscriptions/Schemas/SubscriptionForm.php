<?php

namespace App\Filament\Resources\Subscriptions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SubscriptionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('type')
                    ->required(),
                TextInput::make('stripe_id')
                    ->required(),
                TextInput::make('stripe_status')
                    ->required(),
                TextInput::make('stripe_price'),
                TextInput::make('quantity')
                    ->numeric(),
                DateTimePicker::make('trial_ends_at'),
                DateTimePicker::make('ends_at'),
                Select::make('tenant_id')
                    ->relationship('tenant', 'id'),
                Select::make('plan_id')
                    ->relationship('plan', 'name'),
                TextInput::make('stripe_customer_id'),
                TextInput::make('stripe_subscription_id'),
                DateTimePicker::make('current_period_start'),
                DateTimePicker::make('current_period_end'),
                DateTimePicker::make('canceled_at'),
                TextInput::make('cancellation_reason'),
                Toggle::make('auto_renewal')
                    ->required(),
                TextInput::make('payment_history'),
                DateTimePicker::make('trial_started_at'),
                DateTimePicker::make('grace_period_ends_at'),
                Toggle::make('is_blocked')
                    ->required(),
            ]);
    }
}
