import { getDashboardTableRows } from './dashboard-preferences.js';
import { billingTranslations } from './dashboard-billing-translations.js';
import {
    backTopup,
    continueTopup,
    createTopupState,
    resetTopup,
    selectTopupAmount,
    selectTopupMethod,
    topupSummary,
} from './dashboard-billing-topup.js';

function initializeBillingPage() {
const page = document.querySelector('[data-billing-app]');

if (page && page.dataset.billingInitialized !== 'true') {
    const dashboardMain = page.closest('main#dashboard-main');

    if (!dashboardMain) {
        console.error('Billing UI initialization stopped: the Billing page is not inside #dashboard-main.');
        return;
    }

    const periodSelect = page.querySelector('[data-billing-period]');
    const search = page.querySelector('[data-billing-search]');
    const typeFilter = page.querySelector('[data-billing-type]');
    const statusFilter = page.querySelector('[data-billing-status]');
    const rowsContainer = page.querySelector('[data-billing-rows]');
    const tableWrap = page.querySelector('[data-billing-table-wrap]');
    const emptyState = page.querySelector('[data-billing-empty]');
    const detailDialog = dashboardMain.querySelector('[data-billing-detail-dialog]');
    const topupDialog = dashboardMain.querySelector('[data-billing-topup-dialog]');
    const topupForm = dashboardMain.querySelector('[data-billing-topup-form]');
    const topupButton = page.querySelector('[data-billing-topup-open]');
    const topupAmount = topupForm?.querySelector('select[name="amount"]');
    const topupContinue = topupForm?.querySelector('[data-topup-continue]');
    const topupBack = topupForm?.querySelector('[data-topup-back]');

    if (!topupButton || !detailDialog || !topupDialog || !topupForm || !topupAmount || !topupContinue || !topupBack) {
        console.error('Billing UI initialization stopped: required controls or dialogs are missing inside #dashboard-main.');
        return;
    }

    page.dataset.billingInitialized = 'true';

    const now = new Date();
    const locale = () => document.documentElement.lang === 'zh-CN' ? 'zh_CN' : (billingTranslations[document.documentElement.lang] ? document.documentElement.lang : 'id');
    const localeTag = () => ({ id: 'id-ID', en: 'en-US', zh_CN: 'zh-CN' })[locale()];
    const t = (key) => billingTranslations[locale()][key] ?? billingTranslations.id[key] ?? key;
    const number = (value) => new Intl.NumberFormat(localeTag(), { maximumFractionDigits: 0 }).format(value);
    const formatCurrency = (value) => new Intl.NumberFormat(localeTag(), { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    const formatDateTime = (date) => new Intl.DateTimeFormat(localeTag(), { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    const periodDays = { '24h': 1, '7d': 7, '30d': 30 };
    const statusPattern = ['success', 'success', 'pending', 'success', 'failed', 'success', 'success', 'pending', 'success', 'failed', 'success', 'success'];
    const modelPattern = ['chat', 'reasoner', 'vision'];

    // Fictional transaction history for display only. No payment or balance mutation is performed.
    const transactions = Array.from({ length: 56 }, (_, index) => {
        const type = index % 5 === 0 ? 'topup' : 'usage';
        const model = modelPattern[(index * 2 + 1) % modelPattern.length];
        const timestamp = index < 8
            ? new Date(now.getTime() - index * 3 * 60 * 60 * 1000 - index * 11 * 60 * 1000)
            : new Date(now.getTime() - (1 + Math.floor((index - 8) / 2)) * 24 * 60 * 60 * 1000 - ((index * 7) % 24) * 60 * 60 * 1000);
        return {
            id: `txn_demo_${(0xb4100 + index * 6151).toString(16).toUpperCase()}`,
            timestamp,
            type,
            descriptionKey: type === 'topup' ? 'billing.description.topup' : `billing.description.${model}`,
            methodKey: type === 'topup' ? 'billing.method.topup' : 'billing.method.usage',
            amount: type === 'topup' ? [50000, 100000, 250000][index % 3] : 650 + ((index * 1379) % 24000),
            status: statusPattern[index % statusPattern.length],
        };
    });

    let currentPage = 1;
    let activeTransactions = [];
    let selectedTransaction = null;
    let topupState = createTopupState();

    function valueOfPeriod() {
        const cutoff = now.getTime() - periodDays[periodSelect.value] * 24 * 60 * 60 * 1000;
        return transactions.filter((transaction) => transaction.timestamp.getTime() >= cutoff && transaction.timestamp <= now);
    }

    function transactionDescription(transaction) {
        return t(transaction.descriptionKey);
    }

    function transactionAmount(transaction) {
        return `${transaction.type === 'topup' ? '+' : '−'}${formatCurrency(transaction.amount)}`;
    }

    function updateSummary(periodTransactions) {
        const totalSpend = periodTransactions.filter((transaction) => transaction.type === 'usage')
            .reduce((total, transaction) => total + transaction.amount, 0);
        page.querySelector('[data-billing-total="balance"]').textContent = formatCurrency(420000);
        page.querySelector('[data-billing-total="spend"]').textContent = formatCurrency(totalSpend);
        page.querySelector('[data-billing-total="transactions"]').textContent = number(periodTransactions.length);
        page.querySelector('[data-billing-total="credit"]').textContent = t('billing.credit.preview');
        page.querySelector('[data-billing-note="balance"]').textContent = t('billing.note.balance');
        page.querySelector('[data-billing-note="spend"]').textContent = t('billing.note.spend');
        page.querySelector('[data-billing-note="transactions"]').textContent = t('billing.note.transactions');
        page.querySelector('[data-billing-note="credit"]').textContent = t('billing.credit.note');
    }

    function filteredTransactions() {
        const query = search.value.trim().toLocaleLowerCase();
        return activeTransactions.filter((transaction) => {
            const description = transactionDescription(transaction).toLocaleLowerCase();
            return (!query || transaction.id.toLocaleLowerCase().includes(query) || description.includes(query))
                && (typeFilter.value === 'all' || typeFilter.value === transaction.type)
                && (statusFilter.value === 'all' || statusFilter.value === transaction.status);
        }).sort((first, second) => second.timestamp - first.timestamp);
    }

    function renderTable() {
        const pageSize = getDashboardTableRows();
        const filtered = filteredTransactions();
        const pageTotal = Math.max(1, Math.ceil(filtered.length / pageSize));
        currentPage = Math.min(currentPage, pageTotal);
        const firstIndex = filtered.length ? (currentPage - 1) * pageSize : 0;
        const visible = filtered.slice(firstIndex, firstIndex + pageSize);
        rowsContainer.replaceChildren();

        visible.forEach((transaction) => {
            const row = document.createElement('tr');
            row.className = 'align-middle';
            const cell = (text, classes) => {
                const node = document.createElement('td');
                node.className = classes;
                node.textContent = text;
                return node;
            };
            row.append(cell(formatDateTime(transaction.timestamp), 'whitespace-nowrap px-5 py-4 theme-text-secondary'));
            row.append(cell(transaction.id, 'whitespace-nowrap px-5 py-4 font-mono text-xs font-medium theme-text-neutral'));
            row.append(cell(transactionDescription(transaction), 'min-w-48 px-5 py-4 font-medium theme-text-label'));
            row.append(cell(t(`billing.type.${transaction.type}`), 'whitespace-nowrap px-5 py-4 theme-text-neutral'));
            row.append(cell(t(transaction.methodKey), 'whitespace-nowrap px-5 py-4 theme-text-secondary'));
            row.append(cell(transactionAmount(transaction), `whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums ${transaction.type === 'topup' ? 'theme-status-success-text' : 'theme-text-label'}`));

            const statusCell = document.createElement('td');
            statusCell.className = 'whitespace-nowrap px-5 py-4';
            const badge = document.createElement('span');
            const statusClasses = { success: 'theme-badge-success', pending: 'theme-badge-warning', failed: 'theme-badge-danger' }[transaction.status];
            badge.className = `inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses}`;
            badge.textContent = `${t(`billing.status.${transaction.status}`)} · ${t('billing.demo')}`;
            statusCell.append(badge);
            row.append(statusCell);

            const actionCell = document.createElement('td');
            actionCell.className = 'px-5 py-4 text-right';
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'min-h-9 rounded-lg px-3 text-xs font-semibold theme-link theme-interactive-surface-hover focus-visible:outline-none focus-visible:ring-4 theme-focus';
            button.textContent = t('billing.action.details');
            button.setAttribute('aria-label', `${t('billing.action.details')}: ${transaction.id}`);
            button.addEventListener('click', () => openDetail(transaction));
            actionCell.append(button);
            row.append(actionCell);
            rowsContainer.append(row);
        });

        const hasRows = filtered.length > 0;
        emptyState.classList.toggle('hidden', hasRows);
        tableWrap.classList.toggle('hidden', !hasRows);
        page.querySelector('[data-billing-pagination-summary]').textContent = hasRows
            ? t('billing.pagination.range').replace('{first}', number(firstIndex + 1)).replace('{last}', number(Math.min(firstIndex + pageSize, filtered.length))).replace('{total}', number(filtered.length))
            : t('billing.pagination.empty');
        page.querySelector('[data-billing-page-count]').textContent = t('billing.pagination.page').replace('{current}', number(currentPage)).replace('{total}', number(pageTotal));
        page.querySelector('[data-billing-previous]').disabled = currentPage <= 1 || !hasRows;
        page.querySelector('[data-billing-next]').disabled = currentPage >= pageTotal || !hasRows;
    }

    function setDetailValue(key, value) {
        detailDialog.querySelector(`[data-billing-detail="${key}"]`).textContent = value;
    }

    function openDetail(transaction) {
        selectedTransaction = transaction;
        detailDialog.querySelector('#billing-detail-heading').textContent = `${t('billing.detail.heading')} · ${transaction.id}`;
        setDetailValue('id', transaction.id);
        setDetailValue('date', formatDateTime(transaction.timestamp));
        setDetailValue('description', transactionDescription(transaction));
        setDetailValue('type', t(`billing.type.${transaction.type}`));
        setDetailValue('method', t(transaction.methodKey));
        setDetailValue('status', `${t(`billing.status.${transaction.status}`)} · ${t('billing.demo')}`);
        setDetailValue('subtotal', transactionAmount(transaction));
        setDetailValue('fee', formatCurrency(0));
        setDetailValue('total', transactionAmount(transaction));
        if (!detailDialog.open) {
            detailDialog.showModal();
            detailDialog.querySelector('[data-billing-detail-close]').focus();
        }
    }

    function updateTopupOptions() {
        [...topupAmount.options].forEach((option) => {
            option.textContent = `${formatCurrency(Number(option.value))} · ${t('billing.demo')}`;
        });
    }

    function methodTranslationKey(method) {
        return method === 'virtual-account' ? 'virtual_account' : method;
    }

    function renderTopupFlow() {
        const summary = topupSummary(topupState);
        topupAmount.value = String(summary.amount);
        topupForm.querySelectorAll('[name="paymentMethod"]').forEach((radio) => {
            radio.checked = radio.value === summary.method;
        });
        topupForm.querySelectorAll('[data-topup-stage]').forEach((stage) => {
            stage.classList.toggle('hidden', stage.dataset.topupStage !== topupState.stage);
        });
        topupContinue.disabled = !summary.method;
        topupForm.querySelector('[data-topup-summary-amount]').textContent = formatCurrency(summary.amount);
        topupForm.querySelector('[data-topup-summary-total]').textContent = formatCurrency(summary.total);
        topupForm.querySelector('[data-topup-summary-method]').textContent = summary.method
            ? t(`billing.topup.method.${methodTranslationKey(summary.method)}`)
            : t('billing.topup.method.unselected');
        topupForm.querySelectorAll('[data-topup-instruction]').forEach((panel) => {
            panel.classList.toggle('hidden', topupState.stage !== 'instructions' || panel.dataset.topupInstruction !== summary.method);
        });
        if (topupState.stage === 'instructions') {
            topupForm.querySelector('[data-topup-instruction-heading]').textContent = t('billing.topup.instructions.heading');
            topupForm.querySelector('[data-topup-instruction-summary]').textContent = t('billing.topup.instructions.summary')
                .replace('{method}', t(`billing.topup.method.${methodTranslationKey(summary.method)}`))
                .replace('{amount}', formatCurrency(summary.total));
        }
    }

    function closeTopupDialog() {
        if (topupDialog.open) topupDialog.close();
    }

    function render() {
        activeTransactions = valueOfPeriod();
        currentPage = 1;
        updateSummary(activeTransactions);
        updateTopupOptions();
        renderTopupFlow();
        renderTable();
        if (detailDialog.open && selectedTransaction) openDetail(selectedTransaction);
    }

    function resetFilters() {
        search.value = '';
        typeFilter.value = 'all';
        statusFilter.value = 'all';
        periodSelect.value = '7d';
        render();
    }

    page.querySelector('[data-billing-reset]').addEventListener('click', resetFilters);
    page.querySelector('[data-billing-empty-reset]').addEventListener('click', resetFilters);
    search.addEventListener('input', () => { currentPage = 1; renderTable(); });
    [typeFilter, statusFilter].forEach((control) => control.addEventListener('change', () => { currentPage = 1; renderTable(); }));
    periodSelect.addEventListener('change', render);
    page.querySelector('[data-billing-previous]').addEventListener('click', () => { currentPage -= 1; renderTable(); });
    page.querySelector('[data-billing-next]').addEventListener('click', () => { currentPage += 1; renderTable(); });

    topupButton.addEventListener('click', () => {
        if (topupDialog.open) return;
        topupState = createTopupState(Number(topupAmount.value));
        updateTopupOptions();
        renderTopupFlow();
        topupDialog.showModal();
        topupAmount.focus();
    });
    dashboardMain.querySelectorAll('[data-billing-topup-close]').forEach((button) => button.addEventListener('click', () => {
        closeTopupDialog();
    }));
    topupAmount.addEventListener('change', () => {
        topupState = selectTopupAmount(topupState, topupAmount.value);
        renderTopupFlow();
    });
    topupForm.querySelectorAll('[name="paymentMethod"]').forEach((radio) => radio.addEventListener('change', () => {
        topupState = selectTopupMethod(topupState, radio.value);
        renderTopupFlow();
    }));
    topupContinue.addEventListener('click', () => {
        const nextState = continueTopup(topupState);
        if (nextState === topupState) return;
        topupState = nextState;
        renderTopupFlow();
        topupForm.querySelector('[data-topup-instruction-heading]').focus();
    });
    topupBack.addEventListener('click', () => {
        topupState = backTopup(topupState);
        renderTopupFlow();
        topupForm.querySelector(`[name="paymentMethod"][value="${topupState.method}"]`)?.focus();
    });
    topupForm.addEventListener('submit', (event) => event.preventDefault());
    topupDialog.addEventListener('close', () => {
        topupState = resetTopup();
        topupForm.reset();
        renderTopupFlow();
    });

    dashboardMain.querySelectorAll('[data-billing-detail-close]').forEach((button) => button.addEventListener('click', () => {
        if (detailDialog.open) detailDialog.close();
    }));
    [detailDialog, topupDialog].forEach((modal) => modal.addEventListener('click', (event) => {
        if (event.target === modal && modal.open) modal.close();
    }));
    window.addEventListener('itoken:locale-change', () => {
        render();
    });
    render();
}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBillingPage, { once: true });
} else {
    initializeBillingPage();
}
