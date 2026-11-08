<x-layouts.app title="Tentang" description="Kenali tujuan dan prinsip rancangan iToken untuk membantu developer mengeksplorasi model AI melalui satu antarmuka." active="about">
    <article class="mx-auto max-w-3xl">
        <x-ui.badge tone="info" data-i18n="about.badge">Gambaran produk</x-ui.badge>
        <h1 class="mt-5 text-4xl font-bold tracking-tight theme-text-heading sm:text-5xl" data-i18n="about.title">Satu pengalaman untuk menjelajahi model AI.</h1>
        <p class="mt-6 text-lg leading-8 theme-text-secondary" data-i18n="about.lead">iToken dirancang untuk membantu developer memahami pilihan model dan penggunaan melalui antarmuka yang terpadu.</p>
        <div class="mt-8 rounded-3xl border theme-border theme-surface p-6 sm:p-8">
            <h2 class="text-xl font-bold theme-text-heading" data-i18n="about.principles.title">Prinsip yang memandu rancangan</h2>
            <ul class="mt-5 space-y-4 text-sm leading-6 theme-text-secondary"><li data-i18n="about.principle.one">Informasi paket dan penggunaan disajikan dengan jelas.</li><li data-i18n="about.principle.two">Antarmuka dibuat ringkas dan ramah developer.</li><li data-i18n="about.principle.three">Privasi prompt dan completion mengikuti kebijakan zero-logging.</li></ul>
        </div>
        <x-ui.alert class="mt-6" tone="warning" title="Informasi produk masih berkembang" title-key="about.pending.title"><span data-i18n="about.pending.body">Pernyataan ini adalah ringkasan arah produk dan bukan klaim ketersediaan layanan.</span></x-ui.alert>
        <div class="mt-7 flex flex-wrap gap-3"><x-ui.button href="{{ route('models.index') }}" data-i18n="about.models">Lihat katalog demo</x-ui.button><x-ui.button href="{{ route('docs.index') }}" variant="secondary" data-i18n="about.docs">Dokumentasi</x-ui.button></div>
    </article>
</x-layouts.app>
