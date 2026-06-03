<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticatedWithTenant
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        if (Auth::check()) {

            $user = Auth::user();

            $tenant = $user->tenants()
                ->wherePivot('is_owner', true)
                ->first();

            if ($tenant) {

                return redirect()->route('central.account-selection.index');
            }

            return redirect()->route('plan.index');
        }

        return $next($request);
    }
}
