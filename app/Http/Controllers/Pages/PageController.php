<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Adresse;
use App\Models\Commande;
use App\Models\Paiement;
use App\Models\Produit;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PageController extends Controller
{
    public function pageContact()
    {
        return Inertia::render('main/contact/Contact');
    }

    public function pageHelp()
    {
        return Inertia::render('main/help/Help');
    }

    public function pageAbout()
    {
        $platformStats = Cache::remember('home_platform_stats', 3600, function () {
            return [
                'pageLoadTime' => '< 1.2s', // Valeur statique ou issue d'un outil de monitoring
                'uptime' => '99.99%',        // Idem
                'supportResponseTime' => '< 2h', // À configurer manuellement ou via un paramètre
                'productsCount' => Produit::published()->count(),
                'ordersProcessed' => Commande::whereIn('statut', [Commande::STATUT_TERMINE, Commande::STATUT_EN_COURS])->count(),
                'paymentMethods' => Paiement::distinct('mode')->count('mode'),
                'countriesServed' => Adresse::distinct('pays')->count('pays'), // Nombre de pays uniques où des commandes ont été livrées
            ];
        });

        return Inertia::render('main/about/About', [
            'platformStats' => $platformStats,
        ]);
    }

    public function pageTerms()
    {
        return Inertia::render('main/terms/Terms');
    }

    public function pagePrivacy()
    {
        return Inertia::render('main/privacy/Privacy');
    }

    public function pageCookies()
    {
        return Inertia::render('main/cookies/Cookies');
    }

    public function pageSupport()
    {
        return Inertia::render('main/support/Support');
    }

    public function pageFaq()
    {
        return Inertia::render('main/faq/Faq');
    }

    public function pageTestimonials()
    {
        return Inertia::render('main/testimonials/Testimonials');
    }
}
