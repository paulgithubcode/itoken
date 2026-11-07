<?php

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

Route::fallback(fn () => response()->view('errors.404', status: 404));
