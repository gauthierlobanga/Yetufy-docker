<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Socialite Providers Configuration
    |--------------------------------------------------------------------------
    |
    | Configure OAuth providers for social authentication
    |
    */

    'providers' => [
        'google' => [
            'enabled' => env('GOOGLE_CLIENT_ID') && env('GOOGLE_CLIENT_SECRET'),
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
            'redirect' => env('GOOGLE_REDIRECT_URI'),
        ],

        'facebook' => [
            'enabled' => env('FACEBOOK_CLIENT_ID') && env('FACEBOOK_CLIENT_SECRET'),
            'client_id' => env('FACEBOOK_CLIENT_ID'),
            'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
            'redirect' => env('FACEBOOK_REDIRECT_URI'),
        ],

        'instagram' => [
            'enabled' => env('INSTAGRAM_CLIENT_ID') && env('INSTAGRAM_CLIENT_SECRET'),
            'client_id' => env('INSTAGRAM_CLIENT_ID'),
            'client_secret' => env('INSTAGRAM_CLIENT_SECRET'),
            'redirect' => env('INSTAGRAM_REDIRECT_URI'),
        ],

        'microsoft' => [
            'enabled' => env('MICROSOFT_CLIENT_ID') && env('MICROSOFT_CLIENT_SECRET'),
            'client_id' => env('MICROSOFT_CLIENT_ID'),
            'client_secret' => env('MICROSOFT_CLIENT_SECRET'),
            'redirect' => env('MICROSOFT_REDIRECT_URI'),
            'tenant' => env('MICROSOFT_TENANT', 'common'),
        ],
    ],
];
