<x-layouts.auth title="Instruksi reset password" title-key="page.auth.instructions.title">
    <div class="text-center">
        <span class="mx-auto grid size-14 place-items-center rounded-2xl theme-interactive-surface theme-link" aria-hidden="true">
            <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="m4 7 8 6 8-6"/></svg>
        </span>
        <p class="eyebrow mt-5" data-i18n="auth.instructions.eyebrow">Tahap integrasi</p>
        <h2 class="mt-2 text-2xl font-bold tracking-tight theme-text-heading sm:text-3xl" data-i18n="auth.instructions.title">Instruksi reset password</h2>
        <p class="mt-3 text-sm leading-6 theme-text-secondary" data-i18n="auth.instructions.body">Setelah Clerk dikonfigurasi, halaman ini akan menampilkan instruksi berdasarkan respons penyedia autentikasi.</p>
    </div>

    <div class="theme-alert-warning mt-7 rounded-2xl border p-4 text-left" role="status">
        <p class="text-sm font-bold" data-i18n="auth.instructions.pending">Ini bukan konfirmasi pengiriman email.</p>
        <p class="mt-1 text-sm leading-6" data-i18n="auth.instructions.not_sent">Clerk belum aktif, jadi tidak ada email reset yang dikirim atau permintaan yang diproses.</p>
    </div>

    <a href="{{ route('password.request') }}" class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border theme-interactive-border theme-interactive-surface px-5 text-sm font-semibold theme-link theme-interactive-hover focus-visible:outline-none theme-focus" data-i18n="auth.instructions.back">Kembali ke pemulihan akun</a>
</x-layouts.auth>
