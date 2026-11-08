(() => {
    const preferenceKey = 'itoken.theme';
    const legacyPreferenceKey = 'itoken.dashboard.theme';
    const allowedPreferences = ['light', 'dark', 'system'];
    const root = document.documentElement;
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

    function getStorage() {
        try {
            return window.localStorage;
        } catch {
            return null;
        }
    }

    function readPreference() {
        const storage = getStorage();
        if (!storage) return 'system';

        try {
            const savedPreference = storage.getItem(preferenceKey);
            if (allowedPreferences.includes(savedPreference)) return savedPreference;
            if (savedPreference !== null) return 'system';

            const legacyPreference = storage.getItem(legacyPreferenceKey);
            if (!['light', 'dark'].includes(legacyPreference)) return 'system';

            try {
                storage.setItem(preferenceKey, legacyPreference);
            } catch {
                return legacyPreference;
            }

            try {
                storage.removeItem(legacyPreferenceKey);
            } catch {
                // The global preference is authoritative after a successful migration.
            }

            return legacyPreference;
        } catch {
            return 'system';
        }
    }

    let preference = readPreference();

    function applyPreference() {
        const theme = preference === 'system'
            ? (systemPreference.matches ? 'dark' : 'light')
            : preference;

        root.dataset.theme = theme;
        root.style.colorScheme = theme;
    }

    function setPreference(value) {
        if (!allowedPreferences.includes(value)) return false;

        preference = value;
        applyPreference();

        const storage = getStorage();
        if (!storage) return false;

        try {
            storage.setItem(preferenceKey, value);
        } catch {
            return false;
        }

        try {
            storage.removeItem(legacyPreferenceKey);
        } catch {
            // Keep rendering with the saved global preference if cleanup is unavailable.
        }

        return true;
    }

    function handleSystemPreferenceChange() {
        if (preference === 'system') applyPreference();
    }

    applyPreference();

    if (typeof systemPreference.addEventListener === 'function') {
        systemPreference.addEventListener('change', handleSystemPreferenceChange);
    } else {
        systemPreference.addListener?.(handleSystemPreferenceChange);
    }

    window.addEventListener('storage', (event) => {
        if (event.key !== preferenceKey && event.key !== null) return;
        preference = readPreference();
        applyPreference();
    });

    window.addEventListener('pageshow', (event) => {
        if (!event.persisted) return;
        preference = readPreference();
        applyPreference();
    });

    window.iTokenTheme = Object.freeze({
        getPreference: () => preference,
        setPreference,
        resetPreference: () => setPreference('system'),
    });
})();
