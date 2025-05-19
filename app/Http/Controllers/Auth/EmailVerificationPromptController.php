<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        $role = $request->user()->role;

        if ($request->user()->hasVerifiedEmail()) {
            if ($role === "admin" || $role === "editor" || $role === "author") {
                return redirect("/{$role}/dashboard");
            }
        }

        return Inertia::render('auth/verify-email', ['status' => session('status')]);
    }
}
