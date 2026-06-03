<?php

namespace App\Filament\Resources\PaymentAttempts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PaymentAttemptForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('subscription_id')
                    ->relationship('subscription', 'id')
                    ->required(),
                TextInput::make('stripe_charge_id')
                    ->required(),
                TextInput::make('status')
                    ->required(),
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                TextInput::make('currency')
                    ->required()
                    ->default('CDF'),
                TextInput::make('reason_code'),
                Textarea::make('failure_message')
                    ->columnSpanFull(),
                DateTimePicker::make('attempted_at')
                    ->required(),
                TextInput::make('retry_count')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
