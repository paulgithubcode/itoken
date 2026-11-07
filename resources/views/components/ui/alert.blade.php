@props(['tone' => 'info', 'title' => null, 'titleKey' => null])

@php
    $tones = [
        'info' => 'border-sky-200 bg-sky-50 text-sky-950',
        'success' => 'border-emerald-200 bg-emerald-50 text-emerald-950',
        'warning' => 'border-amber-200 bg-amber-50 text-amber-950',
        'danger' => 'border-rose-200 bg-rose-50 text-rose-950',
    ];
@endphp

<div {{ $attributes->class(['rounded-2xl border p-4 sm:p-5', $tones[$tone] ?? $tones['info']]) }} role="status">
    @if ($title)
        <p class="font-semibold" @if ($titleKey) data-i18n="{{ $titleKey }}" @endif>{{ $title }}</p>
    @endif
    <div class="mt-1 text-sm leading-6 opacity-85">{{ $slot }}</div>
</div>
