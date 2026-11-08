<?php

use App\Http\Controllers\Auth\AuthPagesController;
use Illuminate\Support\Facades\Route;

$demo = require resource_path('data/public-demo.php');

Route::view('/', 'public.home', ['demo' => $demo])->name('home');
Route::view('/pricing', 'public.pricing', ['demo' => $demo])->name('pricing');
Route::view('/models', 'public.models', ['demo' => $demo])->name('models.index');
Route::view('/docs', 'public.docs')->name('docs.index');
Route::view('/faq', 'public.faq')->name('faq.index');
Route::view('/about', 'public.about')->name('about');
Route::view('/contact', 'public.contact')->name('contact');
Route::view('/terms', 'public.legal', ['document' => 'terms'])->name('terms');
Route::view('/privacy', 'public.legal', ['document' => 'privacy'])->name('privacy');
Route::view('/status', 'public.status')->name('status');

Route::get('/sitemap.xml', function () {
    $urls = ['/', '/about', '/faq'];

    return response()->view('sitemap', [
        'origin' => rtrim(config('services.seo.production_origin'), '/'),
        'paths' => $urls,
    ])->header('Content-Type', 'application/xml; charset=UTF-8');
})->name('sitemap');

Route::get('/login', [AuthPagesController::class, 'login'])->name('login');
Route::get('/register', [AuthPagesController::class, 'register'])->name('register');
Route::get('/forgot-password', [AuthPagesController::class, 'forgotPassword'])->name('password.request');
Route::get('/password-reset/instructions', [AuthPagesController::class, 'passwordResetInstructions'])->name('password.instructions');
Route::post('/logout', [AuthPagesController::class, 'logout'])->name('logout');

// TODO Clerk: attach a server-verified session middleware here only after its verification contract is implemented.
Route::get('/dashboard/{section?}', function (?string $section = 'overview') {
    $sections = [
        'overview' => ['title' => 'Overview', 'key' => 'dashboard.overview'],
        'wallet' => ['title' => 'Wallet', 'key' => 'dashboard.wallet'],
        'transactions' => ['title' => 'Transactions', 'key' => 'dashboard.transactions'],
        'api-keys' => ['title' => 'API Keys', 'key' => 'dashboard.keys'],
        'models' => ['title' => 'Models', 'key' => 'dashboard.models'],
        'usage' => ['title' => 'Usage', 'key' => 'dashboard.usage'],
        'logs' => ['title' => 'Logs', 'key' => 'dashboard.logs'],
        'billing' => ['title' => 'Billing', 'key' => 'dashboard.billing'],
        'developer-docs' => ['title' => 'Developer docs', 'key' => 'dashboard.docs'],
        'settings' => ['title' => 'Settings', 'key' => 'dashboard.settings'],
    ];

    abort_unless(isset($sections[$section]), 404);

    $response = response()->view('dashboard.index', ['section' => $section, 'page' => $sections[$section]]);
    $response->headers->set('Cache-Control', 'private, no-store, no-cache, max-age=0, must-revalidate');
    $response->headers->set('Pragma', 'no-cache');

    return $response;
})->name('dashboard.index');

Route::fallback(fn () => response()->view('errors.404', status: 404));
