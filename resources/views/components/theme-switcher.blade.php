@props(['variant' => 'desktop'])

@php($isMobile = $variant === 'mobile')

<div class="{{ $isMobile ? 'w-full' : 'relative shrink-0' }}" data-theme-switcher>
    <button
        type="button"
        class="{{ $isMobile ? 'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold theme-text-secondary theme-hover-surface' : 'grid size-10 place-items-center rounded-xl border theme-border theme-surface theme-text-secondary theme-hover-surface' }} focus-visible:outline-none theme-focus"
        data-theme-switcher-toggle
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="public-theme-menu-{{ $variant }}"
        aria-label="Pilih tema"
        title="Pilih tema"
        data-i18n-aria-label="theme.switcher.open"
        data-i18n-title="theme.switcher.open"
    >
        <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path stroke-linecap="round" d="M12 3.5v17" />
        </svg>
        @if ($isMobile)
            <span data-i18n="theme.switcher.label">Tema</span>
        @endif
    </button>

    <div
        id="public-theme-menu-{{ $variant }}"
        class="{{ $isMobile ? 'relative mt-2 w-full' : 'absolute right-0 top-full z-50 mt-2 w-52' }} rounded-2xl border theme-border theme-surface p-2 text-sm theme-text-primary shadow-xl"
        data-theme-switcher-menu
        hidden
        role="menu"
        aria-label="Pilih tema"
        data-i18n-aria-label="theme.switcher.label"
    >
        <p class="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide theme-text-muted" aria-hidden="true" data-i18n="theme.switcher.label">Tema</p>
        <button type="button" tabindex="-1" class="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left font-medium theme-text-secondary theme-hover-surface theme-focus" data-theme-choice="light" role="menuitemradio" aria-checked="false">
            <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path stroke-linecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
            <span data-i18n="theme.switcher.light">Light</span>
            <svg class="ml-auto size-4 theme-link" data-theme-selection-indicator hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4 10 4 4 8-8" /></svg>
        </button>
        <button type="button" tabindex="-1" class="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left font-medium theme-text-secondary theme-hover-surface theme-focus" data-theme-choice="dark" role="menuitemradio" aria-checked="false">
            <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" /></svg>
            <span data-i18n="theme.switcher.dark">Dark</span>
            <svg class="ml-auto size-4 theme-link" data-theme-selection-indicator hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4 10 4 4 8-8" /></svg>
        </button>
        <button type="button" tabindex="-1" class="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left font-medium theme-text-secondary theme-hover-surface theme-focus" data-theme-choice="system" role="menuitemradio" aria-checked="false">
            <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8m-4-4v4m-5-7 3-3 2 2 3-4 3 5" /></svg>
            <span data-i18n="theme.switcher.system">System</span>
            <svg class="ml-auto size-4 theme-link" data-theme-selection-indicator hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4 10 4 4 8-8" /></svg>
        </button>
    </div>
    <span class="sr-only" data-theme-switcher-status role="status" aria-live="polite" aria-atomic="true"></span>
</div>
