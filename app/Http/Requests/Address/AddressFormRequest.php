<?php

namespace App\Http\Requests\Address;

use App\Enums\AddressType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Propaganistas\LaravelPhone\Rules\Phone;

class AddressFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check(); // Seuls les utilisateurs connectés peuvent modifier leurs adresses
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'rue' => trim((string) $this->input('rue')),
            'complement' => trim((string) $this->input('complement')),
            'code_postal' => trim((string) $this->input('code_postal')),
            'ville' => trim((string) $this->input('ville')),
            'pays' => trim((string) $this->input('pays')),
            'region' => trim((string) $this->input('region')),
            'telephone' => trim((string) $this->input('telephone')),
            'instructions' => trim((string) $this->input('instructions')),
            'type' => $this->input('type'),
            'est_defaut' => filter_var($this->input('est_defaut'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
        ]);
    }

    public function rules(): array
    {
        return [
            'rue' => ['required', 'string', 'max:255'],
            'complement' => ['nullable', 'string', 'max:255'],
            'code_postal' => ['required', 'string', 'max:10'],
            'ville' => ['required', 'string', 'max:100'],
            'pays' => ['required', 'string', 'max:100'],
            'region' => ['nullable', 'string', 'max:100'],
            'telephone' => [
                'nullable',
                'string',
                'max:30',
                // Validation téléphonique internationale avec le pays fourni
                new Phone($this->input('pays'), 'mobile'),
            ],
            'instructions' => ['nullable', 'string', 'max:500'],
            'type' => ['required', Rule::enum(AddressType::class)],
            'est_defaut' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'rue.required' => 'La rue est obligatoire.',
            'rue.max' => 'La rue ne doit pas dépasser 255 caractères.',
            'complement.max' => 'Le complément d’adresse ne doit pas dépasser 255 caractères.',
            'code_postal.required' => 'Le code postal est obligatoire.',
            'code_postal.max' => 'Le code postal est trop long.',
            'ville.required' => 'La ville est obligatoire.',
            'ville.max' => 'Le nom de la ville est trop long.',
            'pays.required' => 'Le pays est obligatoire.',
            'pays.max' => 'Le nom du pays est trop long.',
            'region.max' => 'La région est trop longue.',
            'telephone.max' => 'Le numéro de téléphone est trop long.',
            'instructions.max' => 'Les instructions sont trop longues.',
            'type.required' => 'Le type d’adresse est obligatoire.',
            'type.enum' => 'Le type d’adresse sélectionné n’est pas valide.',
            'est_defaut.boolean' => 'La valeur pour "défaut" doit être vraie ou fausse.',
        ];
    }
}
