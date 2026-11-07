@props(['id', 'label', 'hint' => null, 'error' => null, 'type' => 'text', 'labelKey' => null, 'hintKey' => null, 'errorKey' => null])

<div class="space-y-2">
    <label for="{{ $id }}" class="block text-sm font-semibold text-slate-800" @if ($labelKey) data-i18n="{{ $labelKey }}" @endif>{{ $label }}</label>
    <input
        id="{{ $id }}"
        name="{{ $id }}"
        type="{{ $type }}"
        aria-describedby="{{ $error ? $id.'-error' : ($hint ? $id.'-hint' : '') }}"
        @if ($error) aria-invalid="true" @endif
        {{ $attributes->class(['min-h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100', $error ? 'border-rose-400' : 'border-slate-200']) }}
    >
    @if ($hint)
        <p id="{{ $id }}-hint" class="text-sm text-slate-500" @if ($hintKey) data-i18n="{{ $hintKey }}" @endif>{{ $hint }}</p>
    @endif
    @if ($error)
        <p id="{{ $id }}-error" class="text-sm font-medium text-rose-700" @if ($errorKey) data-i18n="{{ $errorKey }}" @endif>{{ $error }}</p>
    @endif
</div>
