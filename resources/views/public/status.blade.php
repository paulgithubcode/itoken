<x-layouts.app title="Status layanan" description="Halaman status iToken belum terhubung ke sumber pemantauan layanan dan tidak menyajikan status operasional langsung." active="status" robots="noindex, follow">
    <div class="mx-auto max-w-3xl">
        <x-ui.badge tone="neutral" data-i18n="status.badge">Belum terhubung</x-ui.badge>
        <h1 class="mt-5 text-4xl font-bold tracking-tight theme-text-heading sm:text-5xl" data-i18n="status.title">Status layanan</h1>
        <p class="mt-5 text-base leading-7 theme-text-secondary" data-i18n="status.body">Halaman ini belum terhubung ke sumber status. Tidak ada data uptime atau kondisi layanan live yang ditampilkan.</p>
        <x-ui.card class="mt-8">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 class="font-bold theme-text-heading" data-i18n="status.panel.title">Ringkasan komponen</h2><p class="mt-1 text-sm theme-text-secondary" data-i18n="status.panel.body">Data operasional belum tersedia.</p></div><x-ui.badge tone="neutral" data-i18n="status.panel.pending">Belum dipublikasikan</x-ui.badge></div>
        </x-ui.card>
    </div>
</x-layouts.app>
