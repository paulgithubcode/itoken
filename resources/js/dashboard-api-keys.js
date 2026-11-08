import { apiKeysTranslations } from './dashboard-api-keys-translations.js';

const page = document.querySelector('[data-api-keys-app]');

if (page) {
    const dictionaries = apiKeysTranslations;
    const rows = document.querySelector('[data-key-rows]');
    const emptyState = document.querySelector('[data-key-empty]');
    const search = document.querySelector('[data-key-search]');
    const statusFilter = document.querySelector('[data-key-filter]');
    const createForm = document.querySelector('[data-key-create-form]');
    const nameError = document.querySelector('[data-key-name-error]');
    const toast = document.querySelector('[data-key-toast]');
    const dialogs = Object.fromEntries([...document.querySelectorAll('[data-key-dialog]')].map((dialog) => [dialog.dataset.keyDialog, dialog]));
    const locale = () => document.documentElement.lang === 'zh-CN' ? 'zh_CN' : (dictionaries[document.documentElement.lang] ? document.documentElement.lang : 'id');
    const t = (key) => dictionaries[locale()][key] ?? dictionaries.id[key] ?? key;

    // These prefixes are deliberately unusable sample strings. No credential or secret is generated.
    const keys = [
        { id: 1, name: 'CLI integration', environment: 'production', prefix: 'it_demo_••••_A12F', created: '2026-10-28', lastUsed: '2026-11-05', status: 'active' },
        { id: 2, name: 'Local development', environment: 'development', prefix: 'it_demo_••••_B08C', created: '2026-10-17', lastUsed: null, status: 'active' },
        { id: 3, name: 'Retired staging', environment: 'development', prefix: 'it_demo_••••_C91D', created: '2026-09-30', lastUsed: '2026-10-02', status: 'revoked' },
    ];
    let nextId = 4;
    let selectedKey = null;
    let toastTimer;

    const element = (tag, className, text = '') => {
        const node = document.createElement(tag);
        node.className = className;
        node.textContent = text;
        return node;
    };
    const formatDate = (date) => new Intl.DateTimeFormat({ id: 'id-ID', en: 'en-US', zh_CN: 'zh-CN' }[locale()], { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));

    function updateSummary() {
        const activeCount = keys.filter((key) => key.status === 'active').length;
        document.querySelector('[data-key-count="total"]').textContent = keys.length;
        document.querySelector('[data-key-count="active"]').textContent = activeCount;
        document.querySelector('[data-key-count="revoked"]').textContent = keys.length - activeCount;
    }

    function renderRows() {
        const query = search.value.trim().toLocaleLowerCase();
        const filteredKeys = keys.filter((key) => key.name.toLocaleLowerCase().includes(query)
            && (statusFilter.value === 'all' || key.status === statusFilter.value));
        rows.replaceChildren();

        filteredKeys.forEach((key) => {
            const row = document.createElement('tr');
            row.className = 'align-middle';
            const nameCell = element('td', 'px-5 py-4');
            nameCell.append(element('p', 'font-semibold theme-text-primary', key.name));
            nameCell.append(element('p', 'mt-1 text-xs theme-text-muted', t(key.environment === 'production' ? 'keys.environment.production' : 'keys.environment.development')));
            row.append(nameCell);
            row.append(element('td', 'px-5 py-4 font-mono text-xs theme-text-secondary', key.prefix));
            row.append(element('td', 'whitespace-nowrap px-5 py-4 theme-text-secondary', formatDate(key.created)));
            row.append(element('td', 'whitespace-nowrap px-5 py-4 theme-text-secondary', key.lastUsed ? formatDate(key.lastUsed) : t('keys.never')));

            const statusCell = element('td', 'px-5 py-4');
            statusCell.append(element('span', `inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${key.status === 'active' ? 'theme-badge-success' : 'theme-badge-neutral'}`, t(`keys.status.${key.status}`)));
            row.append(statusCell);

            const actions = element('td', 'px-5 py-4 text-right');
            const actionGroup = element('div', 'inline-flex items-center gap-2');
            const detailButton = element('button', 'rounded-lg px-2.5 py-2 text-xs font-semibold theme-link theme-interactive-surface-hover focus-visible:outline-none focus-visible:ring-4 theme-focus', t('keys.action.details'));
            detailButton.type = 'button';
            detailButton.addEventListener('click', () => openDetails(key));
            actionGroup.append(detailButton);
            if (key.status === 'active') {
                const revokeButton = element('button', 'rounded-lg px-2.5 py-2 text-xs font-semibold theme-field-error-text theme-danger-hover focus-visible:outline-none focus-visible:ring-4 theme-focus', t('keys.action.revoke'));
                revokeButton.type = 'button';
                revokeButton.addEventListener('click', () => openRevoke(key));
                actionGroup.append(revokeButton);
            }
            actions.append(actionGroup);
            row.append(actions);
            rows.append(row);
        });

        emptyState.classList.toggle('hidden', filteredKeys.length > 0);
        document.querySelector('[data-key-table-wrap]').classList.toggle('hidden', filteredKeys.length === 0);
        updateSummary();
    }

    function openDetails(key) {
        selectedKey = key;
        document.querySelector('[data-detail-name]').textContent = key.name;
        document.querySelector('[data-detail-prefix]').textContent = key.prefix;
        document.querySelector('[data-detail-environment]').textContent = t(`keys.environment.${key.environment}`);
        document.querySelector('[data-detail-created]').textContent = formatDate(key.created);
        document.querySelector('[data-detail-last-used]').textContent = key.lastUsed ? formatDate(key.lastUsed) : t('keys.never');
        document.querySelector('[data-detail-status]').textContent = t(`keys.status.${key.status}`);
        dialogs.detail.showModal();
    }

    function openRevoke(key) {
        selectedKey = key;
        document.querySelector('[data-revoke-name]').textContent = key.name;
        dialogs.revoke.showModal();
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 3200);
    }

    document.querySelectorAll('[data-open-create]').forEach((button) => button.addEventListener('click', () => {
        createForm.reset();
        nameError.classList.add('hidden');
        dialogs.create.showModal();
        createForm.elements.name.focus();
    }));
    document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
    Object.values(dialogs).forEach((dialog) => dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    }));
    search.addEventListener('input', renderRows);
    statusFilter.addEventListener('change', renderRows);

    createForm.elements.name.addEventListener('input', () => {
        const value = createForm.elements.name.value.trim();
        createForm.elements.name.setCustomValidity(value.length < 2 ? t('keys.name.error') : '');
        nameError.classList.toggle('hidden', value.length >= 2 || value.length === 0);
    });
    createForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = createForm.elements.name.value.trim();
        if (name.length < 2 || name.length > 40) {
            createForm.elements.name.setCustomValidity(t('keys.name.error'));
            nameError.classList.remove('hidden');
            createForm.elements.name.reportValidity();
            return;
        }
        const environment = createForm.elements.environment.value;
        keys.unshift({ id: nextId, name, environment, prefix: `it_demo_••••_${String(nextId).padStart(4, '0')}`, created: new Date().toISOString().slice(0, 10), lastUsed: null, status: 'active' });
        nextId += 1;
        dialogs.create.close();
        renderRows();
        showToast(t('keys.toast.created'));
    });

    document.querySelector('[data-confirm-revoke]').addEventListener('click', () => {
        if (!selectedKey) return;
        selectedKey.status = 'revoked';
        selectedKey = null;
        dialogs.revoke.close();
        renderRows();
        showToast(t('keys.toast.revoked'));
    });
    window.addEventListener('itoken:locale-change', renderRows);
    renderRows();
}
