<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FournisseurController extends Controller
{
    public function index()
    {
        return Inertia::render('Shop/Seller/Index', []);
    }
}
