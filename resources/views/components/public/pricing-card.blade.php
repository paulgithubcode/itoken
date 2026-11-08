@props(['package', 'featured' => false])

<article class="theme-surface theme-border relative flex h-full flex-col rounded-3xl border {{ $featured ? 'border-indigo-300 ring-4 ring-indigo-50' : 'border-slate-200' }} bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,.35)] sm:p-6">
    @if ($featured)
        <span class="absolute -top-3 left-5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white" data-i18n="pricing.demo.featured">Pilihan demo</span>
    @endif
    <div class="flex items-center justify-between gap-3">
        <h3 class="text-lg font-bold text-slate-950">{{ $package['name'] }}</h3>
        <x-ui.badge tone="warning">DEMO</x-ui.badge>
    </div>
    <p class="mt-5 text-3xl font-bold tracking-tight text-slate-950 tabular-nums" data-i18n-price="{{ $package['price'] }}">Rp {{ number_format($package['price'], 0, ',', '.') }}</p>
    <p class="mt-1 text-xs font-medium text-slate-500" data-i18n="pricing.demo.currency">Harga contoh · bukan harga final</p>
    <dl class="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
        <div class="flex justify-between gap-3"><dt class="text-slate-600" data-i18n="pricing.credits">Kredit dasar (contoh)</dt><dd class="font-semibold text-slate-900 tabular-nums">{{ $package['credits'] }}</dd></div>
        <div class="flex justify-between gap-3"><dt class="text-slate-600" data-i18n="pricing.bonus">Bonus (contoh)</dt><dd class="font-semibold text-slate-900 tabular-nums">+{{ $package['bonus'] }}</dd></div>
        <div class="flex justify-between gap-3"><dt class="text-slate-600" data-i18n="pricing.validity">Masa berlaku demo</dt><dd class="font-semibold text-slate-900"><span>{{ $package['validity'] }}</span> <span data-i18n="pricing.days">hari</span></dd></div>
    </dl>
    <button type="button" class="demo-plan-button theme-button theme-focus mt-7 min-h-11 w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-800 transition-colors hover:bg-indigo-100 focus-visible:outline-none" data-i18n="pricing.choose">Lihat pilihan (demo)</button>
</article>
