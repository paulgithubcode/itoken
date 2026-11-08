@props(['variant' => 'primary', 'type' => 'button', 'href' => null, 'size' => 'md'])

@php
    $variants = [
        'primary' => 'border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus-visible:ring-indigo-500',
        'secondary' => 'theme-button-secondary',
        'ghost' => 'theme-button-ghost border-transparent bg-transparent',
        'danger' => 'border-transparent bg-rose-600 text-white hover:bg-rose-700',
    ];
    $sizes = [
        'sm' => 'min-h-9 px-3 text-sm',
        'md' => 'min-h-11 px-4 text-sm',
        'lg' => 'min-h-12 px-5 text-base',
    ];
    $classes = 'theme-button theme-focus inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->class([$classes, $variants[$variant] ?? $variants['primary'], $sizes[$size] ?? $sizes['md']]) }}>
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" {{ $attributes->class([$classes, $variants[$variant] ?? $variants['primary'], $sizes[$size] ?? $sizes['md']]) }}>
        {{ $slot }}
    </button>
@endif
