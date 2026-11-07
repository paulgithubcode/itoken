@props(['tone' => 'neutral'])

@php
    $tones = [
        'neutral' => 'border-slate-200 bg-slate-100 text-slate-700',
        'success' => 'border-emerald-200 bg-emerald-50 text-emerald-800',
        'warning' => 'border-amber-200 bg-amber-50 text-amber-900',
        'danger' => 'border-rose-200 bg-rose-50 text-rose-800',
        'info' => 'border-sky-200 bg-sky-50 text-sky-800',
    ];
@endphp

<span {{ $attributes->class(['inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none', $tones[$tone] ?? $tones['neutral']]) }}>
    {{ $slot }}
</span>
