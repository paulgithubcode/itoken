import { dashboardTranslations } from './dashboard-translations.js';

const initializedSidebars = new WeakSet();

export function initializeDashboardDrawer(documentRef = document, windowRef = window) {
    const sidebar = documentRef.querySelector('#dashboard-sidebar');
    const backdrop = documentRef.querySelector('#dashboard-backdrop');
    const toggle = documentRef.querySelector('#dashboard-menu-toggle');
    const closeButton = documentRef.querySelector('#dashboard-menu-close');
    const content = documentRef.querySelector('#dashboard-content');

    if (!sidebar || !backdrop || !toggle || !closeButton || !content || initializedSidebars.has(sidebar)) return null;
    initializedSidebars.add(sidebar);

    const mobileViewport = windowRef.matchMedia('(max-width: 1023px)');
    let isOpen = false;
    let scrollState = null;

    const currentLocale = () => {
        const locale = documentRef.documentElement.lang.replace('-', '_');
        return dashboardTranslations[locale] ? locale : 'id';
    };

    const syncToggleLabel = (expanded = isOpen) => {
        const key = expanded ? 'dashboard.nav.close' : 'dashboard.nav.open';
        const dictionary = dashboardTranslations[currentLocale()];
        toggle.setAttribute('aria-label', dictionary[key] ?? dashboardTranslations.id[key]);
    };

    const focusableElements = () => [...sidebar.querySelectorAll('a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => {
            if (element.disabled || element.hidden) return false;
            for (let ancestor = element; ancestor && ancestor !== sidebar; ancestor = ancestor.parentElement) {
                if (ancestor.inert || ancestor.hidden) return false;
            }
            return true;
        });

    const focusInside = (last = false) => {
        const elements = focusableElements();
        (last ? elements.at(-1) : closeButton ?? elements[0])?.focus();
    };

    const lockScroll = () => {
        if (scrollState) return;
        scrollState = {
            hadOverflowClass: documentRef.body.classList.contains('overflow-hidden'),
            inlineOverflow: documentRef.body.style.overflow,
        };
        documentRef.body.classList.add('overflow-hidden');
        documentRef.body.style.overflow = 'hidden';
    };

    const restoreScroll = () => {
        if (!scrollState) return;
        if (scrollState.hadOverflowClass) documentRef.body.classList.add('overflow-hidden');
        else documentRef.body.classList.remove('overflow-hidden');
        documentRef.body.style.overflow = scrollState.inlineOverflow;
        scrollState = null;
    };

    const closeNavigation = ({ restoreFocus = true } = {}) => {
        const wasOpen = isOpen;
        isOpen = false;
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        sidebar.removeAttribute('role');
        sidebar.removeAttribute('aria-modal');
        content.inert = false;

        if (restoreFocus && wasOpen) toggle.focus();
        else if (wasOpen && sidebar.contains(documentRef.activeElement)) documentRef.activeElement.blur();

        sidebar.inert = mobileViewport.matches;
        restoreScroll();
        syncToggleLabel(false);
    };

    const openNavigation = () => {
        if (!mobileViewport.matches || isOpen) return;
        isOpen = true;
        sidebar.inert = false;
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        syncToggleLabel(true);
        sidebar.setAttribute('role', 'dialog');
        sidebar.setAttribute('aria-modal', 'true');
        content.inert = true;
        lockScroll();
        focusInside();
    };

    sidebar.inert = mobileViewport.matches;
    content.inert = false;
    syncToggleLabel(false);

    toggle.addEventListener('click', () => {
        if (isOpen) closeNavigation();
        else openNavigation();
    });
    closeButton.addEventListener('click', () => closeNavigation());
    backdrop.addEventListener('click', () => closeNavigation());

    sidebar.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', () => {
        if (mobileViewport.matches) closeNavigation({ restoreFocus: false });
    }));

    documentRef.addEventListener('keydown', (event) => {
        if (!isOpen) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeNavigation();
            return;
        }
        if (event.key !== 'Tab') return;

        const elements = focusableElements();
        const first = elements[0];
        const last = elements.at(-1);
        if (!first) {
            event.preventDefault();
            sidebar.focus();
        } else if (!sidebar.contains(documentRef.activeElement)) {
            event.preventDefault();
            focusInside(event.shiftKey);
        } else if (event.shiftKey && documentRef.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && documentRef.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    documentRef.addEventListener('focusin', (event) => {
        if (isOpen && !sidebar.contains(event.target)) focusInside();
    });

    const handleViewportChange = () => {
        if (mobileViewport.matches) {
            if (!isOpen) sidebar.inert = true;
            return;
        }
        if (isOpen) closeNavigation({ restoreFocus: false });
        sidebar.inert = false;
    };

    if (typeof mobileViewport.addEventListener === 'function') mobileViewport.addEventListener('change', handleViewportChange);
    else mobileViewport.addListener?.(handleViewportChange);

    windowRef.addEventListener('itoken:locale-change', () => syncToggleLabel());

    return { close: closeNavigation, open: openNavigation, get isOpen() { return isOpen; } };
}
