<x-layouts.app title="Status layanan" active="status">
    <div class="mx-auto max-w-3xl">
        <x-ui.badge tone="neutral" data-i18n="status.badge">Belum terhubung</x-ui.badge>
        <h1 class="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl" data-i18n="status.title">Status layanan</h1>
        <p class="mt-5 text-base leading-7 text-slate-600" data-i18n="status.body">Halaman ini belum terhubung ke sumber status. Tidak ada data uptime atau kondisi layanan live yang ditampilkan.</p>
        <x-ui.card class="mt-8">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 class="font-bold text-slate-950" data-i18n="status.panel.title">Ringkasan komponen</h2><p class="mt-1 text-sm text-slate-600" data-i18n="status.panel.body">Data operasional belum tersedia.</p></div><x-ui.badge tone="neutral" data-i18n="status.panel.pending">Belum dipublikasikan</x-ui.badge></div>
        </x-ui.card>
    </div>
</x-layouts.app>
