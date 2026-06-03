<?php

namespace App\Filament\Resources\Invoices\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class InvoiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('subscription_id')
                    ->relationship('subscription', 'id')
                    ->required(),
                TextInput::make('stripe_invoice_id')
                    ->required(),
                TextInput::make('number')
                    ->required(),
                TextInput::make('status')
                    ->required(),
                TextInput::make('amount_due')
                    ->required()
                    ->numeric(),
                TextInput::make('amount_paid')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('currency')
                    ->required()
                    ->default('CDF'),
                DateTimePicker::make('issued_at'),
                DateTimePicker::make('due_at'),
                DateTimePicker::make('paid_at'),
                Textarea::make('pdf_url')
                    ->columnSpanFull(),
                TextInput::make('metadata'),
            ]);
    }
}
