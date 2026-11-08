const copy = {
    id: {
        offline: 'Anda sedang offline. Data akun dan fitur server tidak tersedia.',
        online: 'Koneksi kembali tersedia.',
        installPrompt: 'Pasang iToken untuk akses yang lebih mudah.', install: 'Pasang', dismiss: 'Tutup', installed: 'iToken sudah terpasang.',
        updateAvailable: 'Versi baru iToken tersedia.', update: 'Perbarui', updateConfirm: 'Ada perubahan yang belum disimpan. Tetap perbarui dan muat ulang aplikasi?',
    },
    en: {
        offline: 'You are offline. Account data and server features are unavailable.',
        online: 'Your connection is back.',
        installPrompt: 'Install iToken for easier access.', install: 'Install', dismiss: 'Dismiss', installed: 'iToken is installed.',
        updateAvailable: 'A new version of iToken is available.', update: 'Update', updateConfirm: 'There are unsaved changes. Update and reload the app anyway?',
    },
    zh_CN: {
        offline: '当前处于离线状态，账户数据和服务器功能不可用。',
        online: '网络连接已恢复。',
        installPrompt: '安装 iToken，方便快速访问。', install: '安装', dismiss: '关闭', installed: 'iToken 已安装。',
        updateAvailable: 'iToken 有新版本可用。', update: '更新', updateConfirm: '有尚未保存的更改。仍要更新并重新加载应用吗？',
    },
};

const locale = () => {
    const lang = document.documentElement.lang.replace('-', '_');
    return copy[lang] ? lang : 'id';
};
const installCard = document.querySelector('#pwa-install');
const installButton = document.querySelector('#pwa-install-action');
const installDismiss = document.querySelector('#pwa-install-dismiss');
const updateCard = document.querySelector('#pwa-update');
const updateButton = document.querySelector('#pwa-update-action');
const connectivityNotice = document.querySelector('#pwa-connectivity');
let deferredPrompt = null;
let waitingWorker = null;
let registration = null;
let hasUnsavedChanges = false;
let reloadAfterUpdate = false;
let isOnline = navigator.onLine;
let connectivityTimer = null;

function syncPwaCopy() {
    const strings = copy[locale()];
    const connectivityText = connectivityNotice?.querySelector('[data-i18n="pwa.offline"]');
    if (connectivityText) connectivityText.textContent = isOnline ? strings.online : strings.offline;
    const installText = installCard?.querySelector('[data-i18n="pwa.install.prompt"]');
    if (installText) installText.textContent = strings.installPrompt;
    if (installButton) installButton.textContent = strings.install;
    installDismiss?.setAttribute('aria-label', strings.dismiss);
    const updateText = updateCard?.querySelector('[data-i18n="pwa.update.available"]');
    if (updateText) updateText.textContent = strings.updateAvailable;
    if (updateButton) updateButton.textContent = strings.update;
}

function setConnectivity(online) {
    if (!connectivityNotice) return;
    isOnline = online;
    const connectivityText = connectivityNotice.querySelector('[data-i18n="pwa.offline"]');
    if (connectivityText) connectivityText.textContent = online ? copy[locale()].online : copy[locale()].offline;

    if (connectivityTimer !== null) {
        window.clearTimeout(connectivityTimer);
        connectivityTimer = null;
    }

    connectivityNotice.classList.remove('hidden');
    if (online) {
        connectivityTimer = window.setTimeout(() => {
            if (isOnline) connectivityNotice.classList.add('hidden');
            connectivityTimer = null;
        }, 2600);
    }
}

function showWaitingWorker(worker) {
    if (!worker || !updateCard) return;
    waitingWorker = worker;
    updateCard.classList.remove('hidden');
    updateCard.classList.add('flex');
}

function installableDisplayMode() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

window.addEventListener('online', () => setConnectivity(true));
window.addEventListener('offline', () => setConnectivity(false));
window.addEventListener('itoken:locale-change', syncPwaCopy);
syncPwaCopy();
if (!isOnline) connectivityNotice?.classList.remove('hidden');

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('itoken-install-dismissed') === '1'; } catch {}
    if (installableDisplayMode() || !installCard || dismissed) return;
    deferredPrompt = event;
    installCard.classList.remove('hidden');
});

installButton?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installCard?.classList.add('hidden');
});
installDismiss?.addEventListener('click', () => {
    installCard?.classList.add('hidden');
    try { sessionStorage.setItem('itoken-install-dismissed', '1'); } catch {}
});
window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installCard?.classList.add('hidden');
});

document.addEventListener('input', (event) => {
    if (event.target.matches('input, textarea, select') && event.target.form) hasUnsavedChanges = true;
});
document.addEventListener('submit', (event) => {
    if (event.target instanceof HTMLFormElement) hasUnsavedChanges = false;
}, true);

updateButton?.addEventListener('click', () => {
    if (!waitingWorker) return;
    if (hasUnsavedChanges && !window.confirm(copy[locale()].updateConfirm)) return;
    reloadAfterUpdate = true;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
});
navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (reloadAfterUpdate) window.location.reload();
});

if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', async () => {
        try {
            const workerUrl = document.querySelector('meta[name="itoken-service-worker"]')?.content ?? '/service-worker.js';
            registration = await navigator.serviceWorker.register(workerUrl, { scope: '/' });
            if (registration.waiting) showWaitingWorker(registration.waiting);
            registration.addEventListener('updatefound', () => {
                const installing = registration.installing;
                installing?.addEventListener('statechange', () => {
                    if (installing.state === 'installed' && navigator.serviceWorker.controller) showWaitingWorker(installing);
                });
            });
            if (navigator.onLine) registration.update().catch(() => {});
            window.setInterval(() => {
                if (document.visibilityState === 'visible' && navigator.onLine) registration.update().catch(() => {});
            }, 60 * 60 * 1000);
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && navigator.onLine) registration.update().catch(() => {});
            });
        } catch {
            // PWA enhancement is optional; the website remains usable without a worker.
        }
    }, { once: true });
}
