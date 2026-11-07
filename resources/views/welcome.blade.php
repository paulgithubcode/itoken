<x-layouts.app title="iToken — Fondasi UI">
    <div class="space-y-12 sm:space-y-16">
        <section class="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-white px-6 py-10 shadow-[0_24px_70px_-50px_rgba(49,46,129,.35)] sm:px-10 sm:py-14 lg:px-14">
            <div class="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-indigo-50 blur-3xl" aria-hidden="true"></div>
            <div class="relative max-w-3xl">
                <div class="flex flex-wrap items-center gap-2">
                    <x-ui.badge tone="info" data-i18n="hero.badge">Tahap 1 · Fondasi UI</x-ui.badge>
                    <x-ui.badge data-i18n="hero.demo">Semua data: DEMO</x-ui.badge>
                </div>
                <h1 class="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl" data-i18n="hero.title">Satu tempat untuk model AI yang kamu gunakan.</h1>
                <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8" data-i18n="hero.body">iToken menyatukan pengalaman menggunakan berbagai model AI dengan alur prabayar yang jelas dan antarmuka yang dibuat untuk developer.</p>
                <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                    <x-ui.button href="#components" size="lg" data-i18n="hero.primary">Jelajahi komponen</x-ui.button>
                    <x-ui.button href="#design-tokens" variant="secondary" size="lg" data-i18n="hero.secondary">Lihat design tokens</x-ui.button>
                </div>
                <p class="mt-5 text-xs leading-5 text-slate-500" data-i18n="hero.disclaimer">Pratinjau fondasi visual, bukan halaman produk final. Tidak ada data akun atau transaksi sungguhan.</p>
            </div>
        </section>

        <section id="design-tokens" class="scroll-mt-28 space-y-5" aria-labelledby="tokens-title">
            <div class="max-w-2xl">
                <p class="eyebrow" data-i18n="tokens.eyebrow">Sistem visual</p>
                <h2 id="tokens-title" class="section-title" data-i18n="tokens.title">Fondasi yang konsisten</h2>
                <p class="section-description" data-i18n="tokens.body">Palet ringan, aksen tunggal, tipografi yang tenang, dan jarak yang teratur membentuk dasar semua halaman.</p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <x-ui.card>
                    <p class="text-sm font-semibold text-slate-500" data-i18n="tokens.surface">Surface & border</p>
                    <div class="mt-4 flex gap-2"><span class="size-9 rounded-xl border border-slate-200 bg-white"></span><span class="size-9 rounded-xl border border-slate-200 bg-slate-50"></span><span class="size-9 rounded-xl border border-slate-200 bg-slate-100"></span></div>
                    <p class="mt-3 text-xs text-slate-500">White · Slate 50 · Slate 100</p>
                </x-ui.card>
                <x-ui.card>
                    <p class="text-sm font-semibold text-slate-500" data-i18n="tokens.accent">Aksen utama</p>
                    <div class="mt-4 flex gap-2"><span class="size-9 rounded-xl bg-indigo-500"></span><span class="size-9 rounded-xl bg-indigo-600"></span><span class="size-9 rounded-xl bg-indigo-700"></span></div>
                    <p class="mt-3 text-xs text-slate-500">Indigo · CTA · focus</p>
                </x-ui.card>
                <x-ui.card>
                    <p class="text-sm font-semibold text-slate-500" data-i18n="tokens.type">Tipografi</p>
                    <p class="mt-3 text-2xl font-bold tracking-tight">Aa 0123</p>
                    <p class="mt-2 text-xs text-slate-500" data-i18n="tokens.type-note">System sans · angka tabular</p>
                </x-ui.card>
                <x-ui.card>
                    <p class="text-sm font-semibold text-slate-500" data-i18n="tokens.spacing">Radius & spacing</p>
                    <div class="mt-4 flex items-end gap-2"><span class="size-8 rounded-lg border-2 border-indigo-200"></span><span class="size-10 rounded-xl border-2 border-indigo-300"></span><span class="size-12 rounded-2xl border-2 border-indigo-400"></span></div>
                    <p class="mt-3 text-xs text-slate-500">4 px scale · medium radius</p>
                </x-ui.card>
            </div>
        </section>

        <section class="space-y-5" aria-labelledby="navigation-title">
            <div>
                <p class="eyebrow" data-i18n="navigation.eyebrow">Navigasi</p>
                <h2 id="navigation-title" class="section-title" data-i18n="navigation.title">Sidebar yang menyesuaikan layar</h2>
                <p class="section-description" data-i18n="navigation.body">Komponen navigasi samping berubah menjadi deretan tautan geser pada layar kecil.</p>
            </div>
            <div class="grid gap-4 lg:grid-cols-[260px_1fr]">
                <x-ui.sidebar label="Pratinjau UI" label-key="navigation.label" active="foundation" :items="[
                    ['id' => 'foundation', 'label' => 'Fondasi', 'labelKey' => 'nav.foundation', 'href' => '#design-tokens'],
                    ['id' => 'components', 'label' => 'Komponen', 'labelKey' => 'nav.components', 'href' => '#components'],
                    ['id' => 'accessibility', 'label' => 'Aksesibilitas', 'labelKey' => 'nav.accessibility', 'href' => '#accessibility'],
                ]" />
                <x-ui.card class="flex min-h-36 flex-col justify-center">
                    <x-ui.badge class="w-fit" tone="info" data-i18n="navigation.demo">Contoh sidebar · demo</x-ui.badge>
                    <p class="mt-3 text-sm leading-6 text-slate-600" data-i18n="navigation.note">Tautan pada sidebar preview berpindah ke bagian halaman ini. Struktur navigasi produk akan mengikuti halaman yang dibuat pada tahap berikutnya.</p>
                </x-ui.card>
            </div>
        </section>

        <section id="components" class="scroll-mt-28 space-y-5" aria-labelledby="components-title">
            <div class="max-w-2xl">
                <p class="eyebrow" data-i18n="components.eyebrow">UI kit</p>
                <h2 id="components-title" class="section-title" data-i18n="components.title">Komponen inti</h2>
                <p class="section-description" data-i18n="components.body">Elemen dasar siap dipakai ulang dengan status, label, dan state fokus yang konsisten.</p>
            </div>

            <div class="grid gap-5 lg:grid-cols-2">
                <x-ui.card>
                    <h3 class="text-base font-bold text-slate-950" data-i18n="components.actions">Tombol & status</h3>
                    <div class="mt-5 flex flex-wrap gap-3">
                        <x-ui.button id="show-toast" data-i18n="button.toast">Tampilkan toast</x-ui.button>
                        <x-ui.button id="show-dialog" variant="secondary" data-i18n="button.dialog">Buka dialog</x-ui.button>
                        <x-ui.button variant="danger" disabled data-i18n="button.disabled">Disabled</x-ui.button>
                    </div>
                    <div class="mt-6 flex flex-wrap gap-2">
                        <x-ui.badge tone="success" data-i18n="status.active">Aktif · demo</x-ui.badge>
                        <x-ui.badge tone="warning" data-i18n="status.pending">Menunggu · demo</x-ui.badge>
                        <x-ui.badge tone="danger" data-i18n="status.error">Gagal · demo</x-ui.badge>
                        <x-ui.badge tone="neutral" data-i18n="status.inactive">Nonaktif · demo</x-ui.badge>
                    </div>
                </x-ui.card>

                <x-ui.card>
                    <h3 class="text-base font-bold text-slate-950" data-i18n="components.form">Input & validasi</h3>
                    <div class="mt-5 space-y-5">
                        <x-ui.field id="demo-email" label="Alamat email" label-key="field.email" type="email" placeholder="nama@contoh.test" hint="Contoh field saja; data tidak dikirim." hint-key="field.hint" />
                        <x-ui.field id="demo-invalid" label="Nama workspace" label-key="field.workspace" value="" error="Nama ini hanya contoh pesan validasi." error-key="field.error" />
                    </div>
                </x-ui.card>

                <x-ui.card class="lg:col-span-2" padding="p-0">
                    <div class="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h3 class="text-base font-bold text-slate-950" data-i18n="components.table">Pola tabel responsif</h3>
                            <p class="mt-1 text-sm text-slate-500" data-i18n="components.table-note">Baris dan angka berikut sepenuhnya fiktif.</p>
                        </div>
                        <x-ui.badge tone="info">DEMO</x-ui.badge>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-[620px] w-full text-left text-sm">
                            <caption class="sr-only" data-i18n="table.caption">Contoh tabel komponen dengan data demonstrasi</caption>
                            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th class="px-5 py-3 font-semibold sm:px-6" scope="col" data-i18n="table.item">Item</th><th class="px-5 py-3 font-semibold" scope="col" data-i18n="table.type">Jenis</th><th class="px-5 py-3 font-semibold" scope="col" data-i18n="table.status">Status</th><th class="px-5 py-3 text-right font-semibold sm:px-6" scope="col" data-i18n="table.value">Nilai demo</th></tr></thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr><th class="px-5 py-4 font-semibold text-slate-800 sm:px-6" scope="row">Contoh A</th><td class="px-5 py-4 text-slate-600" data-i18n="table.sample">Sampel</td><td class="px-5 py-4"><x-ui.badge tone="info" data-i18n="table.preview">Pratinjau</x-ui.badge></td><td class="px-5 py-4 text-right font-mono tabular-nums text-slate-700">1,240</td></tr>
                                <tr><th class="px-5 py-4 font-semibold text-slate-800 sm:px-6" scope="row">Contoh B</th><td class="px-5 py-4 text-slate-600" data-i18n="table.sample">Sampel</td><td class="px-5 py-4"><x-ui.badge data-i18n="table.placeholder">Placeholder</x-ui.badge></td><td class="px-5 py-4 text-right font-mono tabular-nums text-slate-700">—</td></tr>
                            </tbody>
                        </table>
                    </div>
                </x-ui.card>

                <x-ui.alert class="lg:col-span-2" tone="warning" title="Demo — bukan data produk" title-key="alert.title">
                    <span data-i18n="alert.body">Contoh saldo, transaksi, model, status, dan nilai di halaman ini hanya untuk melihat rancangan komponen. Tidak ada pembayaran atau API key aktif.</span>
                </x-ui.alert>
            </div>
        </section>

        <section id="accessibility" class="scroll-mt-28 grid gap-6 lg:grid-cols-[.8fr_1.2fr]" aria-labelledby="accessibility-title">
            <div>
                <p class="eyebrow" data-i18n="access.eyebrow">Aksesibilitas</p>
                <h2 id="accessibility-title" class="section-title" data-i18n="access.title">Nyaman digunakan semua orang</h2>
                <p class="section-description" data-i18n="access.body">Fokus keyboard terlihat, kontrol punya label, dan layout menyesuaikan layar kecil.</p>
            </div>
            <x-ui.card>
                <ul class="space-y-4 text-sm text-slate-700">
                    <li class="flex gap-3"><span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700" aria-hidden="true">✓</span><span data-i18n="access.item1">Navigasi mobile memakai tombol dengan status expanded.</span></li>
                    <li class="flex gap-3"><span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700" aria-hidden="true">✓</span><span data-i18n="access.item2">Dialog mendukung tombol Escape, fokus awal, dan pengembalian fokus.</span></li>
                    <li class="flex gap-3"><span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700" aria-hidden="true">✓</span><span data-i18n="access.item3">Badge status menggunakan teks selain warna.</span></li>
                    <li class="flex gap-3"><span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700" aria-hidden="true">✓</span><span data-i18n="access.item4">Tabel dapat digeser horizontal pada viewport sempit.</span></li>
                </ul>
            </x-ui.card>
        </section>
    </div>
</x-layouts.app>
