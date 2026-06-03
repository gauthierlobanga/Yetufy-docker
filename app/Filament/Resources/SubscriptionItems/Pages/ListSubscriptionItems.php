<?php

namespace App\Filament\Resources\SubscriptionItems\Pages;

use App\Filament\Resources\SubscriptionItems\SubscriptionItemResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSubscriptionItems extends ListRecords
{
    protected static string $resource = SubscriptionItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
