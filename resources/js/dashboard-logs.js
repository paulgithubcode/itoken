import { getDashboardTableRows } from './dashboard-preferences.js';
import { logsTranslations } from './dashboard-logs-translations.js';

const page = document.querySelector('[data-logs-app]');

if (page) {
    const periodSelect = page.querySelector('[data-logs-period]');
    const search = page.querySelector('[data-logs-search]');
    const statusFilter = page.querySelector('[data-logs-status]');
    const httpFilter = page.querySelector('[data-logs-http]');
    const modelFilter = page.querySelector('[data-logs-model]');
    const rowsContainer = page.querySelector('[data-logs-rows]');
    const tableWrap = page.querySelector('[data-logs-table-wrap]');
    const emptyState = page.querySelector('[data-logs-empty]');
    const dialog = document.querySelector('[data-logs-dialog]');
    const toast = document.querySelector('[data-logs-toast]');
    const now = new Date();
    const locale = () => document.documentElement.lang === 'zh-CN' ? 'zh_CN' : (logsTranslations[document.documentElement.lang] ? document.documentElement.lang : 'id');
    const localeTag = () => ({ id: 'id-ID', en: 'en-US', zh_CN: 'zh-CN' })[locale()];
    const t = (key) => logsTranslations[locale()][key] ?? logsTranslations.id[key] ?? key;
    const number = (value) => new Intl.NumberFormat(localeTag(), { maximumFractionDigits: 0 }).format(value);
    const daysByPeriod = { '24h': 1, '7d': 7, '30d': 30 };
    const models = ['chat', 'reasoner', 'vision'];
    const endpoints = ['/v1/chat/completions', '/v1/responses', '/v1/embeddings', '/v1/images/generations'];
    const keySamples = [
        { name: 'CLI sample', prefix: 'it_demo_••••_A12F' },
        { name: 'Dashboard preview', prefix: 'it_demo_••••_B08C' },
        { name: 'Local test', prefix: 'it_demo_••••_C91D' },
    ];
    const statusCodes = [200, 200, 429, 200, 400, 200, 401, 200, 500, 200, 200, 429, 200, 400, 200, 200, 500, 200, 401, 200, 200, 429, 200, 200, 400, 200, 200, 500, 200, 401, 200, 200, 429, 200, 200, 200];
    const records = Array.from({ length: 72 }, (_, index) => {
        const httpStatus = statusCodes[index % statusCodes.length];
        const timestamp = index < 12
            ? new Date(now.getTime() - index * 2 * 60 * 60 * 1000 - (index * 7) * 60 * 1000)
            : new Date(now.getTime() - (1 + Math.floor((index - 12) / 2)) * 24 * 60 * 60 * 1000 - ((index * 5) % 24) * 60 * 60 * 1000);
        return {
            requestId: `req_demo_${(0xa1200 + index * 7919).toString(16).toUpperCase()}`,
            timestamp,
            key: keySamples[index % keySamples.length],
            model: models[(index * 2 + 1) % models.length],
            endpoint: endpoints[(index * 3 + 1) % endpoints.length],
            httpStatus,
            latency: 86 + ((index * 137) % 1260),
            inputTokens: 120 + ((index * 83) % 1900),
            outputTokens: 45 + ((index * 61) % 980),
        };
    });

    let currentPage = 1;
    let activeRecords = [];
    let selectedRecord = null;
    let toastTimer;

    const formatDateTime = (date) => new Intl.DateTimeFormat(localeTag(), { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    const isSuccess = (record) => record.httpStatus >= 200 && record.httpStatus < 300;

    function updateSummary(periodRecords) {
        const successCount = periodRecords.filter(isSuccess).length;
        const averageLatency = periodRecords.length ? Math.round(periodRecords.reduce((sum, record) => sum + record.latency, 0) / periodRecords.length) : 0;
        page.querySelector('[data-logs-total="requests"]').textContent = number(periodRecords.length);
        page.querySelector('[data-logs-total="success"]').textContent = number(successCount);
        page.querySelector('[data-logs-total="errors"]').textContent = number(periodRecords.length - successCount);
        page.querySelector('[data-logs-total="latency"]').textContent = `${number(averageLatency)} ${t('logs.latency.unit')}`;
    }

    function visibleRecords() {
        const days = daysByPeriod[periodSelect.value];
        const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
        return records.filter((record) => record.timestamp.getTime() >= cutoff && record.timestamp <= now);
    }

    function filteredRecords() {
        const query = search.value.trim().toLocaleLowerCase();
        return activeRecords.filter((record) => {
            const modelName = t(`logs.model.${record.model}`).toLocaleLowerCase();
            const status = isSuccess(record) ? 'success' : 'error';
            return (!query || record.requestId.toLocaleLowerCase().includes(query) || modelName.includes(query) || record.model.includes(query))
                && (statusFilter.value === 'all' || statusFilter.value === status)
                && (httpFilter.value === 'all' || Number(httpFilter.value) === record.httpStatus)
                && (modelFilter.value === 'all' || modelFilter.value === record.model);
        }).sort((first, second) => second.timestamp - first.timestamp);
    }

    function renderTable() {
        const pageSize = getDashboardTableRows();
        const filtered = filteredRecords();
        const pageTotal = Math.max(1, Math.ceil(filtered.length / pageSize));
        currentPage = Math.min(currentPage, pageTotal);
        const firstIndex = filtered.length ? (currentPage - 1) * pageSize : 0;
        const visible = filtered.slice(firstIndex, firstIndex + pageSize);
        rowsContainer.replaceChildren();

        visible.forEach((record) => {
            const row = document.createElement('tr');
            row.className = 'align-middle';
            const cell = (text, classes) => {
                const node = document.createElement('td');
                node.className = classes;
                node.textContent = text;
                return node;
            };
            row.append(cell(formatDateTime(record.timestamp), 'whitespace-nowrap px-5 py-4 theme-text-secondary'));
            row.append(cell(record.requestId, 'whitespace-nowrap px-5 py-4 font-mono text-xs font-medium theme-text-neutral'));

            const keyCell = document.createElement('td');
            keyCell.className = 'px-5 py-4';
            const keyName = document.createElement('p');
            keyName.className = 'whitespace-nowrap text-sm font-semibold theme-text-label';
            keyName.textContent = record.key.name;
            const keyPrefix = document.createElement('p');
            keyPrefix.className = 'mt-1 whitespace-nowrap font-mono text-[11px] theme-text-muted';
            keyPrefix.textContent = record.key.prefix;
            keyCell.append(keyName, keyPrefix);
            row.append(keyCell);
            row.append(cell(t(`logs.model.${record.model}`), 'whitespace-nowrap px-5 py-4 font-medium theme-text-label'));
            row.append(cell(record.endpoint, 'whitespace-nowrap px-5 py-4 font-mono text-xs theme-text-secondary'));

            const statusCell = document.createElement('td');
            statusCell.className = 'whitespace-nowrap px-5 py-4';
            const badge = document.createElement('span');
            badge.className = `inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isSuccess(record) ? 'theme-badge-success' : 'theme-badge-danger'}`;
            badge.textContent = `${record.httpStatus} · ${t('logs.demo')} · ${t(`logs.status.${isSuccess(record) ? 'success' : 'error'}`)}`;
            statusCell.append(badge);
            row.append(statusCell);
            row.append(cell(`${number(record.latency)} ${t('logs.latency.unit')}`, 'whitespace-nowrap px-5 py-4 text-right tabular-nums theme-text-neutral'));

            const actionCell = document.createElement('td');
            actionCell.className = 'px-5 py-4 text-right';
            const detailButton = document.createElement('button');
            detailButton.type = 'button';
            detailButton.className = 'min-h-9 rounded-lg px-3 text-xs font-semibold theme-link theme-interactive-surface-hover focus-visible:outline-none focus-visible:ring-4 theme-focus';
            detailButton.textContent = t('logs.action.detail');
            detailButton.setAttribute('aria-label', `${t('logs.action.detail')}: ${record.requestId}`);
            detailButton.addEventListener('click', () => openDetail(record));
            actionCell.append(detailButton);
            row.append(actionCell);
            rowsContainer.append(row);
        });

        const hasRows = filtered.length > 0;
        emptyState.classList.toggle('hidden', hasRows);
        tableWrap.classList.toggle('hidden', !hasRows);
        page.querySelector('[data-logs-pagination-summary]').textContent = hasRows
            ? t('logs.pagination.range').replace('{first}', number(firstIndex + 1)).replace('{last}', number(Math.min(firstIndex + pageSize, filtered.length))).replace('{total}', number(filtered.length))
            : t('logs.pagination.empty');
        page.querySelector('[data-logs-page-count]').textContent = t('logs.pagination.page').replace('{current}', number(currentPage)).replace('{total}', number(pageTotal));
        page.querySelector('[data-logs-previous]').disabled = currentPage <= 1 || !hasRows;
        page.querySelector('[data-logs-next]').disabled = currentPage >= pageTotal || !hasRows;
    }

    function setDetailValue(name, value) {
        dialog.querySelector(`[data-log-detail="${name}"]`).textContent = value;
    }

    function openDetail(record) {
        selectedRecord = record;
        dialog.querySelector('#logs-detail-heading').textContent = `${t('logs.detail.heading')} · ${record.requestId}`;
        setDetailValue('requestId', record.requestId);
        setDetailValue('time', formatDateTime(record.timestamp));
        setDetailValue('model', t(`logs.model.${record.model}`));
        setDetailValue('endpoint', record.endpoint);
        setDetailValue('http', `${record.httpStatus} · ${t('logs.demo')} · ${t(`logs.status.${isSuccess(record) ? 'success' : 'error'}`)}`);
        setDetailValue('latency', `${number(record.latency)} ${t('logs.latency.unit')}`);
        setDetailValue('tokens', `${number(record.inputTokens)} ${t('logs.detail.input')} · ${number(record.outputTokens)} ${t('logs.detail.output')} · ${number(record.inputTokens + record.outputTokens)} ${t('logs.detail.total')}`);

        const errorBox = dialog.querySelector('[data-log-detail-error]');
        errorBox.classList.toggle('hidden', isSuccess(record));
        if (!isSuccess(record)) setDetailValue('error', t(`logs.error.${record.httpStatus}`));
        const redacted = t('logs.detail.redacted');
        setDetailValue('request', JSON.stringify({ model: t(`logs.model.${record.model}`), messages: redacted, credentials: redacted }, null, 2));
        setDetailValue('response', JSON.stringify({ request_id: record.requestId, http_status: record.httpStatus, output: redacted }, null, 2));
        if (!dialog.open) {
            dialog.showModal();
            dialog.querySelector('[data-logs-close]').focus();
        }
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function render() {
        activeRecords = visibleRecords();
        currentPage = 1;
        updateSummary(activeRecords);
        renderTable();
        if (dialog.open && selectedRecord) openDetail(selectedRecord);
    }

    function resetFilters() {
        search.value = '';
        statusFilter.value = 'all';
        httpFilter.value = 'all';
        modelFilter.value = 'all';
        periodSelect.value = '7d';
        render();
        showToast(t('logs.toast.reset'));
    }

    page.querySelector('[data-logs-reset]').addEventListener('click', resetFilters);
    page.querySelector('[data-logs-empty-reset]').addEventListener('click', resetFilters);
    [search].forEach((control) => control.addEventListener('input', () => { currentPage = 1; renderTable(); }));
    [statusFilter, httpFilter, modelFilter].forEach((control) => control.addEventListener('change', () => { currentPage = 1; renderTable(); }));
    periodSelect.addEventListener('change', render);
    page.querySelector('[data-logs-previous]').addEventListener('click', () => { currentPage -= 1; renderTable(); });
    page.querySelector('[data-logs-next]').addEventListener('click', () => { currentPage += 1; renderTable(); });
    dialog.querySelectorAll('[data-logs-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    window.addEventListener('itoken:locale-change', render);
    render();
}
