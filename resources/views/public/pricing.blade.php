<x-layouts.app title="Kredit dan harga demo" active="pricing">
    <div class="space-y-12 sm:space-y-16">
        <header class="mx-auto max-w-3xl text-center">
            <x-ui.badge tone="warning" data-i18n="pricing.hero.badge">DEMO · BUKAN HARGA FINAL</x-ui.badge>
            <h1 class="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl" data-i18n="pricing.hero.title">Pilih skala kredit yang sesuai kebutuhanmu.</h1>
            <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600" data-i18n="pricing.hero.body">Paket di bawah menggunakan angka contoh untuk mengembangkan tampilan. Belum ada pembelian atau pembayaran yang dapat dilakukan.</p>
        </header>

        <x-ui.alert tone="warning" title="Semua paket adalah data demonstrasi" title-key="pricing.notice.title">
            <span data-i18n="pricing.notice.body">Harga, jumlah kredit, bonus, dan masa berlaku di halaman ini belum disetujui sebagai penawaran iToken. Tombol paket hanya membuka simulasi UI.</span>
        </x-ui.alert>

        <section id="packages" class="scroll-mt-28 grid gap-5 md:grid-cols-3" aria-label="Paket kredit demonstrasi">
            @foreach ($demo['packages'] as $package)
                <x-public.pricing-card :package="$package" :featured="$package['featured']" />
            @endforeach
        </section>

        <section class="grid gap-6 lg:grid-cols-2" aria-labelledby="credit-title">
            <x-ui.card>
                <p class="eyebrow" data-i18n="pricing.how.eyebrow">Konsep kredit</p>
                <h2 id="credit-title" class="section-title" data-i18n="pricing.how.title">Bayar sesuai kebutuhan</h2>
                <p class="section-description" data-i18n="pricing.how.body">Rancangan produk menggunakan konsep prabayar tanpa perpanjangan otomatis. Aturan pemakaian, masa berlaku, dan konversi kredit masih menunggu konfirmasi.</p>
            </x-ui.card>
            <x-ui.card>
                <h2 class="text-base font-bold text-slate-950" data-i18n="pricing.includes.title">Apa yang ditampilkan pada kartu?</h2>
                <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li class="flex gap-3"><span class="text-indigo-700" aria-hidden="true">•</span><span data-i18n="pricing.includes.credits">Kredit dasar dan bonus sebagai nilai mock.</span></li>
                    <li class="flex gap-3"><span class="text-indigo-700" aria-hidden="true">•</span><span data-i18n="pricing.includes.price">Harga ilustratif berlabel DEMO, bukan harga final.</span></li>
                    <li class="flex gap-3"><span class="text-indigo-700" aria-hidden="true">•</span><span data-i18n="pricing.includes.no-payment">Tidak ada payment gateway atau transaksi sungguhan.</span></li>
                </ul>
            </x-ui.card>
        </section>

        <section id="faq" class="scroll-mt-28" aria-labelledby="pricing-faq-title">
            <div class="mx-auto max-w-2xl text-center"><p class="eyebrow" data-i18n="pricing.faq.eyebrow">FAQ</p><h2 id="pricing-faq-title" class="section-title" data-i18n="pricing.faq.title">Tentang paket demo</h2></div>
            <div class="mx-auto mt-7 max-w-3xl divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-5 sm:px-6">
                @foreach (['pricing.faq.one', 'pricing.faq.two', 'pricing.faq.three'] as $key)
                    <details class="group py-5">
                        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"><span data-i18n="{{ $key }}.question">Pertanyaan</span><span class="text-indigo-700 transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary>
                        <p class="mt-3 pr-7 text-sm leading-6 text-slate-600" data-i18n="{{ $key }}.answer">Jawaban.</p>
                    </details>
                @endforeach
            </div>
        </section>

        <section class="rounded-3xl bg-indigo-950 px-6 py-9 text-white sm:px-9">
            <h2 class="text-2xl font-bold tracking-tight" data-i18n="pricing.cta.title">Masih membandingkan?</h2>
            <p class="mt-2 max-w-xl text-sm leading-6 text-indigo-100" data-i18n="pricing.cta.body">Jelajahi katalog contoh atau baca dokumentasi ilustratif sebelum paket final diumumkan.</p>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
                <x-ui.button href="{{ route('models.index') }}" data-i18n="pricing.cta.models">Lihat model demo</x-ui.button>
                <x-ui.button href="{{ route('docs.index') }}" variant="secondary" data-i18n="pricing.cta.docs">Buka dokumentasi</x-ui.button>
            </div>
        </section>
    </div>
</x-layouts.app>
