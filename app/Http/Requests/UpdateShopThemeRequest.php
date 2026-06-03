<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShopThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'colors' => 'array|required',
            'colors.--primary' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--primary-foreground' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--secondary' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--secondary-foreground' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--accent' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--accent-foreground' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--destructive' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--destructive-foreground' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--background' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--foreground' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--card' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--card-foreground' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--border' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--input' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--ring' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--muted' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--muted-foreground' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--popover' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',
            'colors.--popover-foreground' => 'required|string|regex:/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/',

            'typography' => 'nullable|array',
            'typography.font_family' => 'nullable|string|in:Inter,Poppins,Playfair Display,Quicksand,JetBrains Mono',
            'typography.heading_size' => 'nullable|numeric|min:0.8|max:2',
            'typography.body_size' => 'nullable|numeric|min:0.75|max:1.5',
            'typography.line_height' => 'nullable|numeric|min:1|max:2',

            'spacing' => 'nullable|array',
            'spacing.radius_sm' => 'nullable|string|regex:/^\d+(\.\d+)?(rem|px|em)$/',
            'spacing.radius_md' => 'nullable|string|regex:/^\d+(\.\d+)?(rem|px|em)$/',
            'spacing.radius_lg' => 'nullable|string|regex:/^\d+(\.\d+)?(rem|px|em)$/',

            'dark_mode' => 'nullable|array',
            'dark_mode.enabled' => 'nullable|boolean',
            'dark_mode.colors' => 'nullable|array',

            'preset' => 'nullable|string|in:custom,modern_emerald,professional_blue,vibrant_orange,minimalist_gray,luxury_purple,nature_green,tech_dark',
        ];
    }

    public function messages(): array
    {
        return [
            'colors.--primary.regex' => 'Format HSL invalide. Utilisez: "h s% l%"',
            'typography.font_family.in' => 'Police de caractère non autorisée',
            'preset.in' => 'Preset de thème invalide',
        ];
    }
}
