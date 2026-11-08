import { dashboardTranslations } from './dashboard-translations.js';
import { readDashboardPreferences, saveDashboardPreference } from './dashboard-preferences.js';
import { initializeDemoProfile } from './dashboard-profile.js';
import { initializeDashboardDrawer } from './dashboard-drawer.js';

const activeLocale = document.querySelector('[data-settings-active-locale]');
const localeNames = { id: 'Bahasa Indonesia', en: 'English', zh_CN: '简体中文' };

function syncSettingsLocale(event) {
    if (!activeLocale) return;
    const locale = event?.detail?.locale ?? document.documentElement.lang.replace('-', '_');
    activeLocale.textContent = localeNames[locale] ?? localeNames.id;
}

syncSettingsLocale();
window.addEventListener('itoken:locale-change', syncSettingsLocale);

const settingsPage = document.querySelector('[data-settings-page]');
if (settingsPage) {
    initializeDemoProfile(settingsPage.querySelector('[data-settings-profile]'));
    const preferenceControls = [...settingsPage.querySelectorAll('[data-settings-preference]')];
    const resetButton = settingsPage.querySelector('[data-settings-reset]');
    const status = settingsPage.querySelector('[data-settings-status]');
    const currentLocale = () => document.documentElement.lang === 'zh-CN' ? 'zh_CN' : (dashboardTranslations[document.documentElement.lang] ? document.documentElement.lang : 'id');
    const message = (key) => dashboardTranslations[currentLocale()][key] ?? dashboardTranslations.id[key];

    function applyPreference(name, value, { persist = false } = {}) {
        if (name === 'theme') {
            const stored = window.iTokenTheme.setPreference(value);
            const control = preferenceControls.find((item) => item.dataset.settingsPreference === name);
            if (control) control.value = window.iTokenTheme.getPreference();
            if (persist && !stored && status) status.textContent = message('settings.preferences.storage_unavailable');
            return;
        }

        const attribute = { density: 'dashboardDensity', tableRows: 'dashboardTableRows' }[name];
        if (!attribute) return;
        document.documentElement.dataset[attribute] = String(value);
        const control = preferenceControls.find((item) => item.dataset.settingsPreference === name);
        if (control) control.value = String(value);
        if (persist && !saveDashboardPreference(name, value)) status.textContent = message('settings.preferences.storage_unavailable');
    }

    const preferences = readDashboardPreferences();
    Object.entries(preferences).forEach(([name, value]) => applyPreference(name, value));
    applyPreference('theme', window.iTokenTheme.getPreference());

    preferenceControls.forEach((control) => {
        control.addEventListener('change', () => {
            const { settingsPreference: name } = control.dataset;
            const value = name === 'tableRows' ? Number(control.value) : control.value;
            if (status) status.textContent = '';
            applyPreference(name, value, { persist: true });
        });
    });

    resetButton?.addEventListener('click', () => {
        if (!window.confirm(message('settings.preferences.reset_confirm'))) return;

        const stored = window.iTokenTheme.resetPreference();
        applyPreference('theme', window.iTokenTheme.getPreference());
        if (status) status.textContent = stored ? message('settings.preferences.reset_done') : message('settings.preferences.storage_unavailable');
    });
}

initializeDashboardDrawer();
