<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EntrepriseController extends Controller
{
    public function entrepriseIndex()
    {
        return Inertia::render('SaaSLanding/entreprise/Index');
    }
}
