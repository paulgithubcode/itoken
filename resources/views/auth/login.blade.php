<x-layouts.auth title="Masuk" title-key="page.auth.login.title">
    <div>
        <p class="eyebrow" data-i18n="auth.login.eyebrow">Akun iToken</p>
        <h2 class="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl" data-i18n="auth.login.title">Masuk</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600" data-i18n="auth.login.body">Gunakan akun Clerk setelah integrasi tersedia.</p>
    </div>

    <form class="mt-7 space-y-5" data-auth-form>
        <div>
            <label for="login-email" class="theme-text-label mb-2 block text-sm font-semibold" data-i18n="auth.field.email">Alamat email</label>
            <input id="login-email" name="email" type="email" autocomplete="username" inputmode="email" required class="theme-focus theme-input min-h-12 w-full rounded-xl border px-4 text-sm outline-none transition placeholder:text-slate-400" placeholder="nama@contoh.com" data-i18n-placeholder="auth.email.placeholder">
        </div>
        <div>
            <label for="login-password" class="theme-text-label mb-2 block text-sm font-semibold" data-i18n="auth.field.password">Kata sandi</label>
            <div class="relative">
                <input id="login-password" name="password" type="password" autocomplete="current-password" required class="theme-focus theme-input min-h-12 w-full rounded-xl border px-4 pr-24 text-sm outline-none transition placeholder:text-slate-400" placeholder="••••••••" data-i18n-placeholder="auth.password.placeholder">
                <button type="button" data-password-toggle="login-password" aria-pressed="false" aria-label="Tampilkan atau sembunyikan kata sandi" data-i18n-aria-label="auth.password.toggle_label" class="theme-focus theme-link absolute inset-y-1 right-1 rounded-lg px-3 text-xs font-semibold hover:bg-indigo-50 focus-visible:outline-none" data-i18n="auth.password.toggle">Tampilkan</button>
            </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3">
            <label class="inline-flex min-h-10 items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="remember" class="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"><span data-i18n="auth.login.remember">Ingat saya</span></label>
            <a href="{{ route('password.request') }}" class="rounded-sm text-sm font-semibold text-indigo-700 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" data-i18n="auth.login.forgot">Lupa kata sandi?</a>
        </div>
        <button type="submit" disabled class="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white opacity-55" data-i18n="auth.login.submit">Masuk</button>
    </form>

    <div class="my-6 flex items-center gap-3" aria-hidden="true"><span class="h-px flex-1 bg-slate-200"></span><span class="text-xs font-medium text-slate-400" data-i18n="auth.login.or">atau</span><span class="h-px flex-1 bg-slate-200"></span></div>
    <button type="button" disabled class="theme-border theme-surface theme-text-secondary inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border px-5 text-sm font-semibold opacity-60" aria-describedby="google-login-note">
        <span class="font-bold text-base" aria-hidden="true">G</span><span data-i18n="auth.google.button">Lanjutkan dengan Google</span>
    </button>
    <p id="google-login-note" class="mt-2 text-center text-xs leading-5 text-slate-500" data-i18n="auth.google.unavailable">Login Google belum tersedia sebelum Clerk dan provider dikonfigurasi.</p>
    <p class="mt-7 border-t border-slate-100 pt-5 text-center text-sm text-slate-600"><span data-i18n="auth.login.no_account">Belum punya akun?</span> <a href="{{ route('register') }}" class="font-semibold text-indigo-700 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" data-i18n="auth.login.register">Daftar</a></p>
</x-layouts.auth>
