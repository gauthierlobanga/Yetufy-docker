<?php

namespace App\Filament\Pages;

use App\Enums\NavigationGroup;
use App\Settings\SettingApp;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;
use UnitEnum;

class ManageAppSettings extends SettingsPage
{
     protected static string $settings = SettingApp::class;

    protected static string|UnitEnum|null $navigationGroup = NavigationGroup::Profile;

    protected static ?string $navigationLabel = 'Paramètres généraux';

    protected static ?string $title = 'Paramètres de l’application';

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Normalise le chemin du logo pour l'afficheur du formulaire
        $data['logo_url'] = SettingApp::normalizeLogoPath($data['logo_url'] ?? null);

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $settings = app(SettingApp::class);

        // Ancien logo (normalisé)
        $oldLogo = SettingApp::normalizeLogoPath($settings->logo_url);
        // Nouveau logo (normalisé)
        $newLogo = SettingApp::normalizeLogoPath($data['logo_url'] ?? null);

        // Si le logo a changé, on supprime l'ancien fichier
        if ($oldLogo && $oldLogo !== $newLogo) {
            Storage::disk('public')->delete($oldLogo);
        }

        // On remplace par le chemin normalisé dans les données à sauvegarder
        $data['logo_url'] = $newLogo;

        return $data;
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Logo de l\'application')
                    ->icon('heroicon-o-building-office')
                    ->description('Le logo et nom de votre application, affiché dans le pied de page, header Format recommandé : PNG ou SVG, fond transparent.')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nom de l’application')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Ex: Immo RDC'),

                        FileUpload::make('logo_url')
                            ->label('Logo')
                            ->image()
                            ->disk('public')
                            ->directory('settings')
                            ->visibility('public')
                            ->maxSize(2048)
                            ->helperText('Format recommandé : PNG ou SVG, fond transparent.'),
                    ]),

                Section::make('Identité de l’agence')
                    ->icon('heroicon-o-share')
                    ->description('Informations de contact et réseaux sociaux affichés dans le pied de page.')
                    ->schema([
                        Grid::make(2)
                            ->schema([

                                TextInput::make('address')
                                    ->label('Adresse')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('123 Avenue de l’Immobilier, Kinshasa'),

                                TextInput::make('phone')
                                    ->label('Téléphone')
                                    ->required()
                                    ->tel()
                                    ->maxLength(30)
                                    ->placeholder('+243 123 456 789'),

                                TextInput::make('email')
                                    ->label('Email')
                                    ->required()
                                    ->email()
                                    ->maxLength(255)
                                    ->placeholder('contact@immo-rdc.cd'),

                                TextInput::make('facebook_url')
                                    ->label('Facebook')
                                    ->url()
                                    ->placeholder('https://facebook.com/votrepage'),
                                TextInput::make('instagram_url')
                                    ->label('Instagram')
                                    ->url()
                                    ->placeholder('https://instagram.com/votrecompte'),
                                TextInput::make('x_url')
                                    ->label('X (Twitter)')
                                    ->url()
                                    ->placeholder('https://x.com/votrecompte'),
                                TextInput::make('linkedin_url')
                                    ->label('LinkedIn')
                                    ->url()
                                    ->placeholder('https://linkedin.com/company/votreentreprise'),
                                TextInput::make('youtube_url')
                                    ->label('YouTube')
                                    ->url()
                                    ->placeholder('https://youtube.com/@votrechaine'),
                            ]),

                    ]),
            ]);
    }
}
