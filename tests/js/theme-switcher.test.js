import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initializeThemeSwitchers } from '../../resources/js/theme-switcher.js';
import { publicTranslations } from '../../resources/js/public-translations.js';

class FakeElement {
    constructor(dataset = {}) {
        this.dataset = dataset;
        this.hidden = false;
        this.attributes = {};
        this.listeners = {};
        this.classes = new Set();
        this.classList = {
            toggle: (name, force) => {
                const shouldAdd = force ?? !this.classes.has(name);
                if (shouldAdd) this.classes.add(name);
                else this.classes.delete(name);
                return shouldAdd;
            },
            contains: (name) => this.classes.has(name),
        };
        this.children = {};
        this.focused = false;
        this.textContent = '';
    }

    addEventListener(type, listener) {
        this.listeners[type] = listener;
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name] ?? null;
    }

    toggleAttribute(name, force) {
        this.attributes[name] = force;
    }

    querySelector(selector) {
        return this.children[selector] ?? null;
    }

    querySelectorAll(selector) {
        return this.children[selector] ?? [];
    }

    contains(target) {
        return target === this || Object.values(this.children).some((child) => child === target || child.includes?.(target));
    }

    focus() {
        this.focused = true;
    }

    click() {
        this.listeners.click?.({ target: this, preventDefault() {} });
    }
}

function createSwitcher() {
    const root = new FakeElement();
    const toggle = new FakeElement();
    const menu = new FakeElement();
    const status = new FakeElement();
    menu.hidden = true;
    const indicators = ['light', 'dark', 'system'].map(() => new FakeElement());
    const choices = ['light', 'dark', 'system'].map((value, index) => {
        const choice = new FakeElement({ themeChoice: value });
        choice.querySelector = (selector) => selector === '[data-theme-selection-indicator]' ? indicators[index] : null;
        return choice;
    });
    menu.children['[data-theme-choice]'] = choices;
    root.children = {
        '[data-theme-switcher-toggle]': toggle,
        '[data-theme-switcher-menu]': menu,
        '[data-theme-switcher-status]': status,
        '[data-theme-choice]': choices,
    };
    root.contains = (target) => target === root || target === toggle || target === menu || target === status || choices.includes(target);
    return { root, toggle, menu, status, choices, indicators };
}

function createEnvironment(initialPreference = 'system', locale = 'en') {
    const first = createSwitcher();
    const second = createSwitcher();
    const documentListeners = {};
    const windowListeners = {};
    const root = {
        documentElement: { lang: locale },
        querySelectorAll: () => [first.root, second.root],
        addEventListener(type, listener) { documentListeners[type] = listener; },
    };
    const fakeWindow = {
        addEventListener(type, listener) { windowListeners[type] = listener; },
    };
    const theme = {
        preference: initialPreference,
        getPreference() { return this.preference; },
        setPreference(value) { this.preference = value; return true; },
    };

    initializeThemeSwitchers({ root, theme, events: fakeWindow });
    return { first, second, documentListeners, windowListeners, theme };
}

function press(element, key) {
    let prevented = false;
    element.listeners.keydown?.({
        key,
        preventDefault() { prevented = true; },
    });
    return prevented;
}

test('desktop and mobile switchers expose the shared checked theme and apply a selection', () => {
    const { first, second, windowListeners, documentListeners, theme } = createEnvironment('dark');

    for (const switcher of [first, second]) {
        assert.equal(switcher.choices[1].getAttribute('aria-checked'), 'true');
        assert.equal(switcher.choices[1].classList.contains('theme-switcher-choice-selected'), true);
        assert.equal(switcher.indicators[1].attributes.hidden, false);
        assert.equal(switcher.choices[0].getAttribute('aria-checked'), 'false');
    }

    first.toggle.click();
    assert.equal(first.menu.hidden, false);
    assert.equal(first.toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(first.choices[1].focused, true);
    first.choices[0].click();

    assert.equal(theme.getPreference(), 'light');
    assert.equal(first.menu.hidden, true);
    assert.equal(first.toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(first.toggle.focused, true);
    assert.equal(second.choices[0].getAttribute('aria-checked'), 'true');
    assert.equal(first.status.textContent, 'Light theme selected.');
    assert.equal(second.status.textContent, 'Light theme selected.');

    theme.preference = 'system';
    assert.equal(typeof windowListeners.storage, 'function');
    assert.equal(documentListeners.storage, undefined);
    windowListeners.storage({ key: 'itoken.theme', newValue: 'system' });
    assert.equal(second.choices[2].getAttribute('aria-checked'), 'true');
});

test('menu arrow keys and Home/End move focus without changing the selected theme', () => {
    const { first, theme } = createEnvironment('dark');
    first.toggle.click();

    assert.equal(press(first.choices[1], 'ArrowDown'), true);
    assert.equal(first.choices[2].focused, true);
    assert.equal(theme.getPreference(), 'dark');

    press(first.choices[2], 'ArrowDown');
    assert.equal(first.choices[0].focused, true);
    press(first.choices[0], 'ArrowUp');
    assert.equal(first.choices[2].focused, true);
    press(first.choices[2], 'Home');
    assert.equal(first.choices[0].focused, true);
    press(first.choices[0], 'End');
    assert.equal(first.choices[2].focused, true);
    assert.equal(theme.getPreference(), 'dark');
});

test('Enter and Space select the focused menuitemradio and announce the selection', () => {
    const { first, second, theme } = createEnvironment('system', 'id');
    first.toggle.click();

    assert.equal(press(first.choices[0], 'Enter'), true);
    assert.equal(theme.getPreference(), 'light');
    assert.equal(first.menu.hidden, true);
    assert.equal(first.toggle.focused, true);
    assert.equal(first.status.textContent, 'Tema terang dipilih.');
    assert.equal(second.choices[0].getAttribute('aria-checked'), 'true');

    second.toggle.click();
    assert.equal(second.choices[0].focused, true);
    press(second.choices[1], ' ');
    assert.equal(theme.getPreference(), 'dark');
    assert.equal(second.status.textContent, 'Tema gelap dipilih.');
    assert.equal(first.choices[1].getAttribute('aria-checked'), 'true');

    second.toggle.click();
    press(second.choices[1], 'ArrowDown');
    press(second.choices[2], ' ');
    assert.equal(theme.getPreference(), 'system');
    assert.equal(second.status.textContent, 'Tema mengikuti sistem dipilih.');
});

test('Escape closes the menu and restores focus; Tab closes without trapping navigation', () => {
    const { first, documentListeners } = createEnvironment();
    first.toggle.click();

    let escapePrevented = false;
    documentListeners.keydown({ key: 'Escape', preventDefault() { escapePrevented = true; } });
    assert.equal(escapePrevented, true);
    assert.equal(first.menu.hidden, true);
    assert.equal(first.toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(first.toggle.focused, true);

    first.toggle.click();
    let tabPrevented = false;
    documentListeners.keydown({ key: 'Tab', preventDefault() { tabPrevented = true; } });
    assert.equal(tabPrevented, false);
    assert.equal(first.menu.hidden, true);
    assert.equal(first.toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(first.toggle.focused, true);
});

test('clicking outside closes an open switcher', () => {
    const { first, documentListeners } = createEnvironment();
    first.toggle.click();
    documentListeners.click({ target: {} });
    assert.equal(first.menu.hidden, true);
    assert.equal(first.toggle.getAttribute('aria-expanded'), 'false');
});

test('the switcher uses radio menu semantics, accessible live status, and visible focus styling', () => {
    const component = readFileSync('resources/views/components/theme-switcher.blade.php', 'utf8');
    const styles = readFileSync('resources/css/app.css', 'utf8');
    const translations = readFileSync('resources/js/public-translations.js', 'utf8');

    assert.match(component, /aria-haspopup="menu"/);
    assert.match(component, /type="button"/);
    assert.match(component, /aria-expanded="false"/);
    assert.match(component, /aria-controls="public-theme-menu-\{\{ \$variant \}\}"/);
    assert.match(component, /role="menu"/);
    assert.match(component, /role="menuitemradio" aria-checked="false"/);
    assert.equal((component.match(/tabindex="-1"/g) ?? []).length, 3);
    assert.match(component, /role="status" aria-live="polite" aria-atomic="true"/);
    assert.match(component, /aria-hidden="true" data-i18n="theme\.switcher\.label"/);
    assert.match(styles, /\.theme-focus:focus-visible\s*\{\s*outline:\s*4px solid var\(--color-focus\)/);

    for (const locale of ['id', 'en', 'zh_CN']) {
        for (const preference of ['light', 'dark', 'system']) {
            assert.ok(publicTranslations[locale][`theme.switcher.selected.${preference}`], `missing ${locale} selected announcement for ${preference}`);
        }
    }
    assert.ok(translations.includes('theme.switcher.selected.light'));
});

test('desktop and mobile layouts render the same translated theme choices', () => {
    const layout = readFileSync('resources/views/components/layouts/app.blade.php', 'utf8');
    const component = readFileSync('resources/views/components/theme-switcher.blade.php', 'utf8');
    const translations = readFileSync('resources/js/public-translations.js', 'utf8');

    assert.match(layout, /<x-theme-switcher variant="desktop"\s*\/>/);
    assert.match(layout, /<x-theme-switcher variant="mobile"\s*\/>/);
    for (const preference of ['light', 'dark', 'system']) {
        assert.match(component, new RegExp(`data-theme-choice="${preference}"`));
        assert.match(translations, new RegExp(`theme\\.switcher\\.${preference}`));
        assert.match(translations, new RegExp(`theme\\.switcher\\.selected\\.${preference}`));
    }
    assert.doesNotMatch(component, /localStorage|itoken\.theme/);
});
