import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeDashboardDrawer } from '../../resources/js/dashboard-drawer.js';
import { dashboardTranslations } from '../../resources/js/dashboard-translations.js';

class FakeClassList {
    values = new Set();
    add(value) { this.values.add(value); }
    remove(value) { this.values.delete(value); }
    contains(value) { return this.values.has(value); }
}

class FakeElement {
    constructor(documentRef, parentElement = null) {
        this.documentRef = documentRef;
        this.parentElement = parentElement;
        this.attributes = new Map();
        this.classList = new FakeClassList();
        this.listeners = new Map();
        this.style = {};
        this.children = [];
        this.inert = false;
        this.hidden = false;
        this.disabled = false;
    }

    addEventListener(type, listener) {
        const listeners = this.listeners.get(type) ?? [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
    }

    dispatch(type, event = {}) {
        for (const listener of this.listeners.get(type) ?? []) listener({ target: this, preventDefault() { this.defaultPrevented = true; }, ...event });
    }

    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    removeAttribute(name) { this.attributes.delete(name); }
    contains(target) {
        for (let element = target; element; element = element.parentElement) {
            if (element === this) return true;
        }
        return false;
    }
    querySelectorAll() { return this.children; }
    focus() {
        this.documentRef.activeElement = this;
        this.documentRef.dispatch('focusin', { target: this });
    }
    blur() {
        if (this.documentRef.activeElement === this) this.documentRef.activeElement = this.documentRef.body;
    }
}

class FakeMediaQuery {
    constructor(matches) {
        this.matches = matches;
        this.listeners = [];
    }
    addEventListener(type, listener) {
        if (type === 'change') this.listeners.push(listener);
    }
    change(matches) {
        this.matches = matches;
        this.listeners.forEach((listener) => listener({ matches }));
    }
}

function createFixture({ mobile = true, overflowClass = false, overflow = '' } = {}) {
    const documentRef = {
        listeners: new Map(),
        activeElement: null,
        addEventListener(type, listener) {
            const listeners = this.listeners.get(type) ?? [];
            listeners.push(listener);
            this.listeners.set(type, listeners);
        },
        dispatch(type, event = {}) {
            for (const listener of this.listeners.get(type) ?? []) listener({ target: this, preventDefault() { this.defaultPrevented = true; }, ...event });
        },
        querySelector(selector) { return this.elements.get(selector) ?? null; },
    };
    documentRef.documentElement = { lang: 'id' };
    documentRef.body = new FakeElement(documentRef);
    if (overflowClass) documentRef.body.classList.add('overflow-hidden');
    documentRef.body.style.overflow = overflow;

    const sidebar = new FakeElement(documentRef);
    const content = new FakeElement(documentRef);
    const backdrop = new FakeElement(documentRef);
    backdrop.classList.add('hidden');
    const toggle = new FakeElement(documentRef, content);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'dashboard-sidebar');
    const closeButton = new FakeElement(documentRef, sidebar);
    const links = Array.from({ length: 3 }, () => new FakeElement(documentRef, sidebar));
    sidebar.children = [links[0], closeButton, links[1], links[2]];
    sidebar.focusable = [links[0], closeButton, links[1], links[2]];
    sidebar.querySelectorAll = (selector) => selector === 'a[href]' ? links : sidebar.focusable;
    content.children = [toggle];

    const mediaQuery = new FakeMediaQuery(mobile);
    const windowRef = {
        listeners: new Map(),
        matchMedia: () => mediaQuery,
        addEventListener(type, listener) {
            const listeners = this.listeners.get(type) ?? [];
            listeners.push(listener);
            this.listeners.set(type, listeners);
        },
        dispatch(type, event = {}) {
            for (const listener of this.listeners.get(type) ?? []) listener(event);
        },
    };

    documentRef.elements = new Map([
        ['#dashboard-sidebar', sidebar], ['#dashboard-content', content],
        ['#dashboard-backdrop', backdrop], ['#dashboard-menu-toggle', toggle],
        ['#dashboard-menu-close', closeButton],
    ]);
    documentRef.activeElement = toggle;

    return { documentRef, windowRef, mediaQuery, sidebar, content, backdrop, toggle, closeButton, links };
}

function press(documentRef, key, shiftKey = false) {
    const event = { key, shiftKey, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    for (const listener of documentRef.listeners.get('keydown') ?? []) listener(event);
    return event;
}

test('closed drawer is inert on mobile and remains available on desktop', () => {
    const mobile = createFixture();
    initializeDashboardDrawer(mobile.documentRef, mobile.windowRef);
    assert.equal(mobile.sidebar.inert, true);
    assert.equal(mobile.content.inert, false);
    assert.equal(mobile.toggle.getAttribute('aria-expanded'), 'false');

    const desktop = createFixture({ mobile: false });
    initializeDashboardDrawer(desktop.documentRef, desktop.windowRef);
    assert.equal(desktop.sidebar.inert, false);
});

test('opening synchronizes dialog ARIA, inert state, close label, focus, and scroll lock', () => {
    const fixture = createFixture({ overflow: 'auto' });
    const controller = initializeDashboardDrawer(fixture.documentRef, fixture.windowRef);
    fixture.toggle.dispatch('click');

    assert.equal(controller.isOpen, true);
    assert.equal(fixture.sidebar.inert, false);
    assert.equal(fixture.content.inert, true);
    assert.equal(fixture.sidebar.getAttribute('role'), 'dialog');
    assert.equal(fixture.sidebar.getAttribute('aria-modal'), 'true');
    assert.equal(fixture.toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(fixture.toggle.getAttribute('aria-controls'), 'dashboard-sidebar');
    assert.equal(fixture.toggle.getAttribute('aria-label'), dashboardTranslations.id['dashboard.nav.close']);
    assert.equal(fixture.documentRef.activeElement, fixture.closeButton);
    assert.equal(fixture.backdrop.classList.contains('hidden'), false);
    assert.equal(fixture.documentRef.body.style.overflow, 'hidden');
    assert.equal(fixture.documentRef.body.classList.contains('overflow-hidden'), true);
});

test('Escape, close button, and backdrop restore focus, ARIA, inert, and prior scroll state', () => {
    for (const closeBy of ['Escape', 'button', 'backdrop']) {
        const fixture = createFixture({ overflowClass: true, overflow: 'clip' });
        const controller = initializeDashboardDrawer(fixture.documentRef, fixture.windowRef);
        controller.open();

        if (closeBy === 'Escape') press(fixture.documentRef, 'Escape');
        if (closeBy === 'button') fixture.closeButton.dispatch('click');
        if (closeBy === 'backdrop') fixture.backdrop.dispatch('click');

        assert.equal(controller.isOpen, false, `${closeBy} closes the drawer`);
        assert.equal(fixture.documentRef.activeElement, fixture.toggle, `${closeBy} returns focus`);
        assert.equal(fixture.sidebar.inert, true);
        assert.equal(fixture.content.inert, false);
        assert.equal(fixture.sidebar.getAttribute('role'), null);
        assert.equal(fixture.sidebar.getAttribute('aria-modal'), null);
        assert.equal(fixture.toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(fixture.toggle.getAttribute('aria-label'), dashboardTranslations.id['dashboard.nav.open']);
        assert.equal(fixture.documentRef.body.classList.contains('overflow-hidden'), true);
        assert.equal(fixture.documentRef.body.style.overflow, 'clip');
    }
});

test('Tab and Shift+Tab wrap inside drawer and outside focus is redirected', () => {
    const fixture = createFixture();
    initializeDashboardDrawer(fixture.documentRef, fixture.windowRef).open();

    fixture.links[0].focus();
    assert.equal(press(fixture.documentRef, 'Tab', true).defaultPrevented, true);
    assert.equal(fixture.documentRef.activeElement, fixture.links[2]);

    fixture.links[2].focus();
    assert.equal(press(fixture.documentRef, 'Tab').defaultPrevented, true);
    assert.equal(fixture.documentRef.activeElement, fixture.links[0]);

    const outside = new FakeElement(fixture.documentRef);
    outside.focus();
    assert.equal(fixture.documentRef.activeElement, fixture.closeButton);
});

test('navigation closes without returning focus and desktop resize restores modal and scroll state', () => {
    const navigation = createFixture();
    initializeDashboardDrawer(navigation.documentRef, navigation.windowRef).open();
    navigation.links[1].focus();
    navigation.links[1].dispatch('click');
    assert.equal(navigation.sidebar.inert, true);
    assert.equal(navigation.content.inert, false);
    assert.notEqual(navigation.documentRef.activeElement, navigation.toggle);

    const resize = createFixture({ overflow: 'scroll' });
    const controller = initializeDashboardDrawer(resize.documentRef, resize.windowRef);
    controller.open();
    resize.mediaQuery.change(false);
    assert.equal(controller.isOpen, false);
    assert.equal(resize.sidebar.inert, false);
    assert.equal(resize.content.inert, false);
    assert.equal(resize.sidebar.getAttribute('role'), null);
    assert.equal(resize.toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(resize.documentRef.body.style.overflow, 'scroll');
    assert.equal(resize.documentRef.body.classList.contains('overflow-hidden'), false);
    assert.notEqual(resize.documentRef.activeElement, resize.toggle);
});

test('initialization does not duplicate listeners for the same drawer', () => {
    const fixture = createFixture();
    const first = initializeDashboardDrawer(fixture.documentRef, fixture.windowRef);
    const second = initializeDashboardDrawer(fixture.documentRef, fixture.windowRef);
    assert.ok(first);
    assert.equal(second, null);
    assert.equal(fixture.documentRef.listeners.get('keydown').length, 1);
    assert.equal(fixture.mediaQuery.listeners.length, 1);
});
