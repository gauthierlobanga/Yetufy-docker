<?php

namespace App\Filament\Resources\CategoriePostPivots;

use App\Filament\Clusters\Posts\PostsCluster;
use App\Filament\Resources\CategoriePostPivots\Pages\CreateCategoriePostPivot;
use App\Filament\Resources\CategoriePostPivots\Pages\EditCategoriePostPivot;
use App\Filament\Resources\CategoriePostPivots\Pages\ListCategoriePostPivots;
use App\Filament\Resources\CategoriePostPivots\Schemas\CategoriePostPivotForm;
use App\Filament\Resources\CategoriePostPivots\Tables\CategoriePostPivotsTable;
use App\Models\PostCategoryPivot;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class CategoriePostPivotResource extends Resource
{
    protected static ?string $model = PostCategoryPivot::class;

    protected static ?string $recordTitleAttribute = 'est_principale';

    protected static ?int $navigationSort = 3;

    protected static ?string $cluster = PostsCluster::class;

    public static function form(Schema $schema): Schema
    {
        return CategoriePostPivotForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CategoriePostPivotsTable::configure($table);
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
            'index' => ListCategoriePostPivots::route('/'),
            'create' => CreateCategoriePostPivot::route('/create'),
            'edit' => EditCategoriePostPivot::route('/{record}/edit'),
        ];
    }
}
