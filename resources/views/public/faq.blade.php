<x-layouts.app title="FAQ iToken — Pertanyaan umum" description="Temukan jawaban tentang konsep katalog model AI, kredit, dokumentasi, dan status pratinjau produk iToken." active="faq">
    <div class="mx-auto max-w-3xl">
        <header class="text-center"><p class="eyebrow" data-i18n="faq.page.eyebrow">Bantuan</p><h1 class="mt-3 text-4xl font-bold tracking-tight theme-text-heading sm:text-5xl" data-i18n="faq.page.title">Pertanyaan umum</h1><p class="mt-4 text-base leading-7 theme-text-secondary" data-i18n="faq.page.body">Jawaban ringkas seputar konsep produk. Detail final akan diperbarui setelah keputusan produk dan integrasi tersedia.</p></header>
        <div class="mt-9 divide-y theme-divide rounded-3xl border theme-border theme-surface px-5 sm:px-7">
            @foreach (['faq.one', 'faq.two', 'faq.three', 'faq.four', 'faq.five', 'faq.six', 'faq.seven', 'faq.eight'] as $key)
                <details class="group py-5">
                    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold theme-text-primary focus-visible:outline-none theme-focus"><span data-i18n="{{ $key }}.question">Pertanyaan</span><span class="theme-link transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary>
                    <p class="mt-3 pr-7 text-sm leading-6 theme-text-secondary" data-i18n="{{ $key }}.answer">Jawaban.</p>
                </details>
            @endforeach
        </div>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><x-ui.button href="{{ route('docs.index') }}" variant="secondary" data-i18n="faq.page.docs">Baca dokumentasi demo</x-ui.button><x-ui.button href="{{ route('contact') }}" data-i18n="faq.page.contact">Info kontak</x-ui.button></div>
    </div>
</x-layouts.app>
