@props(['titleKey', 'title', 'value', 'noteKey', 'note', 'icon'])

<x-ui.card padding="p-5 sm:p-6">
    <div class="flex min-w-0 items-start justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3">
            <span class="grid size-10 shrink-0 place-items-center rounded-xl theme-interactive-surface theme-link" aria-hidden="true">
                <x-dashboard.nav-icon :name="$icon" />
            </span>
            <p class="min-w-0 text-sm font-semibold leading-5 theme-text-secondary" data-i18n="{{ $titleKey }}">{{ $title }}</p>
        </div>
        <x-ui.badge tone="warning">DEMO</x-ui.badge>
    </div>
    <p class="mt-5 truncate text-2xl font-bold tracking-tight theme-text-heading tabular-nums sm:text-3xl">{{ $value }}</p>
    <p class="mt-2 min-h-10 text-xs leading-5 theme-text-muted" data-i18n="{{ $noteKey }}">{{ $note }}</p>
</x-ui.card>
