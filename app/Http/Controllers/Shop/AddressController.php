<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\AddressFormRequest;
use App\Models\Adresse;
use App\Models\User;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Nnjeim\World\Models\Country;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $addresses = $user->adresses;

        // 1. Préférence utilisateur
        $countryCode = $user->pays_preference;

        // 2. Détection par IP uniquement si non défini et IP routable
        if (! $countryCode) {
            $ip = $request->ip();

            // Ignorer les IP locales (développement, tests)
            if (! in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
                $cacheKey = "user_location_{$user->id}";
                $countryCode = cache()->remember($cacheKey, now()->addHours(24), function () use ($ip) {
                    try {
                        $response = Http::timeout(5)
                            ->get("http://ip-api.com/json/{$ip}?fields=countryCode");

                        return $response->successful() ? $response->json('countryCode') : null;
                    } catch (ConnectionException $e) {
                        return null; // timeout ou autre erreur réseau
                    }
                });
            }
        }

        // 3. Fallback si toujours vide (local ou échec)
        $countryCode = $countryCode ?: 'CD';

        // 4. Récupérer le nom et l’indicatif
        $country = Country::where('iso2', $countryCode)
            ->first(['name', 'phone_code']);

        $defaultCountry = $country->name ?? 'République Démocratique du Congo';
        $defaultPhoneCode = $country->phone_code ?? '+243';

        return Inertia::render('Shop/Addresses/Index', [
            'addresses' => $addresses,
            'defaultCountry' => $defaultCountry,
            'defaultPhoneCode' => $defaultPhoneCode,
        ]);
    }

    public function store(AddressFormRequest $request)
    {
        $user = Auth::user();
        $address = $user->adresses()->create($request->validated());

        if ($request->boolean('est_defaut')) {
            $address->definirCommeDefaut();
        }

        return back()->with('success', 'Adresse ajoutée');
    }

    public function update(AddressFormRequest $request, Adresse $address)
    {
        // Vérifier que l'adresse appartient bien à l'utilisateur
        if ($address->addressable_type !== User::class ||
            $address->addressable_id !== Auth::id()) {
            abort(403);
        }

        $address->update($request->validated());

        return back()->with('success', 'Adresse mise à jour');
    }

    public function destroy(Adresse $address)
    {
        if ($address->addressable_type !== User::class ||
            $address->addressable_id !== Auth::id()) {
            abort(403);
        }

        $address->delete();

        return back()->with('success', 'Adresse supprimée');
    }

    public function addressesSetDefault(Adresse $address)
    {
        if ($address->addressable_type !== User::class ||
            $address->addressable_id !== Auth::id()) {
            abort(403);
        }

        $address->definirCommeDefaut();

        return back()->with('success', 'Adresse par défaut mise à jour');
    }
}
