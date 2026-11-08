@props(['title', 'titleKey'])

<!doctype html>
<html lang="id" class="h-full scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f8fafc">
    <script src="{{ asset('theme-init.js') }}"></script>
    <meta name="robots" content="noindex, nofollow">
    <meta name="description" content="{{ $title }} iToken. Halaman autentikasi masih menunggu konfigurasi Clerk dan belum memproses kredensial.">
    <link rel="icon" href="{{ asset('icons/app-icon.svg') }}" type="image/svg+xml">
    <title data-i18n="{{ $titleKey }}">{{ $title }} — iToken</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="theme-page min-h-full antialiased">
    <a class="skip-link" href="#auth-main" data-i18n="a11y.skip">Lewati ke konten utama</a>

    <header class="theme-surface theme-border border-b border-slate-200">
        <div class="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <a href="{{ route('home') }}" class="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" data-i18n-aria-label="nav.home.aria" aria-label="iToken, beranda">
                <span class="grid size-10 place-items-center rounded-xl bg-indigo-600 text-sm font-black tracking-tight text-white" aria-hidden="true">iT</span>
                <span class="text-lg font-bold tracking-tight text-slate-950">iToken</span>
            </a>
            <div class="flex items-center gap-3">
                <a href="{{ route('home') }}" class="hidden text-sm font-semibold text-slate-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 sm:inline-flex" data-i18n="auth.back_home">Kembali ke beranda</a>
                <label for="language-select" class="sr-only" data-i18n="language.label">Pilih bahasa</label>
                <select id="language-select" class="min-h-10 max-w-36 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" aria-label="Pilih bahasa" data-i18n-aria-label="language.label">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                    <option value="zh_CN">简体中文</option>
                </select>
            </div>
        </div>
    </header>

    <main id="auth-main" class="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div class="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
            <aside class="block">
                <span class="hidden items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-indigo-800 lg:inline-flex"><span class="size-2 rounded-full bg-amber-500" aria-hidden="true"></span><span data-i18n="auth.status.pending">Clerk belum dikonfigurasi</span></span>
                <h1 class="max-w-md text-2xl font-bold tracking-tight text-slate-950 lg:mt-6 lg:text-4xl" data-i18n="auth.brand.title">Satu akses untuk ruang kerja iToken.</h1>
                <p class="mt-4 hidden max-w-md text-base leading-7 text-slate-600 lg:block" data-i18n="auth.brand.body">Halaman autentikasi siap untuk integrasi. Login, pendaftaran, dan pemulihan akun belum aktif.</p>
                <div class="mt-8 hidden items-center gap-3 text-sm font-medium text-slate-500 lg:flex"><span class="grid size-10 place-items-center rounded-xl bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200" aria-hidden="true">iT</span><span>iToken</span></div>
            </aside>

            <section class="theme-surface theme-border w-full max-w-xl justify-self-center rounded-3xl border border-slate-200 p-6 shadow-[0_24px_70px_-50px_rgba(49,46,129,.35)] sm:p-8">
                <div class="mb-6 flex items-center gap-2 lg:hidden"><span class="grid size-9 place-items-center rounded-xl bg-indigo-600 text-xs font-black text-white" aria-hidden="true">iT</span><span class="font-bold text-slate-950">iToken</span><span class="ml-auto rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900" data-i18n="auth.status.pending">Clerk belum dikonfigurasi</span></div>
                <div class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4" role="status">
                    <p class="text-sm font-bold text-amber-950" data-i18n="auth.unavailable.title">Autentikasi belum tersedia</p>
                    <p class="mt-1 text-sm leading-6 text-amber-900" data-i18n="auth.unavailable.body">Clerk belum dikonfigurasi. Formulir ini belum mengirim kredensial atau membuat sesi.</p>
                </div>

                @if (session('auth_notice') === 'auth.logout.unavailable')
                    <p class="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700" role="status" data-i18n="auth.logout.unavailable">Clerk belum aktif; tidak ada sesi yang diakhiri.</p>
                @endif

                {{ $slot }}
            </section>
        </div>
    </main>

    <script>
        document.querySelectorAll('[data-auth-form]').forEach((form) => {
            form.addEventListener('submit', (event) => event.preventDefault());
        });

        document.querySelectorAll('[data-password-toggle]').forEach((button) => {
            button.addEventListener('click', () => {
                const input = document.getElementById(button.dataset.passwordToggle);
                if (!input) return;
                const reveal = input.type === 'password';
                input.type = reveal ? 'text' : 'password';
                button.setAttribute('aria-pressed', String(reveal));
            });
        });
    </script>
</body>
</html>
