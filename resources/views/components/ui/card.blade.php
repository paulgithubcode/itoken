@props(['padding' => 'p-5 sm:p-6'])

<section {{ $attributes->class(['rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_36px_-28px_rgba(15,23,42,.28)]', $padding]) }}>
    {{ $slot }}
</section>
