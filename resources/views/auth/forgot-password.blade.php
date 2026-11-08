<x-layouts.auth title="Lupa kata sandi" title-key="page.auth.forgot.title">
    <div>
        <p class="eyebrow" data-i18n="auth.forgot.eyebrow">Pemulihan akun</p>
        <h2 class="mt-2 text-2xl font-bold tracking-tight theme-text-heading sm:text-3xl" data-i18n="auth.forgot.title">Lupa kata sandi?</h2>
        <p class="mt-2 text-sm leading-6 theme-text-secondary" data-i18n="auth.forgot.body">Masukkan alamat email akun. Permintaan reset baru dapat dilakukan setelah Clerk terhubung.</p>
    </div>

    <form class="mt-7 space-y-5" data-auth-form>
        <div>
            <label for="forgot-email" class="mb-2 block text-sm font-semibold theme-text-label" data-i18n="auth.field.email">Alamat email</label>
            <input id="forgot-email" name="email" type="email" autocomplete="email" inputmode="email" required class="min-h-12 w-full rounded-xl border theme-border-strong theme-surface px-4 text-sm theme-text-primary outline-none transition theme-input theme-placeholder theme-focus" placeholder="nama@contoh.com" data-i18n-placeholder="auth.email.placeholder">
        </div>
        <button type="submit" disabled class="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white opacity-55" data-i18n="auth.forgot.submit">Kirim instruksi reset</button>
    </form>

    <p class="mt-4 rounded-xl border theme-border theme-surface-soft px-4 py-3 text-xs leading-5 theme-text-secondary" data-i18n="auth.forgot.privacy">Halaman ini tidak mengirim email dan tidak memeriksa apakah alamat terdaftar.</p>
    <a href="{{ route('password.instructions') }}" class="mt-4 inline-flex rounded-sm text-sm font-semibold theme-link focus-visible:outline-none theme-focus" data-i18n="auth.forgot.instructions_link">Lihat instruksi yang akan tersedia</a>
    <p class="mt-7 border-t theme-border-subtle pt-5 text-center"><a href="{{ route('login') }}" class="rounded-sm text-sm font-semibold theme-link focus-visible:outline-none theme-focus" data-i18n="auth.forgot.back">Kembali ke login</a></p>
</x-layouts.auth>
