<x-layouts.auth title="Daftar" title-key="page.auth.register.title">
    <div>
        <p class="eyebrow" data-i18n="auth.register.eyebrow">Buat akun</p>
        <h2 class="mt-2 text-2xl font-bold tracking-tight theme-text-heading sm:text-3xl" data-i18n="auth.register.title">Daftar ke iToken</h2>
        <p class="mt-2 text-sm leading-6 theme-text-secondary" data-i18n="auth.register.body">Pendaftaran akan tersedia setelah Clerk dikonfigurasi.</p>
    </div>

    <form class="mt-7 space-y-4" data-auth-form>
        <div>
            <label for="register-name" class="mb-2 block text-sm font-semibold theme-text-label" data-i18n="auth.field.full_name">Nama lengkap</label>
            <input id="register-name" name="name" type="text" autocomplete="name" required class="min-h-12 w-full rounded-xl border theme-border-strong theme-surface px-4 text-sm theme-text-primary outline-none transition theme-input theme-placeholder theme-focus" placeholder="Nama lengkap" data-i18n-placeholder="auth.name.placeholder">
        </div>
        <div>
            <label for="register-email" class="mb-2 block text-sm font-semibold theme-text-label" data-i18n="auth.field.email">Alamat email</label>
            <input id="register-email" name="email" type="email" autocomplete="email" inputmode="email" required class="min-h-12 w-full rounded-xl border theme-border-strong theme-surface px-4 text-sm theme-text-primary outline-none transition theme-input theme-placeholder theme-focus" placeholder="nama@contoh.com" data-i18n-placeholder="auth.email.placeholder">
        </div>
        <div>
            <label for="register-password" class="mb-2 block text-sm font-semibold theme-text-label" data-i18n="auth.field.password">Kata sandi</label>
            <div class="relative">
                <input id="register-password" name="password" type="password" autocomplete="new-password" minlength="8" required class="min-h-12 w-full rounded-xl border theme-border-strong theme-surface px-4 pr-24 text-sm theme-text-primary outline-none transition theme-input theme-placeholder theme-focus" placeholder="••••••••" data-i18n-placeholder="auth.password.placeholder">
                <button type="button" data-password-toggle="register-password" aria-pressed="false" aria-label="Tampilkan atau sembunyikan kata sandi" data-i18n-aria-label="auth.password.toggle_label" class="absolute inset-y-1 right-1 rounded-lg px-3 text-xs font-semibold theme-link theme-interactive-soft-hover focus-visible:outline-none theme-focus" data-i18n="auth.password.toggle">Tampilkan</button>
            </div>
        </div>
        <div>
            <label for="register-password-confirm" class="mb-2 block text-sm font-semibold theme-text-label" data-i18n="auth.field.password_confirmation">Konfirmasi kata sandi</label>
            <input id="register-password-confirm" name="password_confirmation" type="password" autocomplete="new-password" minlength="8" required class="min-h-12 w-full rounded-xl border theme-border-strong theme-surface px-4 text-sm theme-text-primary outline-none transition theme-input theme-placeholder theme-focus" placeholder="••••••••" data-i18n-placeholder="auth.password.placeholder">
        </div>
        <label class="flex items-start gap-3 py-1 text-sm leading-6 theme-text-secondary"><input type="checkbox" name="terms" required class="mt-1 size-4 shrink-0 rounded theme-border-strong theme-checkbox theme-focus"><span><span data-i18n="auth.register.terms">Saya menyetujui</span> <a href="{{ route('terms') }}" class="font-semibold theme-link focus-visible:outline-none theme-focus" data-i18n="auth.register.terms_link">Syarat Layanan</a>.</span></label>
        <button type="submit" disabled class="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white opacity-55" data-i18n="auth.register.submit">Buat akun</button>
    </form>

    <p class="mt-7 border-t theme-border-subtle pt-5 text-center text-sm theme-text-secondary"><span data-i18n="auth.register.have_account">Sudah punya akun?</span> <a href="{{ route('login') }}" class="font-semibold theme-link focus-visible:outline-none theme-focus" data-i18n="auth.register.login">Masuk</a></p>
</x-layouts.auth>
