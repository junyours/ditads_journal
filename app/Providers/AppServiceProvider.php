<?php

namespace App\Providers;

use App\Models\BookCart;
use Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Share cart count globally
        Inertia::share([
            'auth.user' => fn() => Auth::user(),
            'cartCount' => function () {
                $user = Auth::user();
                return $user
                    ? BookCart::where('customer_id', $user->id)->count()
                    : 0;
            },
        ]);
    }
}
