import { getDashboardTableRows } from './dashboard-preferences.js';
import { usageTranslations } from './dashboard-usage-translations.js';

const page = document.querySelector('[data-usage-app]');

if (page) {
    const periodSelect = page.querySelector('[data-usage-period]');
    const search = page.querySelector('[data-usage-search]');
    const modelFilter = page.querySelector('[data-usage-model]');
    const statusFilter = page.querySelector('[data-usage-status]');
    const rowsContainer = page.querySelector('[data-usage-rows]');
    const tableWrap = page.querySelector('[data-usage-table-wrap]');
    const emptyState = page.querySelector('[data-usage-empty]');
    const pagination = page.querySelector('[data-usage-pagination-summary]');
    const previousButton = page.querySelector('[data-usage-previous]');
    const nextButton = page.querySelector('[data-usage-next]');
    const pageCount = page.querySelector('[data-usage-page-count]');
    const dictionaries = usageTranslations;
    const now = new Date();
    const locale = () => document.documentElement.lang === 'zh-CN' ? 'zh_CN' : (dictionaries[document.documentElement.lang] ? document.documentElement.lang : 'id');
    const localeTag = () => ({ id: 'id-ID', en: 'en-US', zh_CN: 'zh-CN' })[locale()];
    const t = (key) => dictionaries[locale()][key] ?? dictionaries.id[key] ?? key;
    const number = (value) => new Intl.NumberFormat(localeTag(), { maximumFractionDigits: 0 }).format(value);
    const modelIds = ['chat', 'reasoner', 'vision'];
    const statusIds = ['completed', 'partial', 'failed'];
    const periodDays = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 };
    const makeRecord = (timestamp, seed) => {
        const modelIndex = seed % modelIds.length;
        const requests = 7 + ((seed * 17) % 46);
        const inputTokens = requests * (80 + ((seed * 23) % 240));
        const outputTokens = requests * (45 + ((seed * 31) % 190));
        return { timestamp, model: modelIds[modelIndex], requests, inputTokens, outputTokens, status: statusIds[(seed * 7 + 1) % statusIds.length] };
    };

    // Fictional, deterministic usage records stay in this page's memory and never leave the browser.
    const records = [];
    for (let hour = 0; hour < 24; hour += 1) {
        for (let model = 0; model < modelIds.length; model += 1) {
            records.push(makeRecord(new Date(now.getTime() - hour * 60 * 60 * 1000 - model * 9 * 60 * 1000), hour * 3 + model + 1));
        }
    }
    for (let day = 1; day < 90; day += 1) {
        for (let model = 0; model < modelIds.length; model += 1) {
            records.push(makeRecord(new Date(now.getTime() - day * 24 * 60 * 60 * 1000 - model * 2 * 60 * 60 * 1000), day * 3 + model + 73));
        }
    }

    let currentPage = 1;
    let activeRecords = [];

    const formatDateTime = (date) => new Intl.DateTimeFormat(localeTag(), { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    const formatAxisDate = (date) => periodSelect.value === '24h'
        ? new Intl.DateTimeFormat(localeTag(), { hour: '2-digit' }).format(date)
        : new Intl.DateTimeFormat(localeTag(), { month: 'short', day: 'numeric' }).format(date);
    const svgElement = (tag, attributes = {}) => {
        const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
        return node;
    };

    function periodRecords() {
        const days = periodDays[periodSelect.value];
        const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
        return records.filter((record) => record.timestamp.getTime() >= cutoff && record.timestamp <= now);
    }

    function drawChart(svg, values, ariaText) {
        svg.replaceChildren();
        svg.setAttribute('aria-label', ariaText);
        const title = svgElement('title');
        title.textContent = ariaText;
        svg.append(title);
        [38, 88, 138, 188].forEach((y) => svg.append(svgElement('line', { x1: 40, y1: y, x2: 620, y2: y, class: 'theme-chart-grid', 'stroke-width': 1, 'stroke-dasharray': '4 6' })));

        const allValues = values.flat();
        const max = Math.max(1, ...allValues);
        values.forEach((series, seriesIndex) => {
            const points = series.map((value, index) => {
                const x = series.length === 1 ? 330 : 40 + (index / (series.length - 1)) * 580;
                const y = 188 - (value / max) * 145;
                return `${x},${y}`;
            }).join(' ');
            svg.append(svgElement('polyline', { points, fill: 'none', class: `theme-chart-series-${['one', 'two', 'three'][seriesIndex]}`, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
            series.forEach((value, index) => {
                const x = series.length === 1 ? 330 : 40 + (index / (series.length - 1)) * 580;
                const y = 188 - (value / max) * 145;
                svg.append(svgElement('circle', { cx: x, cy: y, r: 3.5, class: `theme-chart-point theme-chart-series-${['one', 'two', 'three'][seriesIndex]}`, 'stroke-width': 2 }));
            });
        });
    }

    function updateCharts(selectedRecords) {
        const days = periodDays[periodSelect.value];
        const bucketCount = { '24h': 12, '7d': 7, '30d': 10, '90d': 12 }[periodSelect.value];
        const buckets = Array.from({ length: bucketCount }, () => ({ requests: 0, input: 0, output: 0 }));
        selectedRecords.forEach((record) => {
            const elapsed = now.getTime() - record.timestamp.getTime();
            const ageIndex = Math.min(bucketCount - 1, Math.floor((elapsed / (days * 24 * 60 * 60 * 1000)) * bucketCount));
            const bucketIndex = bucketCount - 1 - ageIndex;
            buckets[bucketIndex].requests += record.requests;
            buckets[bucketIndex].input += record.inputTokens;
            buckets[bucketIndex].output += record.outputTokens;
        });

        drawChart(page.querySelector('[data-usage-chart="requests"]'), [buckets.map((bucket) => bucket.requests)], t('usage.chart.requests.aria'));
        drawChart(page.querySelector('[data-usage-chart="tokens"]'), [buckets.map((bucket) => bucket.input), buckets.map((bucket) => bucket.output)], `${t('usage.chart.tokens.aria')} · ${t('usage.series.input')} / ${t('usage.series.output')}`);

        const rangeStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const rangeMiddle = new Date(now.getTime() - (days / 2) * 24 * 60 * 60 * 1000);
        page.querySelectorAll('[data-chart-start]').forEach((node) => { node.textContent = formatAxisDate(rangeStart); });
        page.querySelectorAll('[data-chart-middle]').forEach((node) => { node.textContent = formatAxisDate(rangeMiddle); });
        page.querySelectorAll('[data-chart-end]').forEach((node) => { node.textContent = t('usage.chart.now'); });
    }

    function updateSummary(selectedRecords) {
        const summary = selectedRecords.reduce((totals, record) => ({
            requests: totals.requests + record.requests,
            input: totals.input + record.inputTokens,
            output: totals.output + record.outputTokens,
        }), { requests: 0, input: 0, output: 0 });
        summary.tokens = summary.input + summary.output;
        Object.entries(summary).forEach(([key, value]) => {
            page.querySelector(`[data-usage-total="${key}"]`).textContent = number(value);
        });
    }

    function updateTable() {
        const pageSize = getDashboardTableRows();
        const query = search.value.trim().toLocaleLowerCase();
        const filtered = activeRecords.filter((record) => {
            const modelName = t(`usage.model.${record.model}`).toLocaleLowerCase();
            return (modelFilter.value === 'all' || modelFilter.value === record.model)
                && (statusFilter.value === 'all' || statusFilter.value === record.status)
                && (!query || modelName.includes(query));
        }).sort((first, second) => second.timestamp - first.timestamp);
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
            row.append(cell(t(`usage.model.${record.model}`), 'whitespace-nowrap px-5 py-4 font-semibold theme-text-primary'));
            row.append(cell(number(record.requests), 'px-5 py-4 text-right tabular-nums theme-text-neutral'));
            row.append(cell(number(record.inputTokens), 'px-5 py-4 text-right tabular-nums theme-text-neutral'));
            row.append(cell(number(record.outputTokens), 'px-5 py-4 text-right tabular-nums theme-text-neutral'));
            row.append(cell(number(record.inputTokens + record.outputTokens), 'px-5 py-4 text-right font-semibold tabular-nums theme-text-primary'));
            const statusCell = document.createElement('td');
            statusCell.className = 'whitespace-nowrap px-5 py-4';
            const badge = document.createElement('span');
            badge.className = `inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${record.status === 'completed' ? 'theme-badge-success' : record.status === 'partial' ? 'theme-badge-warning' : 'theme-badge-neutral'}`;
            badge.textContent = `${t('usage.demo')} · ${t(`usage.status.${record.status}`)}`;
            statusCell.append(badge);
            row.append(statusCell);
            rowsContainer.append(row);
        });

        const hasRows = filtered.length > 0;
        emptyState.classList.toggle('hidden', hasRows);
        tableWrap.classList.toggle('hidden', !hasRows);
        page.querySelector('[data-usage-pagination-summary]').textContent = hasRows
            ? t('usage.pagination.range').replace('{first}', number(firstIndex + 1)).replace('{last}', number(Math.min(firstIndex + pageSize, filtered.length))).replace('{total}', number(filtered.length))
            : t('usage.pagination.empty');
        pageCount.textContent = t('usage.pagination.page').replace('{current}', number(currentPage)).replace('{total}', number(pageTotal));
        previousButton.disabled = currentPage <= 1 || !hasRows;
        nextButton.disabled = currentPage >= pageTotal || !hasRows;
    }

    function render() {
        activeRecords = periodRecords();
        currentPage = 1;
        updateSummary(activeRecords);
        updateCharts(activeRecords);
        updateTable();
    }

    periodSelect.addEventListener('change', render);
    search.addEventListener('input', () => { currentPage = 1; updateTable(); });
    modelFilter.addEventListener('change', () => { currentPage = 1; updateTable(); });
    statusFilter.addEventListener('change', () => { currentPage = 1; updateTable(); });
    previousButton.addEventListener('click', () => { currentPage -= 1; updateTable(); });
    nextButton.addEventListener('click', () => { currentPage += 1; updateTable(); });
    window.addEventListener('itoken:locale-change', render);
    render();
}
