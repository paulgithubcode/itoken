import test from 'node:test';
import assert from 'node:assert/strict';
import {
    demoProfileDefaults,
    demoProfileEmail,
    demoProfileKeys,
    formatWhatsappExample,
    normalizeLocalWhatsappNumber,
    readDemoProfile,
    resetDemoProfile,
    saveDemoProfile,
    validateDemoProfile,
    whatsappCountries,
} from '../../resources/js/dashboard-profile.js';

function createStorage(initial = {}) {
    const values = new Map(Object.entries(initial));
    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
        values,
    };
}

test('successful submit result has a complete shape and persists profile values for rendering', () => {
    const storage = createStorage();
    const result = saveDemoProfile({
        displayName: '  Demo Editor  ',
        fullName: 'Example Profile',
        whatsappCountryCode: '+62',
        whatsappLocal: '812-3456-7890',
        photo: 'data:image/png;base64,aGVsbG8=',
    }, storage);

    assert.equal(result.ok, true);
    assert.deepEqual(result.errors, {});
    assert.equal(result.profile.displayName, 'Demo Editor');
    assert.equal(result.profile.fullName, 'Example Profile');
    assert.deepEqual(readDemoProfile(storage), {
        displayName: 'Demo Editor',
        fullName: 'Example Profile',
        whatsappCountryCode: '+62',
        whatsappLocal: '81234567890',
        photo: 'data:image/png;base64,aGVsbG8=',
    });
    assert.equal(storage.getItem(demoProfileKeys.whatsappCountryCode), '+62');
    assert.equal(storage.getItem(demoProfileKeys.whatsappLocal), '81234567890');
    assert.equal(storage.getItem(demoProfileKeys.whatsappLegacy), null);
    assert.ok(Object.values(demoProfileKeys).every((key) => key.startsWith('itoken.dashboard.profile.')));
});

test('profile validation requires names and rejects unreasonable WhatsApp values', () => {
    assert.equal(Object.keys(validateDemoProfile({ ...demoProfileDefaults, displayName: '', fullName: '' })).length, 2);
    assert.equal(validateDemoProfile({ ...demoProfileDefaults, whatsappLocal: 'not-a-phone' }).whatsapp, 'invalid_format');
    assert.deepEqual(validateDemoProfile({ ...demoProfileDefaults, whatsappLocal: '81234567890' }), {});
    assert.equal(saveDemoProfile({ ...demoProfileDefaults, displayName: ' ', fullName: 'Valid Name' }, createStorage()).ok, false);
});

test('profile reset restores sample fields without changing the read-only email', () => {
    const storage = createStorage({ accountEmail: demoProfileEmail });
    saveDemoProfile({ displayName: 'Changed', fullName: 'Changed Name', whatsappCountryCode: '+62', whatsappLocal: '081234567890' }, storage);

    assert.equal(resetDemoProfile(storage), true);
    assert.deepEqual(readDemoProfile(storage), demoProfileDefaults);
    assert.equal(demoProfileEmail, 'user@example.test');
    assert.equal(storage.getItem('accountEmail'), demoProfileEmail);
    assert.equal(Object.values(demoProfileKeys).some((key) => key.includes('email')), false);
});

test('email passed in profile data is ignored and never stored', () => {
    const storage = createStorage();
    const result = saveDemoProfile({
        displayName: 'Demo',
        fullName: 'Demo Profile',
        whatsapp: '',
        email: 'changed@example.test',
    }, storage);

    assert.equal(result.ok, true);
    assert.equal('email' in result.profile, false);
    assert.equal(readDemoProfile(storage).email, undefined);
    assert.equal(demoProfileEmail, 'user@example.test');
});

test('invalid photos and unavailable local storage fail safely', () => {
    const storage = createStorage();
    const invalidPhoto = saveDemoProfile({
        displayName: 'Demo',
        fullName: 'Demo Profile',
        whatsapp: '',
        photo: 'data:text/html;base64,PGh0bWw+',
    }, storage);
    assert.equal(invalidPhoto.ok, true);
    assert.equal(readDemoProfile(storage).photo, '');

    const blockedStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
    assert.equal(saveDemoProfile({ ...demoProfileDefaults }, blockedStorage).storageUnavailable, true);
    assert.equal(resetDemoProfile(blockedStorage), false);
});

test('country choices include all requested destinations and default to Indonesia', () => {
    assert.equal(demoProfileDefaults.whatsappCountryCode, '+62');
    assert.deepEqual(whatsappCountries.map(({ code }) => code), ['+62', '+60', '+65', '+66', '+63', '+84', '+86', '+81', '+82', '+61', '+44', '+1', '+91']);
});

test('complete number examples update using the selected country code', () => {
    assert.equal(formatWhatsappExample('+62', '81234567890'), '+62 81234567890');
    assert.equal(formatWhatsappExample('+60', '123456789'), '+60 123456789');
    assert.equal(formatWhatsappExample('+65', '81234567'), '+65 81234567');
    assert.equal(formatWhatsappExample('+65', ''), '+65 81234567');
    assert.equal(normalizeLocalWhatsappNumber('+62', '6281234567890'), '81234567890');
});

test('country and local number persist separately and reload without duplicating the prefix', () => {
    const storage = createStorage();
    const result = saveDemoProfile({
        displayName: 'Demo',
        fullName: 'Demo Profile',
        whatsappCountryCode: '+60',
        whatsappLocal: '123456789',
    }, storage);

    assert.equal(result.ok, true);
    assert.deepEqual(readDemoProfile(storage), {
        displayName: 'Demo',
        fullName: 'Demo Profile',
        whatsappCountryCode: '+60',
        whatsappLocal: '123456789',
        photo: '',
    });
    assert.equal(formatWhatsappExample(readDemoProfile(storage).whatsappCountryCode, readDemoProfile(storage).whatsappLocal), '+60 123456789');
});

test('WhatsApp validation follows country length and rejects a changed country with an empty local number', () => {
    assert.deepEqual(validateDemoProfile({ ...demoProfileDefaults, whatsappCountryCode: '+65', whatsappLocal: '81234567' }), {});
    assert.equal(validateDemoProfile({ ...demoProfileDefaults, whatsappCountryCode: '+65', whatsappLocal: '8123456' }).whatsapp, 'invalid_length');
    assert.equal(validateDemoProfile({ ...demoProfileDefaults, whatsappCountryCode: '+65', whatsappLocal: '', whatsappCountryTouched: true }).whatsapp, 'country_required');
    assert.deepEqual(validateDemoProfile({ ...demoProfileDefaults, whatsappCountryCode: '+65', whatsappLocal: '' }), {});
    assert.equal(normalizeLocalWhatsappNumber('+62', '081234567890'), '81234567890');
});

test('legacy combined WhatsApp values migrate into country and local parts once', () => {
    const storage = createStorage({ [demoProfileKeys.whatsappLegacy]: '+62 81234567890' });

    assert.equal(readDemoProfile(storage).whatsappCountryCode, '+62');
    assert.equal(readDemoProfile(storage).whatsappLocal, '81234567890');
});
