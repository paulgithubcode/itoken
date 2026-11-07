<x-layouts.app title="Kontak iToken" active="contact">
    <div class="mx-auto max-w-2xl">
        <x-ui.badge tone="warning" data-i18n="contact.badge">Kanal kontak belum diumumkan</x-ui.badge>
        <h1 class="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl" data-i18n="contact.title">Hubungi tim iToken</h1>
        <p class="mt-5 text-base leading-7 text-slate-600" data-i18n="contact.body">Informasi email dan kanal dukungan resmi belum ditetapkan. Kami tidak menampilkan formulir yang berpura-pura mengirim pesan.</p>
        <x-ui.card class="mt-8">
            <h2 class="text-lg font-bold text-slate-950" data-i18n="contact.next.title">Sementara ini</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600" data-i18n="contact.next.body">Kamu dapat membaca informasi produk dan FAQ demo pada halaman publik.</p>
            <div class="mt-5 flex flex-wrap gap-3"><x-ui.button href="{{ route('faq.index') }}" data-i18n="contact.faq">Buka FAQ</x-ui.button><x-ui.button href="{{ route('docs.index') }}" variant="secondary" data-i18n="contact.docs">Baca dokumentasi</x-ui.button></div>
        </x-ui.card>
    </div>
</x-layouts.app>
