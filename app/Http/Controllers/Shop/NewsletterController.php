<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function newsletterSubscribe(Request $request)
    {
        $request->validate(['email' => 'required|email|unique:newsletters,email']);
        Newsletter::create(['email' => $request->email, 'is_subscribed' => true]);

        return back()->with('success', 'Inscription réussie');
    }

    public function newsletterUnsubscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        Newsletter::where('email', $request->email)->update(['is_subscribed' => false]);

        return back()->with('success', 'Désinscription réussie');
    }
}
