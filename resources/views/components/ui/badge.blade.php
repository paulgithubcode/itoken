@props(['tone' => 'neutral'])

@php
    $tones = [
        'neutral' => 'theme-badge-neutral',
        'success' => 'theme-badge-success',
        'warning' => 'theme-badge-warning',
        'danger' => 'theme-badge-danger',
        'info' => 'theme-badge-info',
    ];
@endphp

<span {{ $attributes->class(['inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none', $tones[$tone] ?? $tones['neutral']]) }}>
    {{ $slot }}
</span>
