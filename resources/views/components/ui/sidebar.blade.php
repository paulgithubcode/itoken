@props(['items' => [], 'label' => 'Navigasi samping', 'labelKey' => null, 'active' => null])

<nav {{ $attributes->class(['theme-surface theme-border rounded-2xl border p-3']) }} aria-label="{{ $label }}" @if ($labelKey) data-i18n-aria-label="{{ $labelKey }}" @endif>
    <p class="theme-text-faint px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[.14em]" @if ($labelKey) data-i18n="{{ $labelKey }}" @endif>{{ $label }}</p>
    <div class="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        @foreach ($items as $item)
            <a href="{{ $item['href'] }}" @if (($item['id'] ?? null) === $active) aria-current="location" @endif class="theme-focus shrink-0 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none {{ ($item['id'] ?? null) === $active ? 'theme-sidebar-active' : 'theme-sidebar-inactive' }}">
                <span @if (isset($item['labelKey'])) data-i18n="{{ $item['labelKey'] }}" @endif>{{ $item['label'] }}</span>
            </a>
        @endforeach
    </div>
</nav>
