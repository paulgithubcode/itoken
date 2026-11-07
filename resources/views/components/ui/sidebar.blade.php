@props(['items' => [], 'label' => 'Navigasi samping', 'labelKey' => null, 'active' => null])

<nav {{ $attributes->class(['rounded-2xl border border-slate-200 bg-white p-3']) }} aria-label="{{ $label }}" @if ($labelKey) data-i18n-aria-label="{{ $labelKey }}" @endif>
    <p class="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[.14em] text-slate-400" @if ($labelKey) data-i18n="{{ $labelKey }}" @endif>{{ $label }}</p>
    <div class="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        @foreach ($items as $item)
            <a href="{{ $item['href'] }}" @if (($item['id'] ?? null) === $active) aria-current="location" @endif class="shrink-0 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 {{ ($item['id'] ?? null) === $active ? 'bg-indigo-50 text-indigo-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950' }}">
                <span @if (isset($item['labelKey'])) data-i18n="{{ $item['labelKey'] }}" @endif>{{ $item['label'] }}</span>
            </a>
        @endforeach
    </div>
</nav>
