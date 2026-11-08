<x-layouts.app title="Halaman tidak ditemukan" description="Alamat yang diminta tidak tersedia di iToken." active="notfound" robots="noindex, nofollow" :canonical="false">
    <div class="mx-auto max-w-xl py-12 text-center sm:py-20">
        <p class="text-sm font-bold uppercase tracking-[.18em] text-indigo-700">404</p>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-slate-950" data-i18n="notfound.title">Halaman tidak ditemukan</h1>
        <p class="mt-4 text-base leading-7 text-slate-600" data-i18n="notfound.body">Alamat ini tidak tersedia. Kembali ke halaman utama untuk melanjutkan.</p>
        <x-ui.button class="mt-7" href="{{ route('home') }}" data-i18n="notfound.cta">Kembali ke beranda</x-ui.button>
    </div>
</x-layouts.app>
