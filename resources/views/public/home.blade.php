<x-layouts.app title="Jelajahi model AI" description="Jelajahi model AI dan pelajari konsep kredit prabayar iToken. Informasi model dan harga saat ini merupakan pratinjau demo." active="home">
    <div class="space-y-20 sm:space-y-24">
        <section class="relative isolate overflow-hidden rounded-[2rem] border border-indigo-100 bg-white px-6 py-10 shadow-[0_24px_70px_-50px_rgba(49,46,129,.35)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div class="pointer-events-none absolute -right-20 -top-32 -z-10 size-96 rounded-full bg-indigo-50 blur-3xl" aria-hidden="true"></div>
            <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
                <div class="max-w-2xl">
                    <x-ui.badge tone="info" data-i18n="home.hero.kicker">Satu platform · beragam model</x-ui.badge>
                    <h1 class="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.08]" data-i18n="home.hero.title">Akses model AI pilihanmu, dengan alur yang lebih sederhana.</h1>
                    <p class="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8" data-i18n="home.hero.body">Jelajahi model, pahami kredit prabayar, dan kelola penggunaan dari satu antarmuka yang dibuat untuk developer.</p>
                    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                        <x-ui.button href="{{ route('models.index') }}" size="lg" data-i18n="home.hero.primary">Jelajahi model demo</x-ui.button>
                        <x-ui.button href="{{ route('pricing') }}" variant="secondary" size="lg" data-i18n="home.hero.secondary">Lihat harga demo</x-ui.button>
                    </div>
                    <p class="mt-5 text-xs leading-5 text-slate-500" data-i18n="home.hero.note">Pratinjau produk. Model, harga, kredit, dan ketersediaan di sini bukan penawaran resmi.</p>
                </div>
                <div class="mx-auto w-full max-w-md">
                    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-indigo-950/5 sm:p-5">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div class="flex items-center gap-3"><span class="grid size-9 place-items-center rounded-xl bg-indigo-600 text-xs font-black text-white">iT</span><div><p class="text-sm font-bold text-slate-900">iToken</p><p class="text-xs text-slate-500" data-i18n="home.visual.label">Pratinjau dashboard</p></div></div>
                            <x-ui.badge tone="warning">DEMO</x-ui.badge>
                        </div>
                        <div class="mt-5 rounded-2xl bg-slate-50 p-4">
                            <div class="flex items-center justify-between gap-3"><p class="text-xs font-semibold text-slate-600" data-i18n="home.visual.balance">Saldo kredit contoh</p><span class="size-2 rounded-full bg-amber-400" aria-hidden="true"></span></div>
                            <p class="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">— <span class="text-sm font-semibold text-slate-500" data-i18n="home.visual.pending">belum terhubung</span></p>
                            <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"><div class="h-full w-2/3 rounded-full bg-indigo-500"></div></div>
                            <p class="mt-2 text-xs text-slate-500" data-i18n="home.visual.sample">Ilustrasi visual saja, bukan saldo akun.</p>
                        </div>
                        <div class="mt-4 grid grid-cols-2 gap-3">
                            <div class="rounded-2xl border border-slate-200 p-4"><p class="text-xs text-slate-500" data-i18n="home.visual.models">Contoh model</p><p class="mt-2 font-semibold text-slate-800">GPT-4o</p></div>
                            <div class="rounded-2xl border border-slate-200 p-4"><p class="text-xs text-slate-500" data-i18n="home.visual.activity">Aktivitas</p><p class="mt-2 font-semibold text-slate-800" data-i18n="home.visual.private">Tidak tersedia</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section aria-labelledby="benefits-title" class="space-y-7">
            <div class="max-w-2xl"><p class="eyebrow" data-i18n="home.benefits.eyebrow">Dirancang untuk alur kerja nyata</p><h2 id="benefits-title" class="section-title" data-i18n="home.benefits.title">Satu tempat, lebih mudah dipahami</h2><p class="section-description" data-i18n="home.benefits.body">Informasi penting disusun agar kamu dapat membandingkan pilihan tanpa menebak-nebak.</p></div>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                @foreach (['home.benefit.catalog', 'home.benefit.credit', 'home.benefit.usage', 'home.benefit.privacy'] as $index => $key)
                    <x-ui.card>
                        <span class="grid size-10 place-items-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">0{{ $index + 1 }}</span>
                        <h3 class="mt-4 font-bold text-slate-950" data-i18n="{{ $key }}.title">Manfaat</h3>
                        <p class="mt-2 text-sm leading-6 text-slate-600" data-i18n="{{ $key }}.body">Deskripsi manfaat.</p>
                    </x-ui.card>
                @endforeach
            </div>
        </section>

        <section id="about" class="scroll-mt-28 grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <div><p class="eyebrow" data-i18n="home.models.eyebrow">Katalog eksplorasi</p><h2 class="section-title" data-i18n="home.models.title">Kenali model sebelum memilih</h2><p class="section-description" data-i18n="home.models.body">Kartu berikut memakai data contoh. Ketersediaan dan spesifikasi model belum dikonfirmasi untuk layanan iToken.</p><a href="{{ route('models.index') }}" class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900" data-i18n="home.models.link">Buka katalog demo <span aria-hidden="true">→</span></a></div>
            <div class="grid gap-4 sm:grid-cols-2">
                @foreach (collect($demo['models'])->where('featured', true)->take(4) as $model)
                    <x-public.model-card :model="$model" />
                @endforeach
            </div>
        </section>

        <section id="how-it-works" class="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-9 lg:p-11" aria-labelledby="how-title">
            <div class="max-w-2xl"><p class="eyebrow" data-i18n="home.how.eyebrow">Cara kerja yang direncanakan</p><h2 id="how-title" class="section-title" data-i18n="home.how.title">Mulai dengan tiga langkah</h2><p class="section-description" data-i18n="home.how.body">Gambaran ini menjelaskan konsep produk, bukan alur akun atau integrasi yang sudah aktif.</p></div>
            <ol class="mt-8 grid gap-4 md:grid-cols-3">
                @foreach (['home.step.one', 'home.step.two', 'home.step.three'] as $index => $key)
                    <li class="rounded-2xl bg-slate-50 p-5"><span class="text-xs font-bold uppercase tracking-wide text-indigo-700"><span data-i18n="home.step.label">Langkah</span> 0{{ $index + 1 }}</span><h3 class="mt-3 font-bold text-slate-900" data-i18n="{{ $key }}.title">Langkah</h3><p class="mt-2 text-sm leading-6 text-slate-600" data-i18n="{{ $key }}.body">Deskripsi langkah.</p></li>
                @endforeach
            </ol>
        </section>

        <section aria-labelledby="pricing-preview-title" class="space-y-7">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div class="max-w-2xl"><p class="eyebrow" data-i18n="home.pricing.eyebrow">Kredit prabayar</p><h2 id="pricing-preview-title" class="section-title" data-i18n="home.pricing.title">Paket contoh, tanpa komitmen berulang</h2><p class="section-description" data-i18n="home.pricing.body">Beli kredit sesuai kebutuhan untuk menggunakan layanan API iToken. Tidak ada langganan otomatis atau komitmen pembayaran bulanan.</p></div><a href="{{ route('pricing') }}" class="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200" data-i18n="home.pricing.link">Lihat paket</a></div>
            <div class="grid gap-4 md:grid-cols-3">
                @foreach ($demo['packages'] as $package)
                    <x-public.pricing-card :package="$package" :featured="$package['featured']" />
                @endforeach
            </div>
            <div class="theme-payment-info rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div><h3 class="text-base font-bold text-slate-950" data-i18n="home.payment.title">Metode pembayaran</h3><p class="mt-1 text-sm leading-6 text-slate-600" data-i18n="home.payment.body">iToken direncanakan mendukung metode berikut. Informasi ini hanya pratinjau, bukan pilihan pembayaran aktif.</p></div>
                    <x-ui.badge tone="warning">DEMO</x-ui.badge>
                </div>
                <ul class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" data-i18n-aria-label="home.payment.methods">
                    <li class="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 sm:px-4"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700" aria-hidden="true"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3"/><path stroke-linecap="round" d="M8 8h3v3H8zm6 0h2m-2 3h3m-9 3h3v3H8zm6 1h3v2h-3z"/></svg></span><span class="text-sm font-semibold text-slate-800" data-i18n="home.payment.qris">QRIS</span></li>
                    <li class="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 sm:px-4"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700" aria-hidden="true"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M5 10V7l7-4 7 4v3M5 20h14M7 10v7m5-7v7m5-7v7M3 20h18"/></svg></span><span class="text-sm font-semibold text-slate-800" data-i18n="home.payment.bank">Transfer Bank</span></li>
                    <li class="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 sm:px-4"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700" aria-hidden="true"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2.75" width="14" height="18.5" rx="2.5"/><path stroke-linecap="round" d="M9 6h6m-8 10h10m-6 2.5h2"/></svg></span><span class="text-sm font-semibold text-slate-800" data-i18n="home.payment.ewallet">Transfer E-Wallet</span></li>
                    <li class="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 sm:px-4"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700" aria-hidden="true"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 9h18m-13 5h4m-4 2h7"/></svg></span><span class="text-sm font-semibold text-slate-800" data-i18n="home.payment.va">Virtual Account (VA)</span></li>
                </ul>
            </div>
        </section>

        <section class="grid gap-6 lg:grid-cols-2" aria-labelledby="developer-section-title">
            <x-ui.card>
                <p class="eyebrow" data-i18n="home.developer.eyebrow">Untuk developer</p>
                <h2 id="developer-section-title" class="section-title" data-i18n="home.developer.title">Informasi teknis yang mudah ditemukan</h2>
                <p class="section-description" data-i18n="home.developer.body">Dokumentasi publik memisahkan contoh ilustratif dari kontrak yang belum tersedia. Jangan masukkan secret sungguhan pada contoh.</p>
                <x-ui.button class="mt-6" href="{{ route('docs.index') }}" variant="secondary" data-i18n="home.developer.cta">Baca dokumentasi demo</x-ui.button>
            </x-ui.card>
            <x-ui.card class="bg-indigo-950 text-slate-950">
                <x-ui.badge class="border-white/20 bg-white/10 text-indigo-700" data-i18n="home.privacy.badge">Prinsip privasi</x-ui.badge>
                <h2 class="mt-5 text-2xl font-bold tracking-tight" data-i18n="home.privacy.title">Prompt dan completion tidak disimpan.</h2>
                <p class="mt-3 text-sm leading-6 text-slate-600" data-i18n="home.privacy.body">Zero-logging untuk isi prompt dan respons AI adalah batas produk. Contoh di halaman publik tidak menampilkan percakapan pengguna.</p>
            </x-ui.card>
        </section>

        <section id="faq" class="scroll-mt-28 grid gap-8 lg:grid-cols-[.7fr_1.3fr]" aria-labelledby="faq-title">
            <div><p class="eyebrow" data-i18n="home.faq.eyebrow">Pertanyaan umum</p><h2 id="faq-title" class="section-title" data-i18n="home.faq.title">Yang ingin diketahui sebelum mulai</h2><p class="section-description" data-i18n="home.faq.body">Jawaban ini menjelaskan arah produk. Detail layanan masih dalam tahap penetapan.</p><a href="{{ route('faq.index') }}" class="mt-5 inline-flex text-sm font-semibold text-indigo-700 hover:text-indigo-900" data-i18n="home.faq.link">Lihat semua FAQ →</a></div>
            <div class="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-5 sm:px-6">
                @foreach (['faq.one', 'faq.two', 'faq.three', 'faq.four'] as $key)
                    <details class="group py-5">
                        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"><span data-i18n="{{ $key }}.question">Pertanyaan</span><span class="text-indigo-700 transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary>
                        <p class="mt-3 pr-7 text-sm leading-6 text-slate-600" data-i18n="{{ $key }}.answer">Jawaban.</p>
                    </details>
                @endforeach
            </div>
        </section>
    </div>
</x-layouts.app>
