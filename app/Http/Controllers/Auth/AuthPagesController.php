<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;

class AuthPagesController extends Controller
{
    public function login(): Response
    {
        return $this->page('auth.login');
    }

    public function register(): Response
    {
        return $this->page('auth.register');
    }

    public function forgotPassword(): Response
    {
        return $this->page('auth.forgot-password');
    }

    public function passwordResetInstructions(): Response
    {
        return $this->page('auth.password-reset-instructions');
    }

    public function logout(): RedirectResponse
    {
        return redirect()->route('login')
            ->with('auth_notice', 'auth.logout.unavailable')
            ->header('Cache-Control', 'private, no-store, no-cache, max-age=0, must-revalidate')
            ->header('Pragma', 'no-cache');
    }

    private function page(string $view): Response
    {
        return response()->view($view)
            ->header('Cache-Control', 'private, no-store, no-cache, max-age=0, must-revalidate')
            ->header('Pragma', 'no-cache');
    }
}
