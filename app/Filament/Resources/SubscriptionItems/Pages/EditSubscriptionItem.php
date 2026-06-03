<?php

namespace App\Filament\Resources\SubscriptionItems\Pages;

use App\Filament\Resources\SubscriptionItems\SubscriptionItemResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSubscriptionItem extends EditRecord
{
    protected static string $resource = SubscriptionItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
