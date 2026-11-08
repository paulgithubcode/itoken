import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../../resources/js/pwa.js', import.meta.url), 'utf8');

function createPwaHarness(initialOnline = true, language = 'id') {
    const listeners = new Map();
    const timers = new Map();
    let timerId = 0;
    const classes = new Set(initialOnline ? ['hidden'] : []);
    const text = { textContent: 'Anda sedang offline. Data akun dan fitur server tidak tersedia.' };
    const notice = {
        querySelector: () => text,
        classList: {
            add: (name) => classes.add(name),
            remove: (name) => classes.delete(name),
            contains: (name) => classes.has(name),
        },
    };
    const window = {
        addEventListener: (name, callback) => listeners.set(name, callback),
        setTimeout: (callback) => {
            const id = ++timerId;
            timers.set(id, callback);
            return id;
        },
        clearTimeout: (id) => timers.delete(id),
    };
    const document = {
        documentElement: { lang: language },
        querySelector: (selector) => selector === '#pwa-connectivity' ? notice : null,
        addEventListener: () => {},
    };
    const navigator = { onLine: initialOnline };

    vm.runInNewContext(source, { window, document, navigator, console, URL });

    return {
        dispatch: (name) => listeners.get(name)?.(),
        text: () => text.textContent,
        visible: () => !classes.has('hidden'),
        runTimers: () => {
            for (const callback of [...timers.values()]) callback();
            timers.clear();
        },
        changeLanguage: (lang) => {
            document.documentElement.lang = lang;
            listeners.get('itoken:locale-change')?.();
        },
    };
}

const offlineMessages = {
    id: 'Anda sedang offline. Data akun dan fitur server tidak tersedia.',
    en: 'You are offline. Account data and server features are unavailable.',
    zh_CN: '当前处于离线状态，账户数据和服务器功能不可用。',
};
const onlineMessages = {
    id: 'Koneksi kembali tersedia.',
    en: 'Your connection is back.',
    zh_CN: '网络连接已恢复。',
};

for (const [name, transitions] of Object.entries({
    'offline → online': ['offline', 'online'],
    'online → offline': ['online', 'offline'],
    'offline → online → offline': ['offline', 'online', 'offline'],
    'online → offline → online': ['online', 'offline', 'online'],
})) {
    test(`connectivity notice shows the current state for ${name}`, () => {
        const harness = createPwaHarness(transitions[0] !== 'offline');

        for (const state of transitions) {
            harness.dispatch(state);
            assert.equal(harness.text(), state === 'offline' ? offlineMessages.id : onlineMessages.id);
            assert.equal(harness.visible(), true);
        }

        harness.runTimers();
        assert.equal(harness.visible(), transitions.at(-1) === 'offline');
        assert.equal(harness.text(), transitions.at(-1) === 'offline' ? offlineMessages.id : onlineMessages.id);
    });
}

test('connectivity message follows the current locale without replacing its DOM element', () => {
    const harness = createPwaHarness(false);

    for (const locale of ['id', 'en', 'zh_CN']) {
        harness.changeLanguage(locale);
        assert.equal(harness.text(), offlineMessages[locale]);
    }

    harness.dispatch('online');
    harness.changeLanguage('zh_CN');
    assert.equal(harness.text(), onlineMessages.zh_CN);
});
