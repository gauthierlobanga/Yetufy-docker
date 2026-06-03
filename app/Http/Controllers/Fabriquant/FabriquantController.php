<?php

namespace App\Http\Controllers\Fabriquant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FabriquantController extends Controller
{
    public function index()
    {
        return Inertia::render('Shop/Fabriquant/Index', []);
    }
}
