import { publicTranslations } from './public-translations.js';

const translations = {
    id: {
        'nav.foundation': 'Fondasi', 'nav.components': 'Komponen', 'nav.accessibility': 'Aksesibilitas',
        'nav.preview': 'Lihat preview', 'language.label': 'Pilih bahasa',
        'language.id': 'Bahasa Indonesia', 'language.en': 'English', 'language.zh': '简体中文',
        'menu.open': 'Buka menu navigasi', 'menu.close': 'Tutup menu navigasi', 'dialog.close': 'Tutup dialog',
        'footer.note': '— pratinjau fondasi antarmuka.', 'footer.demo': 'Semua contoh di halaman ini adalah data demonstrasi.',
        'hero.badge': 'Tahap 1 · Fondasi UI', 'hero.demo': 'Semua data: DEMO',
        'hero.title': 'Satu tempat untuk model AI yang kamu gunakan.',
        'hero.body': 'iToken menyatukan pengalaman menggunakan berbagai model AI dengan alur prabayar yang jelas dan antarmuka yang dibuat untuk developer.',
        'hero.primary': 'Jelajahi komponen', 'hero.secondary': 'Lihat design tokens',
        'hero.disclaimer': 'Pratinjau fondasi visual, bukan halaman produk final. Tidak ada data akun atau transaksi sungguhan.',
        'tokens.eyebrow': 'Sistem visual', 'tokens.title': 'Fondasi yang konsisten',
        'tokens.body': 'Palet ringan, aksen tunggal, tipografi yang tenang, dan jarak yang teratur membentuk dasar semua halaman.',
        'tokens.surface': 'Surface & border', 'tokens.accent': 'Aksen utama', 'tokens.type': 'Tipografi',
        'tokens.type-note': 'System sans · angka tabular', 'tokens.spacing': 'Radius & spacing',
        'navigation.eyebrow': 'Navigasi', 'navigation.title': 'Sidebar yang menyesuaikan layar',
        'navigation.body': 'Komponen navigasi samping berubah menjadi deretan tautan geser pada layar kecil.',
        'navigation.demo': 'Contoh sidebar · demo',
        'navigation.label': 'Pratinjau UI',
        'navigation.note': 'Tautan pada sidebar preview berpindah ke bagian halaman ini. Struktur navigasi produk akan mengikuti halaman yang dibuat pada tahap berikutnya.',
        'components.eyebrow': 'UI kit', 'components.title': 'Komponen inti',
        'components.body': 'Elemen dasar siap dipakai ulang dengan status, label, dan state fokus yang konsisten.',
        'components.actions': 'Tombol & status', 'components.form': 'Input & validasi',
        'components.table': 'Pola tabel responsif', 'components.table-note': 'Baris dan angka berikut sepenuhnya fiktif.',
        'field.email': 'Alamat email', 'field.hint': 'Contoh field saja; data tidak dikirim.',
        'field.workspace': 'Nama workspace', 'field.error': 'Nama ini hanya contoh pesan validasi.',
        'button.toast': 'Tampilkan toast', 'button.dialog': 'Buka dialog', 'button.disabled': 'Nonaktif',
        'status.active': 'Aktif · demo', 'status.pending': 'Menunggu · demo', 'status.error': 'Gagal · demo', 'status.inactive': 'Nonaktif · demo',
        'table.item': 'Item', 'table.type': 'Jenis', 'table.status': 'Status', 'table.value': 'Nilai demo',
        'table.sample': 'Sampel', 'table.preview': 'Pratinjau', 'table.placeholder': 'Placeholder',
        'table.caption': 'Contoh tabel komponen dengan data demonstrasi', 'alert.title': 'Demo — bukan data produk',
        'alert.body': 'Contoh saldo, transaksi, model, status, dan nilai di halaman ini hanya untuk melihat rancangan komponen. Tidak ada pembayaran atau API key aktif.',
        'access.eyebrow': 'Aksesibilitas', 'access.title': 'Nyaman digunakan semua orang',
        'access.body': 'Fokus keyboard terlihat, kontrol punya label, dan layout menyesuaikan layar kecil.',
        'access.item1': 'Navigasi mobile memakai tombol dengan status expanded.',
        'access.item2': 'Dialog mendukung tombol Escape, fokus awal, dan pengembalian fokus.',
        'access.item3': 'Badge status menggunakan teks selain warna.',
        'access.item4': 'Tabel dapat digeser horizontal pada viewport sempit.',
        'dialog.badge': 'Simulasi UI', 'dialog.title': 'Dialog demonstrasi',
        'dialog.body': 'Dialog ini menunjukkan pola konfirmasi. Tidak ada transaksi, perubahan akun, atau permintaan backend yang dilakukan.',
        'dialog.cancel': 'Tutup', 'dialog.confirm': 'Mengerti', 'toast.message': 'Interaksi UI demo berhasil ditampilkan.',
    },
    en: {
        'nav.foundation': 'Foundation', 'nav.components': 'Components', 'nav.accessibility': 'Accessibility',
        'nav.preview': 'View preview', 'language.label': 'Choose language',
        'language.id': 'Bahasa Indonesia', 'language.en': 'English', 'language.zh': '简体中文',
        'menu.open': 'Open navigation menu', 'menu.close': 'Close navigation menu', 'dialog.close': 'Close dialog',
        'footer.note': '— interface foundation preview.', 'footer.demo': 'All examples on this page are demonstration data.',
        'hero.badge': 'Stage 1 · UI foundation', 'hero.demo': 'All data: DEMO',
        'hero.title': 'One place for the AI models you use.',
        'hero.body': 'iToken brings together a clear prepaid experience for multiple AI models in an interface built for developers.',
        'hero.primary': 'Explore components', 'hero.secondary': 'View design tokens',
        'hero.disclaimer': 'Visual foundation preview, not a final product page. No real account or transaction data is shown.',
        'tokens.eyebrow': 'Visual system', 'tokens.title': 'A consistent foundation',
        'tokens.body': 'A light palette, a single accent, calm typography, and regular spacing form the base of every page.',
        'tokens.surface': 'Surface & border', 'tokens.accent': 'Primary accent', 'tokens.type': 'Typography',
        'tokens.type-note': 'System sans · tabular figures', 'tokens.spacing': 'Radius & spacing',
        'navigation.eyebrow': 'Navigation', 'navigation.title': 'A sidebar that adapts to the screen',
        'navigation.body': 'The side navigation becomes a horizontally scrollable link row on small screens.',
        'navigation.demo': 'Sidebar example · demo',
        'navigation.label': 'UI preview',
        'navigation.note': 'Preview links jump to sections on this page. Product navigation will follow the pages built in later stages.',
        'components.eyebrow': 'UI kit', 'components.title': 'Core components',
        'components.body': 'Reusable elements with consistent labels, statuses, and focus states.',
        'components.actions': 'Buttons & statuses', 'components.form': 'Inputs & validation',
        'components.table': 'Responsive table pattern', 'components.table-note': 'The rows and values below are fictional.',
        'field.email': 'Email address', 'field.hint': 'Example field only; no data is sent.',
        'field.workspace': 'Workspace name', 'field.error': 'This is an example validation message.',
        'button.toast': 'Show toast', 'button.dialog': 'Open dialog', 'button.disabled': 'Disabled',
        'status.active': 'Active · demo', 'status.pending': 'Pending · demo', 'status.error': 'Failed · demo', 'status.inactive': 'Inactive · demo',
        'table.item': 'Item', 'table.type': 'Type', 'table.status': 'Status', 'table.value': 'Demo value',
        'table.sample': 'Sample', 'table.preview': 'Preview', 'table.placeholder': 'Placeholder',
        'table.caption': 'Example component table with demonstration data', 'alert.title': 'Demo — not product data',
        'alert.body': 'Balance, transaction, model, status, and value examples are only here to demonstrate components. No payment or active API key is shown.',
        'access.eyebrow': 'Accessibility', 'access.title': 'Comfortable for everyone',
        'access.body': 'Keyboard focus is visible, controls are labelled, and the layout adapts to small screens.',
        'access.item1': 'Mobile navigation uses a button with an expanded state.',
        'access.item2': 'The dialog supports Escape, initial focus, and focus return.',
        'access.item3': 'Status badges use text as well as color.',
        'access.item4': 'Tables can scroll horizontally in narrow viewports.',
        'dialog.badge': 'UI simulation', 'dialog.title': 'Demo dialog',
        'dialog.body': 'This dialog demonstrates a confirmation pattern. No transaction, account change, or backend request is made.',
        'dialog.cancel': 'Close', 'dialog.confirm': 'Got it', 'toast.message': 'Demo UI interaction displayed.',
    },
    zh_CN: {
        'nav.foundation': '基础', 'nav.components': '组件', 'nav.accessibility': '无障碍',
        'nav.preview': '查看预览', 'language.label': '选择语言',
        'language.id': 'Bahasa Indonesia', 'language.en': 'English', 'language.zh': '简体中文',
        'menu.open': '打开导航菜单', 'menu.close': '关闭导航菜单', 'dialog.close': '关闭对话框',
        'footer.note': '— 界面基础预览。', 'footer.demo': '本页所有示例均为演示数据。',
        'hero.badge': '阶段 1 · 界面基础', 'hero.demo': '所有数据：演示',
        'hero.title': '在一个平台使用你需要的 AI 模型。',
        'hero.body': 'iToken 以清晰的预付费体验整合多种 AI 模型，并为开发者打造简洁界面。',
        'hero.primary': '浏览组件', 'hero.secondary': '查看设计变量',
        'hero.disclaimer': '这是视觉基础预览，并非最终产品页面。此处不显示真实账户或交易数据。',
        'tokens.eyebrow': '视觉系统', 'tokens.title': '一致的界面基础',
        'tokens.body': '浅色调、单一强调色、清晰字体和规律间距构成页面基础。',
        'tokens.surface': '表面与边框', 'tokens.accent': '主强调色', 'tokens.type': '字体',
        'tokens.type-note': '系统无衬线 · 等宽数字', 'tokens.spacing': '圆角与间距',
        'navigation.eyebrow': '导航', 'navigation.title': '适配屏幕的侧边栏',
        'navigation.body': '在小屏幕上，侧边导航会变为可横向滚动的链接栏。',
        'navigation.demo': '侧边栏示例 · 演示',
        'navigation.label': '界面预览',
        'navigation.note': '预览链接会跳转到本页的对应部分。产品导航结构将在后续页面阶段确定。',
        'components.eyebrow': '界面组件', 'components.title': '核心组件',
        'components.body': '可复用的基础元素，具有一致的状态、标签和焦点样式。',
        'components.actions': '按钮与状态', 'components.form': '输入与验证',
        'components.table': '响应式表格样式', 'components.table-note': '以下行与数值均为虚构示例。',
        'field.email': '电子邮箱', 'field.hint': '仅为示例字段；不会发送数据。',
        'field.workspace': '工作区名称', 'field.error': '这是验证提示示例。',
        'button.toast': '显示提示', 'button.dialog': '打开对话框', 'button.disabled': '不可用',
        'status.active': '启用 · 演示', 'status.pending': '等待中 · 演示', 'status.error': '失败 · 演示', 'status.inactive': '未启用 · 演示',
        'table.item': '项目', 'table.type': '类型', 'table.status': '状态', 'table.value': '演示数值',
        'table.sample': '示例', 'table.preview': '预览', 'table.placeholder': '占位内容',
        'table.caption': '含演示数据的组件表格示例', 'alert.title': '演示 — 并非产品数据',
        'alert.body': '此页面中的余额、交易、模型、状态和数值仅用于展示组件。没有真实付款或可用 API 密钥。',
        'access.eyebrow': '无障碍', 'access.title': '让每个人都能轻松使用',
        'access.body': '键盘焦点清晰可见，控件带有标签，布局适配小屏幕。',
        'access.item1': '移动导航按钮会显示展开状态。',
        'access.item2': '对话框支持 Escape 键、初始焦点和焦点返回。',
        'access.item3': '状态徽章同时使用文字和颜色。',
        'access.item4': '窄屏幕上的表格可以水平滚动。',
        'dialog.badge': '界面模拟', 'dialog.title': '演示对话框',
        'dialog.body': '此对话框用于展示确认样式，不会执行交易、修改账户或发送后端请求。',
        'dialog.cancel': '关闭', 'dialog.confirm': '知道了', 'toast.message': '已显示界面演示交互。',
    },
};

Object.entries(publicTranslations).forEach(([locale, dictionary]) => {
    translations[locale] = { ...translations[locale], ...dictionary };
});

const languageSelects = [
    document.querySelector('#language-select'),
    document.querySelector('#mobile-language-select'),
].filter(Boolean);

function setLanguage(locale) {
    const dictionary = translations[locale] ?? translations.id;

    document.documentElement.lang = locale === 'zh_CN' ? 'zh-CN' : locale;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const value = dictionary[element.dataset.i18n];
        if (value) element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
        const value = dictionary[element.dataset.i18nAriaLabel];
        if (value) element.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const value = dictionary[element.dataset.i18nPlaceholder];
        if (value) element.setAttribute('placeholder', value);
    });
    const titleKey = document.querySelector('title')?.dataset.i18n;
    if (titleKey && dictionary[titleKey]) document.title = dictionary[titleKey];
    const numberLocale = { id: 'id-ID', en: 'en-US', zh_CN: 'zh-CN' }[locale] ?? 'id-ID';
    document.querySelectorAll('[data-i18n-price]').forEach((element) => {
        const amount = Number(element.dataset.i18nPrice);
        if (Number.isFinite(amount)) {
            element.textContent = new Intl.NumberFormat(numberLocale, { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
        }
    });
    languageSelects.forEach((select) => { select.value = locale; });
    try { localStorage.setItem('itoken-ui-locale', locale); } catch {}
}

let savedLocale = 'id';
try {
    const candidate = localStorage.getItem('itoken-ui-locale');
    if (candidate && translations[candidate]) savedLocale = candidate;
} catch {}
setLanguage(savedLocale);
languageSelects.forEach((select) => select.addEventListener('change', (event) => setLanguage(event.target.value)));

const menuToggle = document.querySelector('#mobile-menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    const locale = document.documentElement.lang.replace('-', '_');
    menuToggle.setAttribute('aria-label', translations[locale]?.[expanded ? 'menu.open' : 'menu.close'] ?? translations.id[expanded ? 'menu.open' : 'menu.close']);
    mobileMenu?.classList.toggle('hidden', expanded);
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuToggle?.setAttribute('aria-expanded', 'false');
    const locale = document.documentElement.lang.replace('-', '_');
    menuToggle?.setAttribute('aria-label', translations[locale]?.['menu.open'] ?? translations.id['menu.open']);
}));

const dialog = document.querySelector('#demo-dialog');
const dialogOpen = document.querySelector('#show-dialog');
let previousFocus = null;

function closeDialog() {
    if (!dialog || dialog.classList.contains('hidden')) return;
    dialog.classList.add('hidden');
    dialog.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
    previousFocus?.focus();
}

dialogOpen?.addEventListener('click', () => {
    previousFocus = document.activeElement;
    dialog?.classList.remove('hidden');
    dialog?.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    dialog?.querySelector('.dialog-close')?.focus();
});
dialog?.querySelectorAll('.dialog-close').forEach((button) => button.addEventListener('click', closeDialog));
dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDialog();
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
        mobileMenu?.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
        const locale = document.documentElement.lang.replace('-', '_');
        menuToggle.setAttribute('aria-label', translations[locale]?.['menu.open'] ?? translations.id['menu.open']);
        menuToggle.focus();
    }
    if (event.key === 'Tab' && dialog && !dialog.classList.contains('hidden')) {
        const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])')];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
});

const toast = document.querySelector('#toast');
let toastTimer;
document.querySelector('#show-toast')?.addEventListener('click', () => {
    if (!toast) return;
    toast.textContent = translations[document.documentElement.lang.replace('-', '_')]?.['toast.message']
        ?? translations.id['toast.message'];
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3200);
});

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3200);
}

document.querySelectorAll('.demo-plan-button').forEach((button) => button.addEventListener('click', () => {
    previousFocus = button;
    dialog?.classList.remove('hidden');
    dialog?.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    dialog?.querySelector('.dialog-close')?.focus();
}));

document.querySelectorAll('.copy-code').forEach((button) => button.addEventListener('click', async () => {
    const locale = document.documentElement.lang.replace('-', '_');
    const dictionary = translations[locale] ?? translations.id;
    const code = document.getElementById(button.dataset.copyTarget)?.textContent;
    if (!code) return;

    try {
        await navigator.clipboard.writeText(code);
        showToast(dictionary['toast.copied']);
    } catch {
        showToast(dictionary['toast.copy.error']);
    }
}));

const modelSearch = document.querySelector('#model-search');
const providerFilter = document.querySelector('#provider-filter');
const modelCards = [...document.querySelectorAll('[data-model-card]')];
const modelEmptyState = document.querySelector('#model-empty-state');
const visibleModelCount = document.querySelector('#model-visible-count');

function filterModels() {
    const query = modelSearch?.value.trim().toLocaleLowerCase() ?? '';
    const provider = providerFilter?.value ?? 'all';
    let visible = 0;

    modelCards.forEach((card) => {
        const matches = card.dataset.search.includes(query)
            && (provider === 'all' || card.dataset.provider === provider);
        card.classList.toggle('hidden', !matches);
        if (matches) visible += 1;
    });

    if (visibleModelCount) visibleModelCount.textContent = String(visible);
    modelEmptyState?.classList.toggle('hidden', visible > 0);
}

modelSearch?.addEventListener('input', filterModels);
providerFilter?.addEventListener('change', filterModels);
document.querySelector('#clear-model-filters')?.addEventListener('click', () => {
    if (modelSearch) modelSearch.value = '';
    if (providerFilter) providerFilter.value = 'all';
    filterModels();
    modelSearch?.focus();
});
