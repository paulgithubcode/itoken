@props(['title' => 'iToken', 'active' => null])

<!doctype html>
<html lang="id" class="h-full scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f8fafc">
    <meta name="description" content="iToken demo — satu platform untuk mengeksplorasi berbagai model AI.">
    <title data-i18n="page.{{ $active ?? 'home' }}.title">{{ $title }} — iToken</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="min-h-full bg-slate-50 text-slate-900 antialiased">
    <a class="skip-link" href="#main-content" data-i18n="a11y.skip">Lewati ke konten utama</a>

    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div class="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <a href="{{ route('home') }}" class="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" aria-label="iToken, beranda" data-i18n-aria-label="nav.home.aria">
                <span class="grid size-10 place-items-center rounded-xl bg-indigo-600 text-sm font-black tracking-tight text-white">iT</span>
                <span class="text-lg font-bold tracking-tight text-slate-950">iToken</span>
            </a>

            <nav class="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama" data-i18n-aria-label="nav.main.aria">
                <a class="nav-link {{ $active === 'models' ? 'bg-slate-100 text-slate-950' : '' }}" href="{{ route('models.index') }}" @if ($active === 'models') aria-current="page" @endif data-i18n="nav.models">Model AI</a>
                <a class="nav-link {{ $active === 'pricing' ? 'bg-slate-100 text-slate-950' : '' }}" href="{{ route('pricing') }}" @if ($active === 'pricing') aria-current="page" @endif data-i18n="nav.pricing">Harga demo</a>
                <a class="nav-link {{ $active === 'docs' ? 'bg-slate-100 text-slate-950' : '' }}" href="{{ route('docs.index') }}" @if ($active === 'docs') aria-current="page" @endif data-i18n="nav.docs">Dokumentasi</a>
                <a class="nav-link {{ $active === 'faq' ? 'bg-slate-100 text-slate-950' : '' }}" href="{{ route('faq.index') }}" @if ($active === 'faq') aria-current="page" @endif data-i18n="nav.faq">FAQ</a>
            </nav>

            <div class="hidden items-center gap-3 lg:flex">
                <label class="sr-only" for="language-select" data-i18n="language.label">Pilih bahasa</label>
                <select id="language-select" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" aria-label="Pilih bahasa" data-i18n-aria-label="language.label">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                    <option value="zh_CN">简体中文</option>
                </select>
                <x-ui.button href="{{ route('models.index') }}" size="sm" data-i18n="nav.cta">Jelajahi model</x-ui.button>
            </div>

            <button id="mobile-menu-toggle" class="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 lg:hidden" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Buka menu navigasi" data-i18n-aria-label="menu.open">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
        </div>

        <nav id="mobile-menu" class="hidden border-t border-slate-200 bg-white px-4 py-4 lg:hidden" aria-label="Navigasi mobile" data-i18n-aria-label="nav.main.aria">
            <div class="mx-auto grid max-w-7xl gap-1">
                <a class="mobile-nav-link" href="{{ route('home') }}" data-i18n="nav.home">Beranda</a>
                <a class="mobile-nav-link" href="{{ route('models.index') }}" data-i18n="nav.models">Model AI</a>
                <a class="mobile-nav-link" href="{{ route('pricing') }}" data-i18n="nav.pricing">Harga demo</a>
                <a class="mobile-nav-link" href="{{ route('docs.index') }}" data-i18n="nav.docs">Dokumentasi</a>
                <a class="mobile-nav-link" href="{{ route('faq.index') }}" data-i18n="nav.faq">FAQ</a>
                <label class="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500" for="mobile-language-select" data-i18n="language.label">Pilih bahasa</label>
                <select id="mobile-language-select" class="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" aria-label="Pilih bahasa" data-i18n-aria-label="language.label">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                    <option value="zh_CN">简体中文</option>
                </select>
            </div>
        </nav>
    </header>

    <main id="main-content" class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {{ $slot }}
    </main>

    <footer class="border-t border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                <div class="max-w-sm">
                    <a href="{{ route('home') }}" class="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100">
                        <span class="grid size-9 place-items-center rounded-xl bg-indigo-600 text-xs font-black text-white">iT</span>
                        <span class="text-base font-bold text-slate-950">iToken</span>
                    </a>
                    <p class="mt-4 text-sm leading-6 text-slate-600" data-i18n="footer.description">Satu antarmuka untuk mengeksplorasi model AI dengan pengalaman prabayar yang transparan.</p>
                    <x-ui.badge class="mt-4" tone="warning" data-i18n="footer.demo">Pratinjau produk · data demo</x-ui.badge>
                </div>
                <div>
                    <h2 class="text-sm font-bold text-slate-900" data-i18n="footer.product">Produk</h2>
                    <ul class="mt-3 space-y-2 text-sm text-slate-600">
                        <li><a class="footer-link" href="{{ route('models.index') }}" data-i18n="nav.models">Model AI</a></li>
                        <li><a class="footer-link" href="{{ route('pricing') }}" data-i18n="nav.pricing">Harga demo</a></li>
                        <li><a class="footer-link" href="{{ route('about') }}" data-i18n="nav.about">Tentang</a></li>
                        <li><a class="footer-link" href="{{ route('status') }}" data-i18n="nav.status">Status layanan</a></li>
                    </ul>
                </div>
                <div>
                    <h2 class="text-sm font-bold text-slate-900" data-i18n="footer.resources">Sumber daya</h2>
                    <ul class="mt-3 space-y-2 text-sm text-slate-600">
                        <li><a class="footer-link" href="{{ route('docs.index') }}" data-i18n="nav.docs">Dokumentasi</a></li>
                        <li><a class="footer-link" href="{{ route('faq.index') }}" data-i18n="nav.faq">FAQ</a></li>
                        <li><a class="footer-link" href="{{ route('contact') }}" data-i18n="nav.contact">Kontak</a></li>
                    </ul>
                </div>
                <div>
                    <h2 class="text-sm font-bold text-slate-900" data-i18n="footer.legal">Informasi</h2>
                    <ul class="mt-3 space-y-2 text-sm text-slate-600">
                        <li><a class="footer-link" href="{{ route('terms') }}" data-i18n="nav.terms">Syarat layanan</a></li>
                        <li><a class="footer-link" href="{{ route('privacy') }}" data-i18n="nav.privacy">Privasi</a></li>
                    </ul>
                </div>
            </div>
            <div class="mt-9 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>© {{ date('Y') }} iToken</p>
                <p data-i18n="footer.disclaimer">Harga, model, dan fitur pada halaman ini adalah contoh UI dan belum menjadi penawaran resmi.</p>
            </div>
        </div>
    </footer>

    <div id="toast" class="pointer-events-none fixed bottom-4 right-4 z-[70] hidden max-w-sm rounded-2xl bg-slate-950 px-5 py-4 text-sm font-medium text-white shadow-xl" role="status" aria-live="polite"></div>

    <section id="demo-dialog" class="fixed inset-0 z-[60] hidden items-center justify-center bg-slate-950/45 p-4" aria-labelledby="dialog-title" aria-describedby="dialog-description" aria-modal="true" role="dialog">
        <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <x-ui.badge tone="info" data-i18n="dialog.badge">Simulasi UI</x-ui.badge>
                    <h2 id="dialog-title" class="mt-4 text-xl font-bold tracking-tight text-slate-950" data-i18n="dialog.title">Aksi demo</h2>
                </div>
                <button type="button" class="dialog-close grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" aria-label="Tutup dialog" data-i18n-aria-label="dialog.close">×</button>
            </div>
            <p id="dialog-description" class="mt-3 text-sm leading-6 text-slate-600" data-i18n="dialog.body">Ini hanya simulasi antarmuka. Tidak ada transaksi atau permintaan backend yang dilakukan.</p>
            <div class="mt-7 flex justify-end">
                <x-ui.button class="dialog-close" data-i18n="dialog.close.button">Mengerti</x-ui.button>
            </div>
        </div>
    </section>

    @livewireScripts
</body>
</html>
