<x-layouts.app :title="$document === 'terms' ? 'Syarat layanan' : 'Privasi'" :description="$document === 'terms' ? 'Halaman syarat layanan iToken masih berupa placeholder dan belum memuat ketentuan resmi.' : 'Halaman privasi iToken masih berupa placeholder; kebijakan privasi resmi belum diterbitkan.'" :active="$document" robots="noindex, follow">
    <article class="prose-copy mx-auto max-w-3xl">
        <x-ui.badge tone="warning" data-i18n="legal.draft">DRAF · BELUM MENJADI KETENTUAN RESMI</x-ui.badge>
        <h1 class="mt-5 text-4xl font-bold tracking-tight theme-text-heading" data-i18n="legal.{{ $document }}.title">Informasi belum tersedia</h1>
        <p class="mt-5 text-base leading-7 theme-text-secondary" data-i18n="legal.intro">Konten legal resmi belum disiapkan. Halaman ini adalah placeholder navigasi dan bukan nasihat atau ketentuan yang berlaku.</p>
        @if ($document === 'privacy')
            <x-ui.alert class="mt-7" tone="info" title="Prinsip privasi produk" title-key="legal.privacy.note"><span data-i18n="legal.privacy.body">Kebijakan zero-logging prompt dan completion merupakan keputusan arsitektur; rincian kebijakan privasi resmi masih menunggu persetujuan.</span></x-ui.alert>
        @else
            <x-ui.alert class="mt-7" tone="warning" title="Ketentuan belum diterbitkan" title-key="legal.terms.note"><span data-i18n="legal.terms.body">Jangan menggunakan halaman ini sebagai syarat penggunaan layanan.</span></x-ui.alert>
        @endif
        <a class="mt-8 inline-flex text-sm font-semibold theme-link" href="{{ route('home') }}" data-i18n="legal.home">Kembali ke beranda →</a>
    </article>
</x-layouts.app>
