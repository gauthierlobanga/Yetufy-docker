<?php

namespace App\Http\Controllers\Centre;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CentreAcheteurController extends Controller
{
    public function index()
    {
        return Inertia::render('Shop/Acheteur/Index', []);
    }
}
