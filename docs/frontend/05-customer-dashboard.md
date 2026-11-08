# 05 — Customer Dashboard

## 1. Tujuan dan prioritas

Dashboard operasional kelak menjadi area pengguna setelah Clerk identity diverifikasi server-side, secure Laravel application session tersedia, dan akses business account disetujui Backend API. Fondasi saat ini sengaja berupa **DEMO yang tidak terautentikasi**; route `/dashboard` bukan bukti login dan tidak memanggil layanan bisnis.

Setelah Public Website, tahap dashboard dimulai dari **Dashboard Foundation**: shared layout, sidebar, topbar, responsive navigation, dan Overview. Overview saat ini adalah ringkasan UI DEMO; data akun operasional dan source/update time belum tersedia.

## 2. Layout

### Desktop

- Sidebar berisi Overview, API Keys, Usage, Logs, Billing, Settings.
- Topbar berisi tombol drawer/menu responsive, judul section, selector locale, badge DEMO, dan menu profil demonstrasi.
- Konten memakai card, filter, tabel, pagination, chart ringan, dan dialog sesuai halaman.

### Tablet/mobile

- Sidebar menjadi drawer atau navigation sheet.
- Topbar mempertahankan page title dan tombol menu berlabel/accessible.
- Summary cards menyesuaikan satu atau dua kolom.
- Tabel memakai horizontal scroll terkendali atau responsive row cards.
- Dialog tetap di viewport; target sentuh nyaman; focus dikembalikan setelah drawer/modal ditutup.

## 3. Halaman dan status aktual

| Section | Implementasi aktual | Status fungsi |
|---|---|---|
| Overview | Ringkasan, grafik/aktivitas statis | **Demo** |
| API Keys | Search/filter, create/detail/revoke terhadap data fiktif dalam memori; tidak membuat secret | **Demo** |
| Usage | Filter periode mengubah ringkasan/chart SVG; tabel search/filter/pagination lokal | **Demo** |
| Logs | Filter, pencarian, pagination, detail teredaksi dari dataset lokal | **Demo** |
| Billing | Ringkasan/riwayat/detail/top-up bertahap dan metode bayar ilustratif | **Demo**; tidak memproses transaksi atau mengubah saldo |
| Settings | Tema global/density/table rows dan reset disimpan lokal; profil contoh dapat diedit lokal | **Completed — Local** untuk preferensi/profil demo, bukan data server |
| Wallet, Transactions, Models, Developer Docs | Route ada tetapi section berupa placeholder | **Partial** |

Semua section dirender melalui `resources/views/dashboard/index.blade.php` pada route `/dashboard/{section?}`. Route saat ini tidak membutuhkan auth dan tidak mengambil data dari Backend API.

## 4. Overview

Overview saat ini menampilkan komponen berikut sebagai data DEMO statis:

- Empat kartu ringkasan: saldo kredit ilustratif, jumlah permintaan API, token digunakan, dan jumlah API Keys aktif.
- Grafik batang statis untuk contoh permintaan API selama 14 hari, dengan label DEMO dan deskripsi teks.
- Tiga item aktivitas contoh, bukan transaksi atau log aktual.
- Empty state API Keys yang menyatakan belum ada key dan menyediakan tautan ke halaman API Keys.
- Shortcut hanya ke Logs dan Billing.

Overview saat ini tidak menampilkan kartu bonus atau masa berlaku, ringkasan transaksi terbaru, maupun shortcut Wallet/Top Up, API Keys, Usage, Model Catalog, atau Documentation.

Angka dan aktivitas yang ada bukan data Backend API atau akun sungguhan. Saat integrasi, ganti sumber berdasarkan kontrak dan tampilkan source/update time bila disediakan. Jangan mengisi zero/null menjadi `0` menyesatkan dan jangan menampilkan prompt/completion.

## 5. Data states

Setiap widget/page yang kelak memakai data operasional perlu mendefinisikan loading, loaded, empty, error, retry, dan bila relevan stale state berdasarkan kontrak. Overview saat ini dirender dari data demo statis dan tidak memiliki loading atau error/retry state dinamis. Saat auth/session hilang, ikuti flow Clerk/Laravel yang disepakati; jangan mempertahankan snapshot bisnis dari browser cache.

UI demo memberi label DEMO pada ringkasan/konteks data sintetis. Label perlu tetap terlihat saat perubahan locale dan section. Jangan anggap transaksi, payment status, API keys, model active, atau saldo dummy sebagai akun nyata.

## 6. Integrasi dan keamanan

- Dashboard saat ini **belum diproteksi**. Sebelum menampilkan data privat, wajib menambahkan verifikasi server-side Clerk dan secure Laravel session.
- Authorization untuk business account berasal dari Backend API/kontrak yang disetujui.
- Account linking Clerk User ID ↔ Backend User ID tidak ditebak oleh UI.
- Laravel memanggil Backend API; tidak membaca database, Redis, atau LiteLLM langsung untuk business data.
- LiteLLM provider secret, Redis keys/TTL, dan internal service health tidak ditampilkan.
- PWA tidak meng-cache layout/page state privat, response, saldo, usage, transaksi, atau keys.

Rincian fitur Wallet, API keys, transactions, usage, models, account settings ada di `07-product-features.md`.

## 7. Fondasi UI dan status implementasi

Navigasi utama Dashboard adalah Overview, API Keys, Usage, Logs, Billing, dan Settings. Route Wallet, Transactions, Models, dan Developer docs tetap placeholder, bukan fitur operasional. Dashboard belum diproteksi autentikasi karena Clerk belum terintegrasi; UI menandai data demonstrasi. Response dashboard menggunakan `Cache-Control: private, no-store`.

Fondasi UI memakai Blade, Tailwind, dan Vanilla JavaScript modules. Livewire tersedia sebagai dependency tetapi belum menjadi pola interaksi utama. Overview dan halaman API Keys, Usage, Logs, Billing, Settings tersedia; business behavior masih demo/lokal sebagaimana dirinci di tabel halaman.

Sidebar menjadi drawer pada viewport di bawah breakpoint `lg`. Saat tertutup, drawer memakai `inert`; saat terbuka, konten luar drawer inert dan drawer memakai dialog modal berlabel. Drawer memiliki tombol close terjemahan, fokus awal, Tab/Shift+Tab trap, penanganan fokus keluar, penutupan melalui Escape/tombol/backdrop, focus return kecuali saat navigasi, pemulihan scroll lock, dan penutupan modal saat resize ke desktop. Reduced motion tetap meniadakan transisi drawer. Automated JS tests untuk state, ARIA, inert, keyboard, fokus, penutupan, resize, dan scroll lock lulus. Pengguna mengonfirmasi pemeriksaan visual halaman internal yang tercakup dalam tinjauan sebelumnya; daftar route dan viewport yang ditinjau tidak dicatat. Verifikasi browser untuk perilaku drawer/keyboard serta screen reader tetap **Not Verified**. User menu menyebut profil demonstrasi tanpa menyediakan sign out palsu. Seluruh navigasi/header, label, ringkasan, placeholder, dan petunjuk PWA tersedia dalam `id`, `en`, `zh_CN`.

Preferensi tema global dengan pilihan Light, Dark, dan System (mengikuti preferensi OS) dikelola melalui `window.iTokenTheme` dan disimpan pada localStorage dengan key utama `itoken.theme`. Dashboard Settings tetap menyediakan pengaturan tema; Public Header juga menyediakan theme switcher desktop dan mobile. `itoken.dashboard.theme` hanya legacy key yang dibaca untuk migrasi. Density, jumlah baris, dan profil (`itoken.dashboard.profile.*`) juga disimpan pada localStorage. Locale disimpan terpisah. Pengguna sebaiknya tidak mengisi PII nyata pada profil demo. Browser review desktop/tablet/mobile dan pemeriksaan aksesibilitas dicatat terpisah di `09-implementation-roadmap.md`; keberadaan responsive classes bukan bukti pengujian viewport berhasil.
