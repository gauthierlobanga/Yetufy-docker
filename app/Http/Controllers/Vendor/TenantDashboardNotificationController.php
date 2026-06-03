<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TenantDashboardNotificationController extends Controller
{
    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $notification = $user->notifications()
            ->whereKey($id)
            ->first();

        if ($notification && is_null($notification->read_at)) {
            $notification->markAsRead();
        }

        return back(303);
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $user->unreadNotifications()->update([
            'read_at' => now(),
        ]);

        return back(303);
    }
}
