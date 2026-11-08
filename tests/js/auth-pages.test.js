import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { publicTranslations } from '../../resources/js/public-translations.js';

const viewFiles = [
    'resources/views/components/layouts/auth.blade.php',
    ...readdirSync('resources/views/auth').map((file) => `resources/views/auth/${file}`),
];

const usedTranslationKeys = new Set();

for (const file of viewFiles) {
    const source = readFileSync(file, 'utf8');

    for (const match of source.matchAll(/data-i18n(?:-placeholder|-aria-label)?="([^"]+)"/g)) {
        if (!match[1].includes('{{')) usedTranslationKeys.add(match[1]);
    }
}

test('every static authentication UI string has Indonesian, English, and Chinese translations', () => {
    for (const locale of ['id', 'en', 'zh_CN']) {
        for (const key of usedTranslationKeys) {
            assert.ok(publicTranslations[locale]?.[key], `${locale} is missing ${key}`);
        }
    }
});

test('authentication page titles are translated in all supported locales', () => {
    const keys = [
        'page.auth.login.title',
        'page.auth.register.title',
        'page.auth.forgot.title',
        'page.auth.instructions.title',
    ];

    for (const locale of ['id', 'en', 'zh_CN']) {
        for (const key of keys) assert.ok(publicTranslations[locale]?.[key], `${locale} is missing ${key}`);
    }
});
