import test from 'node:test';
import assert from 'node:assert/strict';
import {
    dashboardPreferenceDefaults,
    dashboardPreferenceKeys,
    getDashboardTableRows,
    readDashboardPreferences,
    resetDashboardPreferences,
    saveDashboardPreference,
} from '../../resources/js/dashboard-preferences.js';

function createStorage(initial = {}) {
    const values = new Map(Object.entries(initial));

    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
        values,
    };
}

test('preferences use defaults and namespace keys to iToken Dashboard', () => {
    const storage = createStorage();

    assert.deepEqual(readDashboardPreferences(storage), dashboardPreferenceDefaults);
    assert.equal(getDashboardTableRows(storage), 25);
    assert.ok(Object.values(dashboardPreferenceKeys).every((key) => key.startsWith('itoken.dashboard.')));
    assert.equal('theme' in dashboardPreferenceDefaults, false);
});

test('valid preference changes persist and table row values are numeric', () => {
    const storage = createStorage();

    assert.equal(saveDashboardPreference('density', 'compact', storage), true);
    assert.equal(saveDashboardPreference('tableRows', 50, storage), true);
    assert.deepEqual(readDashboardPreferences(storage), { density: 'compact', tableRows: 50 });
    assert.equal(getDashboardTableRows(storage), 50);
});

test('invalid stored and requested preference values fall back safely', () => {
    const storage = createStorage({
        [dashboardPreferenceKeys.density]: 'spacious',
        [dashboardPreferenceKeys.tableRows]: '12',
    });

    assert.deepEqual(readDashboardPreferences(storage), dashboardPreferenceDefaults);
    assert.equal(saveDashboardPreference('theme', 'dark', storage), false);
    assert.equal(saveDashboardPreference('tableRows', 12, storage), false);
});

test('reset removes stored preferences so defaults apply immediately', () => {
    const storage = createStorage();
    saveDashboardPreference('density', 'compact', storage);
    saveDashboardPreference('tableRows', 10, storage);

    assert.equal(resetDashboardPreferences(storage), true);
    assert.deepEqual(readDashboardPreferences(storage), dashboardPreferenceDefaults);
});

test('unavailable storage does not throw and leaves defaults usable', () => {
    const blockedStorage = {
        getItem() { throw new Error('blocked'); },
        setItem() { throw new Error('blocked'); },
        removeItem() { throw new Error('blocked'); },
    };

    assert.deepEqual(readDashboardPreferences(blockedStorage), dashboardPreferenceDefaults);
    assert.equal(saveDashboardPreference('theme', 'dark', blockedStorage), false);
    assert.equal(resetDashboardPreferences(blockedStorage), false);
});
