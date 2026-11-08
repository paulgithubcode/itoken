@props(['id', 'label', 'hint' => null, 'error' => null, 'type' => 'text', 'labelKey' => null, 'hintKey' => null, 'errorKey' => null])

<div class="space-y-2">
    <label for="{{ $id }}" class="theme-text-label block text-sm font-semibold" @if ($labelKey) data-i18n="{{ $labelKey }}" @endif>{{ $label }}</label>
    <input
        id="{{ $id }}"
        name="{{ $id }}"
        type="{{ $type }}"
        aria-describedby="{{ $error ? $id.'-error' : ($hint ? $id.'-hint' : '') }}"
        @if ($error) aria-invalid="true" @endif
        {{ $attributes->class(['theme-focus theme-input min-h-12 w-full rounded-xl border px-4 text-sm shadow-sm outline-none transition placeholder:text-slate-400', $error ? 'theme-field-error' : '']) }}
    >
    @if ($hint)
        <p id="{{ $id }}-hint" class="theme-text-muted text-sm" @if ($hintKey) data-i18n="{{ $hintKey }}" @endif>{{ $hint }}</p>
    @endif
    @if ($error)
        <p id="{{ $id }}-error" class="theme-field-error-text text-sm font-medium" @if ($errorKey) data-i18n="{{ $errorKey }}" @endif>{{ $error }}</p>
    @endif
</div>
