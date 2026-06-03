<?php

namespace App\Filament\Resources\SubscriptionItems\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SubscriptionItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('subscription_id')
                    ->relationship('subscription', 'id')
                    ->required(),
                TextInput::make('stripe_id')
                    ->required(),
                TextInput::make('stripe_product')
                    ->required(),
                TextInput::make('stripe_price')
                    ->required(),
                TextInput::make('quantity')
                    ->numeric(),
                TextInput::make('meter_id'),
                TextInput::make('meter_event_name'),
            ]);
    }
}
