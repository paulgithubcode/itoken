<x-layouts.app title="Katalog model AI demo" description="Jelajahi katalog contoh model AI iToken. Nama, spesifikasi, dan ketersediaan model pada halaman ini belum dikonfirmasi sebagai layanan aktif." active="models" robots="noindex, follow">
    <div class="space-y-10">
        <header class="max-w-3xl">
            <x-ui.badge tone="warning" data-i18n="models.hero.badge">DEMO · KETERSEDIAAN BELUM DIKONFIRMASI</x-ui.badge>
            <h1 class="mt-5 text-4xl font-bold tracking-tight theme-text-heading sm:text-5xl" data-i18n="models.hero.title">Jelajahi katalog model AI.</h1>
            <p class="mt-5 max-w-2xl text-base leading-7 theme-text-secondary" data-i18n="models.hero.body">Ini adalah sampel katalog untuk pratinjau UI. Nama provider, konteks, dan kemampuan tidak mengonfirmasi bahwa model tersedia melalui iToken.</p>
        </header>

        <x-ui.alert tone="info" title="Informasi katalog" title-key="models.notice.title">
            <span data-i18n="models.notice.body">Data konteks dan deskripsi adalah nilai mock. Status aktif dan pricing per model belum dipublikasikan.</span>
        </x-ui.alert>

        <section aria-labelledby="model-list-title" class="space-y-6">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div><h2 id="model-list-title" class="text-2xl font-bold tracking-tight theme-text-heading" data-i18n="models.list.title">Model contoh</h2><p class="mt-2 text-sm theme-text-secondary" data-i18n="models.list.body">Cari berdasarkan nama atau provider, lalu saring katalog demo.</p></div>
                <div class="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_200px] lg:w-[500px]">
                    <div><label for="model-search" class="mb-2 block text-sm font-semibold theme-text-label" data-i18n="models.search.label">Cari model</label><input id="model-search" type="search" class="min-h-11 w-full rounded-xl border theme-border theme-surface px-4 text-sm outline-none theme-input theme-placeholder theme-focus" placeholder="GPT-4o, Anthropic…" data-i18n-placeholder="models.search.placeholder"></div>
                    <div><label for="provider-filter" class="mb-2 block text-sm font-semibold theme-text-label" data-i18n="models.filter.label">Provider</label><select id="provider-filter" class="min-h-11 w-full rounded-xl border theme-border theme-surface px-3 text-sm outline-none theme-input theme-focus"><option value="all" data-i18n="models.filter.all">Semua provider</option>@foreach (collect($demo['models'])->pluck('provider')->unique() as $provider)<option value="{{ $provider }}">{{ $provider }}</option>@endforeach</select></div>
                </div>
            </div>

            <p class="text-sm theme-text-muted" id="model-result-count" aria-live="polite"><span data-i18n="models.count.prefix">Menampilkan</span> <span id="model-visible-count">{{ count($demo['models']) }}</span> <span data-i18n="models.count.suffix">contoh model · DEMO</span></p>
            <div id="model-grid" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                @foreach ($demo['models'] as $model)
                    <x-public.model-card :model="$model" />
                @endforeach
            </div>
            <div id="model-empty-state" class="hidden rounded-3xl border border-dashed theme-border-strong theme-surface px-6 py-12 text-center" role="status">
                <h3 class="font-bold theme-text-primary" data-i18n="models.empty.title">Tidak ada model yang cocok</h3>
                <p class="mt-2 text-sm theme-text-secondary" data-i18n="models.empty.body">Coba ubah kata pencarian atau provider.</p>
                <button type="button" id="clear-model-filters" class="mt-4 text-sm font-semibold theme-link" data-i18n="models.empty.clear">Hapus filter</button>
            </div>
        </section>

        <section class="rounded-3xl border theme-border theme-surface p-6 sm:p-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p class="eyebrow" data-i18n="models.docs.eyebrow">Langkah berikutnya</p><h2 class="mt-2 text-xl font-bold theme-text-heading" data-i18n="models.docs.title">Panduan model masih berupa contoh</h2><p class="mt-2 text-sm leading-6 theme-text-secondary" data-i18n="models.docs.body">Dokumentasi menjelaskan batas placeholder dan detail integrasi yang belum ditentukan.</p></div><x-ui.button href="{{ route('docs.index') }}#models" variant="secondary" data-i18n="models.docs.button">Buka dokumentasi</x-ui.button></div>
        </section>
    </div>
</x-layouts.app>
