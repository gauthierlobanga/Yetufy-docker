<?php

namespace App\Filament\Pages;

use App\Enums\NavigationGroup;
use App\Settings\SettingApp;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;
use UnitEnum;

class ManageAppSettings extends SettingsPage
{
    protected static string $settings = SettingApp::class;

    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Profile;

    protected static ?string $navigationLabel = 'Paramètres';

    protected static ?string $title = 'Paramètres de l’application';

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['logo_url'] = SettingApp::normalizeLogoPath($data['logo_url'] ?? null);

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $settings = app(SettingApp::class);

        $oldLogo = SettingApp::normalizeLogoPath($settings->logo_url);
        $newLogo = SettingApp::normalizeLogoPath($data['logo_url'] ?? null);

        if ($oldLogo && $oldLogo !== $newLogo) {
            Storage::disk('public')->delete($oldLogo);
        }

        $data['logo_url'] = $newLogo;

        return $data;
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        TextInput::make('name')
                            ->label('Nom de l’application')
                            ->required()
                            ->maxLength(255),

                        FileUpload::make('logo_url')
                            ->label('Logo')
                            ->image()
                            ->disk('public')
                            ->directory('settings')
                            ->visibility('public')
                            ->maxSize(1024),
                    ]),
            ]);
    }
}
