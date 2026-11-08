<x-layouts.app title="Dokumentasi produk" description="Baca pengenalan produk dan panduan ilustratif iToken. Endpoint, SDK, request, response, dan autentikasi API belum ditetapkan." active="docs" robots="noindex, follow">
    <div class="grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside class="self-start lg:sticky lg:top-28">
            <x-ui.sidebar label="Di halaman ini" label-key="docs.toc.title" :items="[
                ['id' => 'overview', 'label' => 'Gambaran umum', 'labelKey' => 'docs.toc.overview', 'href' => '#overview'],
                ['id' => 'quickstart', 'label' => 'Mulai di lingkungan demo', 'labelKey' => 'docs.toc.quickstart', 'href' => '#quickstart'],
                ['id' => 'models', 'label' => 'Katalog model', 'labelKey' => 'docs.toc.models', 'href' => '#models'],
                ['id' => 'configuration', 'label' => 'Konfigurasi ilustratif', 'labelKey' => 'docs.toc.configuration', 'href' => '#configuration'],
                ['id' => 'security', 'label' => 'Keamanan', 'labelKey' => 'docs.toc.security', 'href' => '#security'],
            ]" />
            <x-ui.alert class="mt-4" tone="warning" title="Dokumentasi contoh" title-key="docs.demo.title"><span data-i18n="docs.demo.body">Tidak berisi kontrak API aktif. Verifikasi dokumentasi resmi sebelum integrasi.</span></x-ui.alert>
        </aside>

        <article class="min-w-0">
            <header class="border-b theme-border pb-8">
                <x-ui.badge tone="warning" data-i18n="docs.hero.badge">DEMO · BELUM ADA KONTRAK API PUBLIK</x-ui.badge>
                <h1 class="mt-5 text-4xl font-bold tracking-tight theme-text-heading sm:text-5xl" data-i18n="docs.hero.title">Dokumentasi produk</h1>
                <p class="mt-4 max-w-2xl text-base leading-7 theme-text-secondary" data-i18n="docs.hero.body">Panduan orientasi UI dan konsep integrasi. Endpoint, SDK, format request/response, serta autentikasi belum ditentukan.</p>
            </header>

            <section id="overview" class="scroll-mt-28 border-b theme-border py-9" aria-labelledby="docs-overview-title">
                <h2 id="docs-overview-title" class="text-2xl font-bold tracking-tight theme-text-heading" data-i18n="docs.overview.title">Gambaran umum</h2>
                <p class="mt-3 text-sm leading-7 theme-text-secondary" data-i18n="docs.overview.body">iToken dirancang sebagai satu antarmuka untuk mengeksplorasi berbagai model AI. Pengelolaan identitas ditangani oleh Clerk; proses dan data bisnis dimiliki Backend API. Halaman ini hanya frontend dokumentasi dan tidak mengaktifkan layanan tersebut.</p>
                <div class="mt-5 grid gap-3 sm:grid-cols-3">
                    <x-ui.card><p class="text-sm font-bold theme-text-primary" data-i18n="docs.overview.item1.title">Antarmuka</p><p class="mt-2 text-sm theme-text-secondary" data-i18n="docs.overview.item1.body">Contoh UI Laravel.</p></x-ui.card>
                    <x-ui.card><p class="text-sm font-bold theme-text-primary" data-i18n="docs.overview.item2.title">Integrasi</p><p class="mt-2 text-sm theme-text-secondary" data-i18n="docs.overview.item2.body">Kontrak belum tersedia.</p></x-ui.card>
                    <x-ui.card><p class="text-sm font-bold theme-text-primary" data-i18n="docs.overview.item3.title">Data</p><p class="mt-2 text-sm theme-text-secondary" data-i18n="docs.overview.item3.body">Nilai demo saja.</p></x-ui.card>
                </div>
            </section>

            <section id="quickstart" class="scroll-mt-28 border-b theme-border py-9" aria-labelledby="docs-quickstart-title">
                <p class="eyebrow" data-i18n="docs.quickstart.eyebrow">Quickstart ilustratif</p>
                <h2 id="docs-quickstart-title" class="mt-2 text-2xl font-bold tracking-tight theme-text-heading" data-i18n="docs.quickstart.title">Mulai di lingkungan demo</h2>
                <p class="mt-3 text-sm leading-7 theme-text-secondary" data-i18n="docs.quickstart.body">Cuplikan ini hanya menunjukkan pola menyimpan nilai konfigurasi. Nama variabel dan integrasi final perlu mengikuti dokumentasi yang disetujui.</p>
                <div class="code-panel mt-5">
                    <div class="flex items-center justify-between gap-3 border-b border-slate-700 px-4 py-3"><span class="text-xs font-semibold text-slate-300" data-i18n="docs.code.env">Contoh .env · placeholder saja</span><button type="button" class="copy-code rounded-lg px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 focus-visible:outline-none theme-focus" data-copy-target="sample-env" data-i18n="docs.copy">Salin contoh</button></div>
                    <pre class="overflow-x-auto p-4 text-sm leading-6"><code id="sample-env"># ILLUSTRATIVE PLACEHOLDERS — not active credentials
ITOKEN_API_BASE_URL=REPLACE_WITH_APPROVED_BASE_URL
ITOKEN_API_KEY=REPLACE_WITH_SECRET_FROM_APPROVED_FLOW</code></pre>
                </div>
            </section>

            <section id="models" class="scroll-mt-28 border-b theme-border py-9" aria-labelledby="docs-models-title">
                <h2 id="docs-models-title" class="text-2xl font-bold tracking-tight theme-text-heading" data-i18n="docs.models.title">Katalog model</h2>
                <p class="mt-3 text-sm leading-7 theme-text-secondary" data-i18n="docs.models.body">Nama model di katalog situs ini adalah data demo. Pemilihan model dan format pemanggilan harus merujuk pada kontrak Backend API yang disepakati.</p>
                <a class="mt-4 inline-flex text-sm font-semibold theme-link" href="{{ route('models.index') }}" data-i18n="docs.models.link">Jelajahi katalog demo →</a>
            </section>

            <section id="configuration" class="scroll-mt-28 border-b theme-border py-9" aria-labelledby="docs-config-title">
                <h2 id="docs-config-title" class="text-2xl font-bold tracking-tight theme-text-heading" data-i18n="docs.config.title">Konfigurasi ilustratif</h2>
                <p class="mt-3 text-sm leading-7 theme-text-secondary" data-i18n="docs.config.body">Contoh Python di bawah bukan SDK atau request yang dapat dijalankan. Detail client, base URL, endpoint, dan skema pesan belum ditetapkan.</p>
                <div class="code-panel mt-5">
                    <div class="flex items-center justify-between gap-3 border-b border-slate-700 px-4 py-3"><span class="text-xs font-semibold text-slate-300" data-i18n="docs.code.python">Python · pseudocode</span><button type="button" class="copy-code rounded-lg px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 focus-visible:outline-none theme-focus" data-copy-target="sample-python" data-i18n="docs.copy">Salin contoh</button></div>
                    <pre class="overflow-x-auto p-4 text-sm leading-6"><code id="sample-python"># PSEUDOCODE ONLY — follow the approved integration contract
base_url = "REPLACE_WITH_APPROVED_BASE_URL"
credential = "LOAD_FROM_YOUR_SECRET_STORE"

# Client setup and request format: PENDING</code></pre>
                </div>
            </section>

            <section id="security" class="scroll-mt-28 py-9" aria-labelledby="docs-security-title">
                <h2 id="docs-security-title" class="text-2xl font-bold tracking-tight theme-text-heading" data-i18n="docs.security.title">Keamanan dan privasi</h2>
                <ul class="mt-4 space-y-3 text-sm leading-7 theme-text-secondary"><li data-i18n="docs.security.one">Jangan menaruh secret sungguhan di source code atau browser storage.</li><li data-i18n="docs.security.two">Jangan mengirim prompt atau completion ke log atau tampilan riwayat.</li><li data-i18n="docs.security.three">Gunakan kontrak autentikasi dan API resmi saat tersedia; contoh di halaman ini tidak mengesahkannya.</li></ul>
            </section>
        </article>
    </div>
</x-layouts.app>
