<?php

namespace App\Filament\Resources\SubscriptionItems;

use App\Filament\Resources\SubscriptionItems\Pages\CreateSubscriptionItem;
use App\Filament\Resources\SubscriptionItems\Pages\EditSubscriptionItem;
use App\Filament\Resources\SubscriptionItems\Pages\ListSubscriptionItems;
use App\Filament\Resources\SubscriptionItems\Schemas\SubscriptionItemForm;
use App\Filament\Resources\SubscriptionItems\Tables\SubscriptionItemsTable;
use App\Models\SubscriptionItem;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SubscriptionItemResource extends Resource
{
    protected static ?string $model = SubscriptionItem::class;


    protected static ?string $recordTitleAttribute = 'subscription_id';

    public static function form(Schema $schema): Schema
    {
        return SubscriptionItemForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SubscriptionItemsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSubscriptionItems::route('/'),
            'create' => CreateSubscriptionItem::route('/create'),
            'edit' => EditSubscriptionItem::route('/{record}/edit'),
        ];
    }
}
