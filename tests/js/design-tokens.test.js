import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('resources/css/app.css', 'utf8');

function themeBlock(selector) {
    const start = css.indexOf(selector);
    assert.notEqual(start, -1, `missing CSS selector: ${selector}`);
    const end = css.indexOf('}', start);
    return css.slice(start, end + 1);
}

function token(block, name) {
    const value = block.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
    assert.ok(value, `missing color token: ${name}`);
    return value;
}

function luminance(hex) {
    const channels = hex.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16) / 255);
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function contrast(foreground, background) {
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
}

test('semantic theme tokens have Light and Dark values', () => {
    const light = themeBlock(':root {');
    const dark = themeBlock("html[data-theme='dark'] {");
    const required = [
        'page', 'surface', 'surface-muted', 'text-primary', 'text-secondary', 'text-muted',
        'border', 'input', 'interactive', 'focus', 'success', 'warning', 'danger', 'info',
    ];

    for (const name of required) {
        assert.ok(token(light, name), `Light token ${name}`);
        assert.ok(token(dark, name), `Dark token ${name}`);
    }
});

test('body, descriptive, link, and status text meet WCAG AA contrast on their surfaces', () => {
    const themes = [themeBlock(':root {'), themeBlock("html[data-theme='dark'] {")];

    for (const theme of themes) {
        const surface = token(theme, 'surface');
        const page = token(theme, 'page');
        assert.ok(contrast(token(theme, 'text-primary'), page) >= 4.5);
        assert.ok(contrast(token(theme, 'text-secondary'), surface) >= 4.5);
        assert.ok(contrast(token(theme, 'text-muted'), surface) >= 4.5);
        assert.ok(contrast(token(theme, 'interactive'), surface) >= 4.5);

        for (const status of ['success', 'warning', 'danger', 'info']) {
            assert.ok(contrast(token(theme, status), token(theme, `${status}-surface`)) >= 4.5, `${status} contrast`);
            assert.ok(contrast(token(theme, `${status}-strong`), token(theme, `${status}-surface`)) >= 4.5, `${status} alert contrast`);
        }
    }
});

test('shared components and sample pages use the global theme foundation', () => {
    const files = [
        'resources/views/components/ui/card.blade.php',
        'resources/views/components/ui/button.blade.php',
        'resources/views/components/ui/badge.blade.php',
        'resources/views/components/ui/alert.blade.php',
        'resources/views/components/ui/field.blade.php',
        'resources/views/public/home.blade.php',
        'resources/views/public/pricing.blade.php',
        'resources/views/auth/login.blade.php',
        'resources/views/dashboard/index.blade.php',
    ];

    const sources = new Map(files.map((path) => [path, readFileSync(path, 'utf8')]));
    for (const [path, source] of sources) assert.ok(source.length > 0, `${path} exists`);

    assert.match(css, /\.theme-surface\s*\{/);
    assert.match(css, /\.theme-button-secondary\s*\{/);
    assert.match(css, /\.theme-badge-warning\s*\{/);
    assert.match(css, /\.theme-alert-danger\s*\{/);
    assert.match(css, /\.theme-input\s*\{/);
    assert.doesNotMatch(css, /data-dashboard-theme/);
    assert.match(readFileSync('resources/views/components/layouts/app.blade.php', 'utf8'), /class="theme-page/);
    assert.match(readFileSync('resources/views/components/layouts/auth.blade.php', 'utf8'), /class="theme-page/);
    assert.match(sources.get('resources/views/auth/login.blade.php'), /theme-input/);
    assert.match(sources.get('resources/views/dashboard/index.blade.php'), /class="theme-page/);
});
