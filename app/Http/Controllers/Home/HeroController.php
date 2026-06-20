<?php

namespace App\Http\Controllers\Immo\Central\Pages\Home;

use App\Http\Controllers\Controller;
// use App\Models\Property;
use App\Models\User;
// use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Nnjeim\World\Models\Country;

class HeroController extends Controller
{
    public function Index()
    {
        $stats = [
            'stores_created' => User::count(),
            // 'products_listed' => Property::available()->count(),
            'countries_served' => Country::count(),
        ];

        $testimonials = [
            [
                'name' => 'Marie K.',
                'store' => 'Les Pépites de Marie',
                'quote' => 'Grâce à Yetu, j\'ai pu lancer ma boutique en un week-end. Les outils sont incroyablement simples.',
                'avatar' => 'https://randomuser.me/api/portraits/women/1.jpg',
            ],
            [
                'name' => 'Jean-Paul M.',
                'store' => 'Artisanat du Kivu',
                'quote' => 'J\'ai triplé mes ventes depuis que je suis passé sur Yetu. Le support est réactif et efficace.',
                'avatar' => 'https://randomuser.me/api/portraits/men/1.jpg',
            ],
        ];

        // return Inertia::render('immo/pages/home/Home', [
        //     'stats' => $stats,
        //     'testimonials' => $testimonials,
        //     'globeData' => Inertia::defer(fn () => $this->getGlobeData()),
        //     'arcsData' => Inertia::defer(fn () => $this->getArcsData()),
        //     'globeStats' => Inertia::defer(fn () => $this->getGlobeStats()),
        // ]);
    }

    /**
     * Aggregate properties by city, returning lat/lng/name/count for globe points.
     * Falls back to country-level aggregation when city is missing.
     *
     * @return array<int, array{lat: float, lng: float, name: string, value: int, region: string}>
     */
    // private function getGlobeData(): array
    // {
    //     $points = Property::query()
    //         ->whereNotNull('lat')
    //         ->whereNotNull('lng')
    //         ->whereNotNull('city_id')
    //         ->select([
    //             'city_id',
    //             'country_id',
    //             DB::raw('AVG(lat) as avg_lat'),
    //             DB::raw('AVG(lng) as avg_lng'),
    //             DB::raw('COUNT(*) as properties_count'),
    //         ])
    //         ->groupBy('city_id', 'country_id')
    //         ->with(['city:id,name', 'country:id,name'])
    //         ->get()
    //         ->map(fn ($row) => [
    //             'lat' => round((float) $row->avg_lat, 4),
    //             'lng' => round((float) $row->avg_lng, 4),
    //             'name' => $row->city?->name ?? 'Inconnu',
    //             'value' => (int) $row->properties_count,
    //             'region' => $row->country?->name ?? 'Inconnu',
    //         ])
    //         ->values()
    //         ->all();

    //     // Also add country-level groups for properties without city but with country
    //     $countryPoints = Property::query()
    //         ->whereNotNull('lat')
    //         ->whereNotNull('lng')
    //         ->whereNull('city_id')
    //         ->whereNotNull('country_id')
    //         ->select([
    //             'country_id',
    //             DB::raw('AVG(lat) as avg_lat'),
    //             DB::raw('AVG(lng) as avg_lng'),
    //             DB::raw('COUNT(*) as properties_count'),
    //         ])
    //         ->groupBy('country_id')
    //         ->with(['country:id,name'])
    //         ->get()
    //         ->map(fn ($row) => [
    //             'lat' => round((float) $row->avg_lat, 4),
    //             'lng' => round((float) $row->avg_lng, 4),
    //             'name' => $row->country?->name ?? 'Inconnu',
    //             'value' => (int) $row->properties_count,
    //             'region' => $row->country?->name ?? 'Inconnu',
    //         ])
    //         ->values()
    //         ->all();

    //     return array_merge($points, $countryPoints);
    // }

    /**
     * Generate arcs from the "hub" city (most properties) to the next top cities.
     *
     * @return array<int, array{startLat: float, startLng: float, endLat: float, endLng: float}>
     */
    // private function getArcsData(): array
    // {
    //     $globeData = $this->getGlobeData();

    //     if (count($globeData) < 2) {
    //         return [];
    //     }

    //     // Sort by value desc, hub = first
    //     usort($globeData, fn ($a, $b) => $b['value'] <=> $a['value']);

    //     $hub = $globeData[0];
    //     $arcs = [];

    //     // Connect hub to up to 5 other cities
    //     $targets = array_slice($globeData, 1, 5);
    //     foreach ($targets as $target) {
    //         $arcs[] = [
    //             'startLat' => $hub['lat'],
    //             'startLng' => $hub['lng'],
    //             'endLat' => $target['lat'],
    //             'endLng' => $target['lng'],
    //         ];
    //     }

    //     return $arcs;
    // }

    /**
     * Compute dynamic stats for the globe section.
     *
     * @return array{countries: int, properties: int, clients: int}
     */
    // private function getGlobeStats(): array
    // {
    //     return [
    //         'countries' => Property::query()
    //             ->whereNotNull('country_id')
    //             ->distinct('country_id')
    //             ->count('country_id'),
    //         'properties' => Property::available()->count(),
    //         'clients' => User::count(),
    //     ];
    // }
}
