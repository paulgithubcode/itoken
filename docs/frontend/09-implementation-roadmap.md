# 09 — Implementation Roadmap

Roadmap ini membedakan keberadaan UI, interaksi lokal, integrasi operasional, dan verifikasi. Jangan menandai fitur bisnis selesai hanya karena halaman atau kontrolnya tersedia.

## 1. Status implementasi dan pengujian

Gunakan istilah implementasi berikut secara konsisten:

- **Completed — UI:** tampilan dan interaksi frontend tersedia.
- **Completed — Local:** perilaku berjalan lokal di browser, termasuk localStorage, tanpa layanan bisnis.
- **Completed — Integrated:** terhubung ke backend/provider dan integrasinya telah diverifikasi.
- **Demo:** data atau proses simulasi, bukan data operasional.
- **Partial:** sebagian spesifikasi tersedia.
- **Pending:** belum diimplementasikan.
- **Not Verified:** belum diuji dengan metode yang sesuai.

Status pengujian dicatat terpisah dari status implementasi. Hasil test/build harus menyebut command, environment, hasil, dan waktu pemeriksaan. Browser acceptance tidak tersirat dari build atau unit test.

## 2. Ringkasan status aktual

| Stage | Cakupan | Status implementasi | Status pengujian |
|---|---|---|---|
| 0 — Dokumentasi dan arsitektur | Stack, batas data, standar demo | Konsolidasi dokumentasi telah dilakukan; status implementasi aplikasi tidak dinilai oleh deliverable dokumentasi ini | Final review/penerimaan dokumentasi **Pending**; test/build tidak dijalankan dalam sinkronisasi ini (**Not Verified**) |
| 1 — Public Website | Home, Models, Pricing, Docs, FAQ, About, Contact, legal, Status | **Completed — UI** untuk halaman yang tersedia; pricing/model tetap **Demo**; target anchor `#how-it-works` tersedia | Pemeriksaan visual yang terkonfirmasi: homepage pada desktop, tablet, dan mobile. Halaman publik lain tidak dinyatakan telah diuji manual di catatan ini. Navigasi langsung ke `#how-it-works` telah diverifikasi; rincian browser/perangkat/viewport tidak dicatat. Keyboard Theme Switcher, screen reader, dan aksesibilitas **Not Verified** |
| 2 — Dashboard Foundation | Shell, drawer, Overview | **Completed — UI**; konten bisnis **Demo** dan route tidak terproteksi | Pengguna mengonfirmasi pemeriksaan visual halaman internal yang tercakup dalam tinjauan sebelumnya; daftar route dan viewport tidak dicatat. Automated JS tests drawer lulus; perilaku browser/keyboard dan screen reader **Not Verified** |
| 3 — Auth UI | Login, register, forgot/reset instruction, POST logout placeholder | **Completed — UI** untuk halaman; auth/session/logout operasional **Pending** | Pengguna mengonfirmasi pemeriksaan visual Login, Register, dan Forgot Password. Password Reset Instructions, Clerk/security, flow operasional, dan accessibility **Not Verified** |
| 4 — Wallet/Billing | Billing, transaction table/detail, simulasi top-up | **Completed — UI**, proses **Demo**; wallet/payment integration **Pending** | Unit/UI test sebelumnya tersedia; payment/browser **Not Verified** |
| 5 — API Keys/Models | API Keys UI; public model browser | API Keys **Demo**; dashboard Models **Partial** placeholder; server key/catalog integration **Pending** | Perilaku browser/integration **Not Verified** |
| 6 — Usage/Logs | Summary, charts, filter, table, detail | **Completed — UI**, data **Demo** | Perilaku browser/accessibility **Not Verified** |
| 7 — Account/Developer experience | Settings, profil demo, public docs, dashboard placeholder | Preferensi/profil **Completed — Local**; dashboard docs/security operasional **Partial/Pending** | JS test untuk preferences/profile tersedia; browser **Not Verified** |
| 8 — PWA | Manifest, SW, install/offline/update UI | **Completed — UI**; runtime browser **Not Verified** | Static checks pernah dicatat; browser/device **Not Verified** |
| 9 — Integrasi | Clerk dan Backend API end-to-end | **Pending**; kontrak belum tersedia | Belum dapat diverifikasi |

SEO teknis frontend kini memiliki metadata per halaman, canonical produksi, sitemap terpilih, robots.txt, noindex untuk halaman demo/auth/dashboard/error, dan JSON-LD dasar. Verifikasi domain produksi dan indexing masih Pending; rincian implementasi dan roadmap SEO/SEM ada di `11-seo-sem.md`.

## 3. Public Website

- **Cakupan:** halaman publik dan route tercatat pada `04-public-website.md`.
- **Implementasi:** Blade pages, navigasi, locale; model dan harga contoh berlabel DEMO; metode bayar homepage hanya informasional.
- **Kekurangan:** responsive/visual manual yang terkonfirmasi hanya mencakup homepage desktop, tablet, dan mobile. Halaman publik lain belum dinyatakan lulus pemeriksaan visual manual. Accessibility khusus belum diverifikasi; docs/legal/status memuat placeholder dan auth entry belum menjadi flow operasional.
- **Status:** halaman **Completed — UI** atau **Partial** sesuai route matrix; data komersial **Demo**.
- **Pengujian:** homepage telah dikonfirmasi diperiksa visual pada desktop, tablet, dan mobile; pengguna juga mengonfirmasi pemeriksaan visual Login, Register, Forgot Password, serta halaman internal yang tercakup dalam tinjauan sebelumnya. Inventaris route internal dan viewport, browser, serta perangkat tidak dicatat. Navigasi langsung ke `#how-it-works` telah diverifikasi. Theme Switcher keyboard, sinkronisasi tema melalui pemeriksaan manual, dan screen reader **Not Verified**; automated tests Theme Switcher dicatat terpisah.

## 4. Dashboard Foundation dan fitur

- **Cakupan navigasi:** Overview, API Keys, Usage, Logs, Billing, Settings. Route Wallet, Transactions, Models, Developer Docs masih placeholder.
- **Overview:** empat kartu ringkasan DEMO (saldo kredit ilustratif, permintaan API, token digunakan, API Keys aktif), grafik batang statis 14 hari, tiga aktivitas contoh, empty state API Keys, dan shortcut Logs/Billing. Tidak menampilkan bonus/masa berlaku, transaksi terbaru, atau shortcut lain yang tidak tersedia di implementasi saat ini.
- **Overview/API Keys/Usage/Logs/Billing:** tersedia sebagai UI; data dan aksi bisnis **Demo**. Tidak ada Backend API, payment gateway, secret/key aktif, atau mutasi saldo.
- **Settings/profile:** theme, density, rows, reset, profil contoh dan foto disimpan lokal. Status **Completed — Local**, tidak mewakili akun server.
- **Keamanan:** route Dashboard belum memakai auth middleware; wajib dikerjakan sebelum data privat ditampilkan.
- **Status:** UI foundation **Completed — UI**, fitur bisnis masih **Demo/Pending integration**.
- **Pengujian:** `DashboardFoundationTest.php` dan tes JS yang tercantum dalam repo dapat menguji render/perilaku lokal. Browser acceptance **Not Verified** di sini.
- **Drawer accessibility:** implementasi memakai `inert` untuk status drawer/area luar, tombol close, focus management, scroll lock yang dipulihkan, Escape/backdrop, dan resize desktop. `node tests/js/dashboard-drawer.test.js` lulus; browser manual dan screen reader **Not Verified**.

## 5. Authentication

- **UI:** halaman `/login`, `/register`, `/forgot-password`, `/password-reset/instructions` tersedia sebagai **Completed — UI**.
- **Operasional:** submit auth, Clerk verification, OAuth, email verification/reset, Laravel session, protected routes dan logout **Pending**.
- **Keputusan prasyarat:** Clerk SDK/hosted flow, server verification/session contract, cookie/CSRF policy, identity mapping, OAuth providers. Tentukan juga status Laravel scaffold model/migration users sebelum integrasi.
- **Acceptance integrasi:** Laravel memverifikasi identitas di server; dashboard terlindungi; tidak ada credential di browser storage/cache; logout mengakhiri session; error tidak membocorkan keberadaan akun.
- **Pengujian:** AuthPagesTest dan tes localization tidak membuktikan integrasi Clerk. Security/browser tests **Not Verified**.

## 6. Billing dan business features

- **Billing UI:** ringkasan, riwayat, pencarian/filter/pagination, detail, alur Top Up dengan QRIS/Bank/E-Wallet/VA ilustratif tersedia sebagai **Demo**.
- **Wallet/payment:** saldo tidak berubah; tidak ada rekening, VA atau QR yang dapat dipakai; payment gateway/API tidak ada.
- **API Keys, Usage, Logs, Models:** lihat `07-product-features.md`; data/action tetap demo atau placeholder.
- **Integrasi berikutnya:** menunggu Backend API, payment contract, secret lifecycle, model/usage schema, authorization dan error contracts.
- **Status:** seluruh business data/action belum **Completed — Integrated**.

## 7. Settings dan Developer Experience

- Preferensi tema global (Light, Dark, System) dikelola melalui `window.iTokenTheme` dan disimpan di localStorage dengan key utama `itoken.theme`; System mengikuti preferensi warna OS. Public Header menyediakan switcher desktop/mobile dan Dashboard Settings tetap menyediakan pengaturan tema. `itoken.dashboard.theme` hanya legacy key yang dibaca untuk migrasi ke key utama.
- Preferensi density dan page size disimpan di localStorage dalam namespace `itoken.dashboard.*`.
- Profil demo disimpan di `itoken.dashboard.profile.*`; nama/foto/nomor dapat berupa data pengguna lokal. Email demo read-only. Jangan masukkan data pribadi nyata ke demo.
- Public docs dan dashboard Developer Docs memiliki konten placeholder; API/SDK contract belum disahkan.
- **Status:** kontrol lokal **Completed — Local**; server account settings dan developer API docs **Pending**.

## 8. PWA

- **Kode:** manifest, icons, service worker, precache selektif hashed assets, offline fallback lokal, install/update/connectivity UI tersedia.
- **Cache policy:** navigation HTML network-only dengan fallback; hanya offline fallback dan hashed static assets allowlisted disimpan.
- **Status implementasi kode:** **Completed — UI**; status ini tidak membuktikan runtime browser.
- **Status runtime browser:** **Not Verified** untuk install, offline, update, dan lifecycle.
- **Status pengujian:** inspeksi/static worker checks dan build pernah dicatat pada checklist sebelumnya. Browser/device install, offline navigation, multi-tab update, precache failure dan recovery **Not Verified** pada audit dokumentasi ini.
- **Deployment:** HTTPS produksi dan root scope perlu diverifikasi terhadap deployment aktual.

## 9. Next steps yang direkomendasikan

1. Sebelum data akun nyata: selesaikan Clerk server verification/session, protected Dashboard, identity mapping dan keputusan scaffold users.
2. Sahkan kontrak Backend API/payment sebelum mengganti simulasi billing, key management, catalog, usage/logs atau wallet.
3. Verifikasi accessibility Public Website dan lengkapi placeholder public/docs sesuai spesifikasi produk yang disetujui; cakupan responsive manual yang telah dikonfirmasi terbatas pada homepage desktop, tablet, dan mobile.
4. Jalankan browser responsive/accessibility/PWA verification dan catat hasil terpisah dari status implementasi.
5. Tambahkan tes perilaku untuk API Keys, Usage, Logs, drawer, dan PWA; package.json saat ini hanya menyediakan `build`/`dev`, tanpa script test JavaScript.

## 10. Open decisions

- Clerk SDK/hosted mode, server verification, session/cookie/logout, OAuth dan identity mapping.
- Apakah scaffold users/password-reset/session Laravel dipertahankan atau diabaikan saat Clerk menjadi IdP.
- Backend API contract untuk account, wallet, billing, payment, API keys, models, usage dan logs.
- Source status publik, final pricing/credit validity/terms/privacy.
- Locale server persistence, deployment origin/scope/security headers dan browser support matrix PWA.
