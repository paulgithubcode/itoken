@props(['tone' => 'info', 'title' => null, 'titleKey' => null])

@php
    $tones = [
        'info' => 'theme-alert-info',
        'success' => 'theme-alert-success',
        'warning' => 'theme-alert-warning',
        'danger' => 'theme-alert-danger',
    ];
@endphp

<div {{ $attributes->class(['rounded-2xl border p-4 sm:p-5', $tones[$tone] ?? $tones['info']]) }} role="status">
    @if ($title)
        <p class="font-semibold" @if ($titleKey) data-i18n="{{ $titleKey }}" @endif>{{ $title }}</p>
    @endif
    <div class="mt-1 text-sm leading-6 opacity-85">{{ $slot }}</div>
</div>
