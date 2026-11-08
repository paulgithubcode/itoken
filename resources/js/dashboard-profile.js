import { dashboardTranslations } from './dashboard-translations.js';

export const demoProfileEmail = 'user@example.test';

export const demoProfileDefaults = Object.freeze({
    displayName: 'Contoh Pengguna',
    fullName: 'Pengguna Demo',
    whatsappCountryCode: '+62',
    whatsappLocal: '',
    photo: '',
});

export const demoProfileKeys = Object.freeze({
    displayName: 'itoken.dashboard.profile.display-name',
    fullName: 'itoken.dashboard.profile.full-name',
    whatsappCountryCode: 'itoken.dashboard.profile.whatsapp-country-code',
    whatsappLocal: 'itoken.dashboard.profile.whatsapp-local',
    whatsappLegacy: 'itoken.dashboard.profile.whatsapp',
    photo: 'itoken.dashboard.profile.photo',
});

export const whatsappCountries = Object.freeze([
    { code: '+62', flag: '🇮🇩', nameKey: 'profile.country.indonesia', min: 8, max: 12, example: '81234567890' },
    { code: '+60', flag: '🇲🇾', nameKey: 'profile.country.malaysia', min: 7, max: 10, example: '123456789' },
    { code: '+65', flag: '🇸🇬', nameKey: 'profile.country.singapore', min: 8, max: 8, example: '81234567' },
    { code: '+66', flag: '🇹🇭', nameKey: 'profile.country.thailand', min: 8, max: 9, example: '812345678' },
    { code: '+63', flag: '🇵🇭', nameKey: 'profile.country.philippines', min: 10, max: 10, example: '9123456789' },
    { code: '+84', flag: '🇻🇳', nameKey: 'profile.country.vietnam', min: 9, max: 10, example: '912345678' },
    { code: '+86', flag: '🇨🇳', nameKey: 'profile.country.china', min: 11, max: 11, example: '13800138000' },
    { code: '+81', flag: '🇯🇵', nameKey: 'profile.country.japan', min: 10, max: 10, example: '9012345678' },
    { code: '+82', flag: '🇰🇷', nameKey: 'profile.country.south_korea', min: 9, max: 10, example: '1012345678' },
    { code: '+61', flag: '🇦🇺', nameKey: 'profile.country.australia', min: 9, max: 9, example: '412345678' },
    { code: '+44', flag: '🇬🇧', nameKey: 'profile.country.united_kingdom', min: 10, max: 10, example: '7400123456' },
    { code: '+1', flag: '🇺🇸', nameKey: 'profile.country.united_states', min: 10, max: 10, example: '2025550123' },
    { code: '+91', flag: '🇮🇳', nameKey: 'profile.country.india', min: 10, max: 10, example: '9876543210' },
]);

const countryByCode = new Map(whatsappCountries.map((country) => [country.code, country]));

const maxPhotoDataLength = 2_100_000;
const allowedPhotoTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function getStorage(storage) {
    try {
        return storage ?? globalThis.localStorage;
    } catch {
        return null;
    }
}

function safePhoto(value) {
    return typeof value === 'string'
        && value.length <= maxPhotoDataLength
        && /^data:image\/(png|jpeg|webp|gif);base64,[a-z\d+/]+=*$/i.test(value)
        ? value
        : '';
}

export function normalizeLocalWhatsappNumber(countryCode, value) {
    const country = countryByCode.get(countryCode) ?? whatsappCountries[0];
    let digits = String(value ?? '').replace(/\D/g, '');

    if (country.code === '+62' && digits.startsWith('0')) digits = digits.slice(1);
    const callingDigits = country.code.slice(1);
    const numberAfterCode = digits.slice(callingDigits.length);
    const includesCountryPrefix = digits.startsWith(callingDigits)
        && numberAfterCode.length >= country.min
        && numberAfterCode.length <= country.max
        && (digits.length > country.max || country.code === '+62');
    if (includesCountryPrefix) digits = numberAfterCode;

    return digits;
}

export function formatWhatsappExample(countryCode, localNumber = '') {
    const country = countryByCode.get(countryCode) ?? whatsappCountries[0];
    const local = normalizeLocalWhatsappNumber(country.code, localNumber) || country.example;
    return `${country.code} ${local}`;
}

function parseLegacyWhatsapp(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return { whatsappCountryCode: '+62', whatsappLocal: '' };

    if (raw.startsWith('+')) {
        const country = [...whatsappCountries].sort((a, b) => b.code.length - a.code.length).find((item) => raw.startsWith(item.code));
        if (country) return { whatsappCountryCode: country.code, whatsappLocal: normalizeLocalWhatsappNumber(country.code, raw.slice(country.code.length)) };
    }

    return { whatsappCountryCode: '+62', whatsappLocal: normalizeLocalWhatsappNumber('+62', raw) };
}

export function validateDemoProfile(profile) {
    const errors = {};
    const displayName = String(profile.displayName ?? '').trim();
    const fullName = String(profile.fullName ?? '').trim();
    const country = countryByCode.get(profile.whatsappCountryCode ?? '+62');
    const rawLocal = String(profile.whatsappLocal ?? '').trim();
    const local = normalizeLocalWhatsappNumber(country?.code ?? '', rawLocal);

    if (!displayName) errors.displayName = 'required';
    else if (displayName.length > 80) errors.displayName = 'too_long';
    if (!fullName) errors.fullName = 'required';
    else if (fullName.length > 100) errors.fullName = 'too_long';
    if (!country) errors.whatsappCountryCode = 'invalid_country';
    else if (rawLocal && !/^[\d\s().-]+$/.test(rawLocal)) errors.whatsapp = 'invalid_format';
    else if (!rawLocal && profile.whatsappCountryTouched) errors.whatsapp = 'country_required';
    else if (local && (local.length < country.min || local.length > country.max)) errors.whatsapp = 'invalid_length';

    return errors;
}

export function readDemoProfile(storage) {
    const source = getStorage(storage);
    const profile = { ...demoProfileDefaults };
    if (!source) return profile;

    let storedCountryCode = null;
    let storedWhatsappLocal = null;
    let legacyWhatsapp = null;
    for (const key of ['displayName', 'fullName', 'photo']) {
        try {
            const value = source.getItem(demoProfileKeys[key]);
            if (value === null) continue;
            if (key === 'photo') profile.photo = safePhoto(value);
            else profile[key] = value;
        } catch {
            return { ...demoProfileDefaults };
        }
    }

    try {
        storedCountryCode = source.getItem(demoProfileKeys.whatsappCountryCode);
        storedWhatsappLocal = source.getItem(demoProfileKeys.whatsappLocal);
        legacyWhatsapp = source.getItem(demoProfileKeys.whatsappLegacy);
    } catch {
        return { ...demoProfileDefaults };
    }

    if (storedCountryCode !== null || storedWhatsappLocal !== null) {
        profile.whatsappCountryCode = countryByCode.has(storedCountryCode) ? storedCountryCode : '+62';
        profile.whatsappLocal = normalizeLocalWhatsappNumber(profile.whatsappCountryCode, storedWhatsappLocal ?? '');
    } else {
        Object.assign(profile, parseLegacyWhatsapp(legacyWhatsapp));
    }

    return profile;
}

export function saveDemoProfile(profile, storage) {
    const errors = validateDemoProfile(profile);
    if (Object.keys(errors).length) return { ok: false, errors };

    const source = getStorage(storage);
    if (!source) return { ok: false, errors: {}, storageUnavailable: true };

    const whatsappCountryCode = profile.whatsappCountryCode ?? '+62';
    const values = {
        displayName: String(profile.displayName).trim(),
        fullName: String(profile.fullName).trim(),
        whatsappCountryCode,
        whatsappLocal: normalizeLocalWhatsappNumber(whatsappCountryCode, profile.whatsappLocal),
        photo: safePhoto(profile.photo ?? ''),
    };

    try {
        for (const key of ['displayName', 'fullName', 'whatsappCountryCode', 'whatsappLocal', 'photo']) {
            const value = values[key];
            if (value) source.setItem(demoProfileKeys[key], value);
            else source.removeItem(demoProfileKeys[key]);
        }
        source.removeItem(demoProfileKeys.whatsappLegacy);
        return { ok: true, errors: {}, profile: values };
    } catch {
        return { ok: false, errors: {}, storageUnavailable: true };
    }
}

export function resetDemoProfile(storage) {
    const source = getStorage(storage);
    if (!source) return false;

    try {
        for (const key of Object.values(demoProfileKeys)) source.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

export function initializeDemoProfile(root, { storage } = {}) {
    if (!root || root.dataset.profileInitialized === 'true') return;

    const view = root.querySelector('[data-profile-view]');
    const form = root.querySelector('[data-profile-form]');
    const editButton = root.querySelector('[data-profile-edit]');
    const resetButton = root.querySelector('[data-profile-reset]');
    const cancelButton = root.querySelector('[data-profile-cancel]');
    const photoInput = root.querySelector('[data-profile-photo-input]');
    const photoRemove = root.querySelector('[data-profile-photo-remove]');
    const status = root.querySelector('[data-profile-status]');
    const localeNames = { id: 'id', en: 'en', 'zh-CN': 'zh_CN' };
    const locale = () => localeNames[document.documentElement.lang] ?? 'id';
    const messages = dashboardTranslations;
    const message = (key) => messages[locale()]?.[key] ?? messages.id?.[key] ?? key;

    if (!view || !form || !editButton || !resetButton || !cancelButton || !photoInput || !photoRemove) return;

    root.dataset.profileInitialized = 'true';
    const inputs = {
        displayName: form.querySelector('[name="displayName"]'),
        fullName: form.querySelector('[name="fullName"]'),
        whatsappCountryCode: form.querySelector('[name="whatsappCountryCode"]'),
        whatsappLocal: form.querySelector('[name="whatsappLocal"]'),
        photo: form.querySelector('[name="photo"]'),
    };
    let profile = readDemoProfile(storage);
    let statusKey = '';
    let whatsappCountryTouched = false;

    function renderCountryOptions(selectedCode = inputs.whatsappCountryCode.value) {
        inputs.whatsappCountryCode.replaceChildren();
        whatsappCountries.forEach((country) => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = `${country.flag} ${message(country.nameKey)} (${country.code})`;
            inputs.whatsappCountryCode.append(option);
        });
        inputs.whatsappCountryCode.value = countryByCode.has(selectedCode) ? selectedCode : '+62';
    }

    function updateWhatsappExample() {
        const example = root.querySelector('[data-profile-whatsapp-example]');
        if (example) example.textContent = message('profile.whatsapp.example').replace('{number}', formatWhatsappExample(inputs.whatsappCountryCode.value, inputs.whatsappLocal.value));
    }

    function renderPhoto() {
        root.querySelectorAll('[data-profile-photo-preview]').forEach((image) => {
            if (profile.photo) image.src = profile.photo;
            else image.removeAttribute('src');
            image.classList.toggle('hidden', !profile.photo);
        });
        root.querySelectorAll('[data-profile-photo-fallback]').forEach((fallback) => fallback.classList.toggle('hidden', Boolean(profile.photo)));
    }

    function renderProfile() {
        root.querySelector('[data-profile-display-name]').textContent = profile.displayName;
        root.querySelector('[data-profile-full-name]').textContent = profile.fullName;
        root.querySelector('[data-profile-whatsapp]').textContent = profile.whatsappLocal
            ? `${profile.whatsappCountryCode} ${profile.whatsappLocal}`
            : message('profile.not_set');
        renderPhoto();
    }

    function setStatus(key) {
        statusKey = key;
        if (status) status.textContent = key ? message(key) : '';
    }

    function openForm() {
        inputs.displayName.value = profile.displayName;
        inputs.fullName.value = profile.fullName;
        inputs.whatsappCountryCode.value = profile.whatsappCountryCode;
        inputs.whatsappLocal.value = profile.whatsappLocal;
        whatsappCountryTouched = false;
        inputs.photo.value = profile.photo;
        updateWhatsappExample();
        form.querySelectorAll('[data-profile-error]').forEach((node) => { node.textContent = ''; });
        [inputs.displayName, inputs.fullName, inputs.whatsappCountryCode, inputs.whatsappLocal].forEach((input) => input.removeAttribute('aria-invalid'));
        view.classList.add('hidden');
        form.classList.remove('hidden');
        setStatus('');
        inputs.displayName.focus();
    }

    function closeForm() {
        form.classList.add('hidden');
        view.classList.remove('hidden');
        renderPhoto();
        editButton.focus();
    }

    function showErrors(errors) {
        const fields = [
            ['displayName', inputs.displayName],
            ['fullName', inputs.fullName],
            ['whatsapp', inputs.whatsappLocal],
            ['whatsappCountryCode', inputs.whatsappCountryCode],
        ];
        fields.forEach(([field, input]) => {
            const error = form.querySelector(`[data-profile-error="${field}"]`);
            const errorName = errors[field];
            const key = errorName ? `profile.validation.${errorName}` : '';
            let errorText = key ? message(key) : '';
            if (field === 'whatsapp' && errorName === 'invalid_length') {
                const country = countryByCode.get(inputs.whatsappCountryCode.value) ?? whatsappCountries[0];
                const range = country.min === country.max ? String(country.min) : `${country.min}–${country.max}`;
                errorText = errorText.replace('{range}', range);
            }
            if (error) error.textContent = errorText;
            if (key) input.setAttribute('aria-invalid', 'true');
            else input.removeAttribute('aria-invalid');
        });
    }

    renderCountryOptions(profile.whatsappCountryCode);
    updateWhatsappExample();
    renderProfile();
    editButton.addEventListener('click', openForm);
    cancelButton.addEventListener('click', closeForm);
    inputs.whatsappCountryCode.addEventListener('change', () => {
        whatsappCountryTouched = true;
        updateWhatsappExample();
    });
    inputs.whatsappLocal.addEventListener('input', updateWhatsappExample);
    photoRemove.addEventListener('click', () => {
        inputs.photo.value = '';
        photoInput.value = '';
        root.querySelectorAll('[data-profile-photo-preview]').forEach((image) => image.classList.add('hidden'));
        root.querySelectorAll('[data-profile-photo-fallback]').forEach((fallback) => fallback.classList.remove('hidden'));
        setStatus('');
    });
    photoInput.addEventListener('change', () => {
        const file = photoInput.files?.[0];
        if (!file) return;
        if (!allowedPhotoTypes.includes(file.type)) {
            photoInput.value = '';
            setStatus('profile.photo.invalid_type');
            return;
        }
        if (file.size > 1_500_000) {
            photoInput.value = '';
            setStatus('profile.photo.too_large');
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            inputs.photo.value = safePhoto(reader.result) || '';
            if (inputs.photo.value) {
                root.querySelectorAll('[data-profile-photo-preview]').forEach((image) => {
                    image.src = inputs.photo.value;
                    image.classList.remove('hidden');
                });
                root.querySelectorAll('[data-profile-photo-fallback]').forEach((fallback) => fallback.classList.add('hidden'));
            }
            setStatus(inputs.photo.value ? '' : 'profile.photo.invalid_type');
        });
        reader.addEventListener('error', () => setStatus('profile.photo.read_failed'));
        reader.readAsDataURL(file);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const result = saveDemoProfile({
            displayName: inputs.displayName.value,
            fullName: inputs.fullName.value,
            whatsappCountryCode: inputs.whatsappCountryCode.value,
            whatsappLocal: inputs.whatsappLocal.value,
            whatsappCountryTouched,
            photo: inputs.photo.value,
        }, storage);
        showErrors(result.errors);
        if (!result.ok) {
            setStatus(result.storageUnavailable ? 'profile.storage_unavailable' : '');
            const firstInvalid = Object.keys(result.errors)[0];
            const invalidInput = firstInvalid === 'whatsapp' ? inputs.whatsappLocal : inputs[firstInvalid];
            (invalidInput ?? inputs.displayName).focus();
            return;
        }

        profile = result.profile;
        renderProfile();
        closeForm();
        setStatus('profile.saved');
    });

    resetButton.addEventListener('click', () => {
        if (!window.confirm(message('profile.reset_confirm'))) return;
        const reset = resetDemoProfile(storage);
        profile = { ...demoProfileDefaults };
        renderProfile();
        closeForm();
        setStatus(reset ? 'profile.reset_done' : 'profile.storage_unavailable');
    });

    window.addEventListener('itoken:locale-change', () => {
        if (statusKey && status) status.textContent = message(statusKey);
        renderCountryOptions(inputs.whatsappCountryCode.value);
        updateWhatsappExample();
        renderProfile();
    });
}
