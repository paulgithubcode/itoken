@props(['model'])

<article class="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,.28)] sm:p-6" data-model-card data-provider="{{ $model['provider'] }}" data-search="{{ strtolower($model['name'].' '.$model['provider'].' '.$model['id']) }}">
    <div class="flex items-start justify-between gap-3">
        <span class="grid size-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-700">{{ strtoupper(substr($model['provider'], 0, 1)) }}</span>
        <x-ui.badge tone="warning" data-i18n="models.demo.badge">Contoh · belum dikonfirmasi</x-ui.badge>
    </div>
    <div class="mt-5">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ $model['provider'] }}</p>
        <h3 class="mt-1 text-lg font-bold tracking-tight text-slate-950">{{ $model['name'] }}</h3>
        <p class="mt-2 text-sm leading-6 text-slate-600" data-i18n="{{ $model['description'] }}">Contoh deskripsi model.</p>
    </div>
    <dl class="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div><dt class="text-xs text-slate-500" data-i18n="models.category.label">Kategori demo</dt><dd class="mt-1 font-semibold text-slate-800" data-i18n="{{ $model['category'] }}">Umum</dd></div>
        <div><dt class="text-xs text-slate-500" data-i18n="models.context.label">Konteks contoh</dt><dd class="mt-1 font-mono font-semibold tabular-nums text-slate-800">{{ $model['context'] }}</dd></div>
    </dl>
    <a href="{{ route('docs.index') }}#models" class="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-indigo-700 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" data-i18n="models.docs.cta">Lihat panduan model <span aria-hidden="true">→</span></a>
</article>
