export const dashboardPreferenceDefaults = Object.freeze({
    density: 'comfortable',
    tableRows: 25,
});

export const dashboardPreferenceKeys = Object.freeze({
    density: 'itoken.dashboard.density',
    tableRows: 'itoken.dashboard.table-rows',
});

const validValues = {
    density: ['comfortable', 'compact'],
    tableRows: ['10', '25', '50'],
};

function safeStorage(storage) {
    try {
        return storage ?? globalThis.localStorage;
    } catch {
        return null;
    }
}

function validValue(name, value) {
    if (!validValues[name]?.includes(String(value))) return dashboardPreferenceDefaults[name];
    return name === 'tableRows' ? Number(value) : value;
}

export function readDashboardPreferences(storage) {
    const source = safeStorage(storage);
    const preferences = { ...dashboardPreferenceDefaults };

    if (!source) return preferences;

    for (const name of Object.keys(dashboardPreferenceKeys)) {
        try {
            const value = source.getItem(dashboardPreferenceKeys[name]);
            if (value !== null) preferences[name] = validValue(name, value);
        } catch {
            return { ...dashboardPreferenceDefaults };
        }
    }

    return preferences;
}

export function saveDashboardPreference(name, value, storage) {
    if (!dashboardPreferenceKeys[name] || validValue(name, value) !== (name === 'tableRows' ? Number(value) : value)) return false;

    const target = safeStorage(storage);
    if (!target) return false;

    try {
        target.setItem(dashboardPreferenceKeys[name], String(value));
        return true;
    } catch {
        return false;
    }
}

export function resetDashboardPreferences(storage) {
    const target = safeStorage(storage);
    if (!target) return false;

    try {
        for (const key of Object.values(dashboardPreferenceKeys)) target.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

export function getDashboardTableRows(storage) {
    return readDashboardPreferences(storage).tableRows;
}
