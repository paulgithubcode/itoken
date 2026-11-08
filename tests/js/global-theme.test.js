import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { dashboardTranslations } from '../../resources/js/dashboard-translations.js';

const themeScript = readFileSync('public/theme-init.js', 'utf8');

function loadTheme({ initial = {}, systemDark = false, storageAvailable = true, failWrites = false } = {}) {
    const values = new Map(Object.entries(initial));
    const storage = {
        getItem(key) { return values.get(key) ?? null; },
        setItem(key, value) {
            if (failWrites) throw new Error('storage write blocked');
            values.set(key, String(value));
        },
        removeItem(key) { values.delete(key); },
    };
    const root = { dataset: {}, style: {} };
    let changeListener;
    const systemPreference = {
        matches: systemDark,
        addEventListener(type, listener) {
            if (type === 'change') changeListener = listener;
        },
        change(matches) {
            this.matches = matches;
            changeListener?.({ matches });
        },
    };
    const window = { matchMedia: () => systemPreference };
    const windowListeners = {};
    window.addEventListener = (type, listener) => { windowListeners[type] = listener; };
    Object.defineProperty(window, 'localStorage', {
        get() {
            if (!storageAvailable) throw new Error('storage access blocked');
            return storage;
        },
    });

    runInNewContext(themeScript, { window, document: { documentElement: root } });

    return { api: window.iTokenTheme, root, storage, systemPreference, values, windowListeners };
}

test('new users default to System and resolve it from the operating system', () => {
    const lightSystem = loadTheme();
    assert.equal(lightSystem.api.getPreference(), 'system');
    assert.equal(lightSystem.root.dataset.theme, 'light');
    assert.equal(lightSystem.root.style.colorScheme, 'light');

    const darkSystem = loadTheme({ systemDark: true });
    assert.equal(darkSystem.api.getPreference(), 'system');
    assert.equal(darkSystem.root.dataset.theme, 'dark');
});

test('legacy Light preference migrates to the global key', () => {
    const theme = loadTheme({ initial: { 'itoken.dashboard.theme': 'light' } });

    assert.equal(theme.api.getPreference(), 'light');
    assert.equal(theme.values.get('itoken.theme'), 'light');
    assert.equal(theme.values.has('itoken.dashboard.theme'), false);
    assert.equal(theme.root.dataset.theme, 'light');
});

test('legacy Dark preference migrates to the global key', () => {
    const theme = loadTheme({ initial: { 'itoken.dashboard.theme': 'dark' } });

    assert.equal(theme.api.getPreference(), 'dark');
    assert.equal(theme.values.get('itoken.theme'), 'dark');
    assert.equal(theme.values.has('itoken.dashboard.theme'), false);
    assert.equal(theme.root.dataset.theme, 'dark');
});

test('missing or invalid legacy preferences default to System', () => {
    assert.equal(loadTheme().api.getPreference(), 'system');

    const invalid = loadTheme({ initial: { 'itoken.theme': 'neon', 'itoken.dashboard.theme': 'neon' } });
    assert.equal(invalid.api.getPreference(), 'system');
    assert.equal(invalid.values.get('itoken.dashboard.theme'), 'neon');

    const staleLegacy = loadTheme({ initial: { 'itoken.theme': 'invalid', 'itoken.dashboard.theme': 'dark' } });
    assert.equal(staleLegacy.api.getPreference(), 'system');
    assert.equal(staleLegacy.values.has('itoken.theme'), true);
    assert.equal(staleLegacy.values.get('itoken.dashboard.theme'), 'dark');
});

test('a legacy value is retained if migration cannot be written', () => {
    const theme = loadTheme({ initial: { 'itoken.dashboard.theme': 'dark' }, failWrites: true });

    assert.equal(theme.api.getPreference(), 'dark');
    assert.equal(theme.values.has('itoken.theme'), false);
    assert.equal(theme.values.get('itoken.dashboard.theme'), 'dark');
});

test('explicit Light and Dark choices do not follow later operating system changes', () => {
    const light = loadTheme({ systemDark: true });
    assert.equal(light.api.setPreference('light'), true);
    light.systemPreference.change(false);
    light.systemPreference.change(true);
    assert.equal(light.root.dataset.theme, 'light');

    const dark = loadTheme();
    assert.equal(dark.api.setPreference('dark'), true);
    dark.systemPreference.change(true);
    dark.systemPreference.change(false);
    assert.equal(dark.root.dataset.theme, 'dark');
});

test('System follows operating system changes while the page remains loaded', () => {
    const theme = loadTheme();

    theme.systemPreference.change(true);
    assert.equal(theme.root.dataset.theme, 'dark');
    assert.equal(theme.root.style.colorScheme, 'dark');
    theme.systemPreference.change(false);
    assert.equal(theme.root.dataset.theme, 'light');
});

test('theme preference changes in another tab and when restored from bfcache are applied', () => {
    const theme = loadTheme();

    theme.values.set('itoken.theme', 'dark');
    theme.windowListeners.storage({ key: 'itoken.theme', newValue: 'dark' });
    assert.equal(theme.api.getPreference(), 'dark');
    assert.equal(theme.root.dataset.theme, 'dark');
    assert.equal(theme.root.style.colorScheme, 'dark');

    theme.windowListeners.storage({ key: 'itoken.dashboard.density', newValue: 'compact' });
    assert.equal(theme.api.getPreference(), 'dark');
    assert.equal(theme.root.dataset.theme, 'dark');

    theme.values.set('itoken.theme', 'light');
    theme.windowListeners.pageshow({ persisted: true });
    assert.equal(theme.api.getPreference(), 'light');
    assert.equal(theme.root.dataset.theme, 'light');
    assert.equal(theme.root.style.colorScheme, 'light');

    theme.systemPreference.change(true);
    theme.values.set('itoken.theme', 'system');
    theme.windowListeners.storage({ key: 'itoken.theme', newValue: 'system' });
    assert.equal(theme.api.getPreference(), 'system');
    assert.equal(theme.root.dataset.theme, 'dark');
    theme.systemPreference.change(false);
    assert.equal(theme.root.dataset.theme, 'light');

    theme.values.set('itoken.theme', 'dark');
    theme.windowListeners.storage({ key: 'itoken.theme', newValue: 'dark' });
    theme.systemPreference.change(true);
    assert.equal(theme.api.getPreference(), 'dark');
    assert.equal(theme.root.dataset.theme, 'dark');
});

test('theme selection applies immediately and reset restores System', () => {
    const theme = loadTheme({ initial: {
        'itoken.dashboard.density': 'compact',
        'itoken.dashboard.table-rows': '50',
        'itoken.dashboard.profile.display-name': 'Example',
    } });

    assert.equal(theme.api.setPreference('dark'), true);
    assert.equal(theme.root.dataset.theme, 'dark');
    assert.equal(theme.values.get('itoken.theme'), 'dark');

    assert.equal(theme.api.resetPreference(), true);
    assert.equal(theme.api.getPreference(), 'system');
    assert.equal(theme.values.get('itoken.theme'), 'system');
    assert.equal(theme.values.get('itoken.dashboard.density'), 'compact');
    assert.equal(theme.values.get('itoken.dashboard.table-rows'), '50');
    assert.equal(theme.values.get('itoken.dashboard.profile.display-name'), 'Example');
    theme.systemPreference.change(true);
    assert.equal(theme.root.dataset.theme, 'dark');
});

test('unavailable localStorage does not break theme initialization or immediate changes', () => {
    const theme = loadTheme({ storageAvailable: false });

    assert.equal(theme.api.getPreference(), 'system');
    assert.doesNotThrow(() => theme.systemPreference.change(true));
    assert.equal(theme.root.dataset.theme, 'dark');
    assert.equal(theme.api.setPreference('light'), false);
    assert.equal(theme.root.dataset.theme, 'light');
});

test('failed localStorage writes keep the active theme usable', () => {
    const theme = loadTheme({ failWrites: true });

    assert.equal(theme.api.setPreference('dark'), false);
    assert.equal(theme.api.getPreference(), 'dark');
    assert.equal(theme.root.dataset.theme, 'dark');
});

test('public, Auth, and Dashboard layouts run the same initializer before Vite styles', () => {
    const layouts = [
        'resources/views/components/layouts/app.blade.php',
        'resources/views/components/layouts/auth.blade.php',
        'resources/views/dashboard/index.blade.php',
    ];

    for (const file of layouts) {
        const source = readFileSync(file, 'utf8');
        const initializer = source.indexOf('<script src="{{ asset(\'theme-init.js\') }}"></script>');
        const vite = source.indexOf("@vite(['resources/css/app.css', 'resources/js/app.js'])");

        assert.notEqual(initializer, -1, `${file} must include the shared theme initializer`);
        assert.ok(vite > initializer, `${file} must initialize theme before Vite CSS`);
    }
});

test('Dashboard Settings uses the saved preference and its reset leaves other preferences alone', () => {
    const dashboardScript = readFileSync('resources/js/dashboard.js', 'utf8');
    const preferencesScript = readFileSync('resources/js/dashboard-preferences.js', 'utf8');
    const dashboardView = readFileSync('resources/views/dashboard/index.blade.php', 'utf8');

    assert.match(dashboardView, /<option value="system" data-i18n="settings\.theme\.system">/);
    assert.match(dashboardScript, /window\.iTokenTheme\.getPreference\(\)/);
    assert.match(dashboardScript, /window\.iTokenTheme\.setPreference\(value\)/);
    assert.match(dashboardScript, /window\.iTokenTheme\.resetPreference\(\)/);
    assert.doesNotMatch(dashboardScript, /resetDashboardPreferences/);
    assert.doesNotMatch(preferencesScript, /itoken\.theme|itoken\.dashboard\.theme/);
});

test('System theme and reset labels are translated in Indonesian, English, and Chinese', () => {
    for (const locale of ['id', 'en', 'zh_CN']) {
        assert.ok(dashboardTranslations[locale]['settings.theme.system']);
        assert.ok(dashboardTranslations[locale]['settings.theme.reset']);
        assert.ok(dashboardTranslations[locale]['settings.preferences.reset_confirm']);
        assert.ok(dashboardTranslations[locale]['settings.preferences.reset_done']);
    }
});
