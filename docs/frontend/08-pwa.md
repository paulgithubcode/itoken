# 08 — Progressive Web App

PWA direncanakan sejak Stage 0. Fondasi manifest, ikon, offline fallback, service worker allowlist, install/update messaging, dan status koneksi telah ditambahkan. Target browser/device dan konfigurasi deployment produksi masih memerlukan pengujian.

## 1. Tujuan dan scope

- Aplikasi iToken dapat di-install bila browser/platform mendukung.
- Public app shell mempunyai identitas dan ikon yang konsisten.
- Aset publik statis dapat digunakan dengan kondisi koneksi terbatas.
- Offline fallback menjelaskan bahwa koneksi diperlukan untuk business/account data.
- UI memberi informasi ketika install, update, offline, dan koneksi pulih.

PWA tidak memberikan akses offline ke Dashboard, wallet, balance, API keys, transactions, usage, Clerk session, atau konten AI.

## 2. Web App Manifest

Manifest tersedia di `public/manifest.webmanifest`. Nilai implementasi saat ini:

| Field | Rencana | Status |
|---|---|---|
| `name` / `short_name` | `iToken` / `iToken` | **Completed — UI**; nilai manifest tersedia |
| `description` | Deskripsi singkat tanpa klaim availability | **Completed — UI**; copy dapat direvisi |
| `lang` / `dir` | `id-ID` / `ltr` | **Completed — UI**; page locale UI: `id`, `en`, `zh_CN` |
| `start_url` / `scope` | `/` / `/` | **Completed — UI**; root scope perlu disesuaikan bila deployment memakai subpath |
| `display` | `standalone` | **Completed — UI** |
| `theme_color` / `background_color` | `#f8fafc` | **Completed — UI**; konsisten dengan light canvas |
| `icons` | PNG 192×192 dan 512×512; SVG maskable | **Completed — UI**; installability platform **Not Verified** |

Ikon berada di `public/icons/`. Identitas ikon tersedia dalam SVG untuk favicon dan PNG bagi kebutuhan instalasi umum.

## 3. Service worker

Service worker mengelola hanya aset publik yang ditinjau dan offline fallback statis. Ia tidak memuat aturan bisnis, Clerk auth, payment, atau operasi model.

### Cache policy

1. **Hashed Vite static assets:** worker membaca `/build/manifest.json`, memfilter URL satu origin di `/build/assets/` dengan nama hashed, lalu precache aset yang tersedia. Request aset allowlisted memakai cache-first karena URL berubah ketika build berubah.
2. **Offline fallback:** `/offline.html` yang statis, dengan copy `id`, `en`, dan `zh_CN`, diprecache tanpa data bisnis.
3. **HTML navigation:** selalu request network dengan cache `no-store`; jika gagal, worker mengembalikan offline fallback. HTML public dan dashboard tidak disimpan di Cache Storage.
4. **Backend API/business request:** network-only; worker tidak meng-intercept/cache response API, payment, atau bisnis.
5. **Auth/Clerk requests dan credentials:** tidak dicache. Cookie/token/credential tidak disimpan oleh worker.

Cache Storage tidak berisi dashboard HTML, API response, profile private data, wallet/balance, payment instruction, transactions, API keys, usage, tokens/secrets, prompts/completions. Jangan gunakan strategi runtime cache generik untuk seluruh `fetch` atau navigation.

### Cache version lifecycle

- Nama cache dimiliki aplikasi dan memakai hash build Vite dari manifest pada URL worker.
- Worker versi baru mengisi cache allowlist baru; aktivasi membersihkan hanya cache versi lama yang dimiliki iToken.
- Jangan menghapus cache origin lain atau menganggap background sync diperlukan.
- Perubahan manifest build mengubah URL worker, sehingga browser dapat mendeteksi script baru; worker versi baru menunggu pengguna menekan tombol update.
- Pesan `SKIP_WAITING` memicu aktivasi setelah konfirmasi unsaved changes bila terdeteksi.
- Saat aktivasi, worker menghapus cache versi lama yang memakai prefix `itoken-public-v`, lalu mengambil kendali halaman.
- Browser review behavior multi-tab dan recovery saat precache gagal masih **Pending**.

## 4. Installability dan install prompt

- Tombol instalasi ditampilkan hanya ketika browser memberi event `beforeinstallprompt` dan app belum berada dalam mode standalone.
- Jangan memaksa prompt atau membatasi penggunaan website bila install tidak didukung.
- Prompt harus dapat ditutup dan dapat dipanggil lagi dengan perilaku yang tidak mengganggu.
- Bila prompt tidak didukung, tombol tidak ditampilkan; petunjuk manual tersedia pada footer Public Website dan Settings placeholder, termasuk Safari/iOS serta menu browser lain.
- Pilihan dismiss disimpan untuk sesi tab saja. Browser/platform-specific wording perlu verifikasi target.

## 5. Offline fallback dan connectivity

- Offline fallback menjelaskan bahwa internet diperlukan untuk login, akun, saldo, transaksi, model/service data, dan operasi bisnis.
- Jangan menyajikan data privat terakhir seolah-olah masih mutakhir.
- Form/API action yang belum berhasil dikirim tidak boleh dilabeli berhasil atau dimasukkan antrean diam-diam.
- Saat koneksi kembali, tampilkan pesan singkat. Sebut data refreshed hanya setelah Backend API request berhasil.
- Background sync/retry/draft persistence belum diputuskan; statusnya **Pending** per fitur.
- Offline fallback memilih locale tersimpan non-sensitif (`itoken-ui-locale`) dan menyediakan pilihan bahasa manual; fallback locale tidak dikenal adalah `id`.

## 6. Update lifecycle

1. Browser menemukan service worker/build baru.
2. UI menampilkan “update tersedia” dengan aksi yang jelas.
3. Pengguna memutuskan memperbarui; jika masih ada form state, beri peringatan sebelum reload.
4. App mengaktifkan versi baru, memuat aset versi baru, dan membersihkan cache publik lama milik iToken.
5. Tidak ada business state/credential yang dipindahkan ke cache.

Kode menyediakan pemberitahuan worker yang menunggu dan aksi Update; perubahan form yang terdeteksi meminta konfirmasi. Browser verification, state kegagalan aktivasi, dan review multi-tab masih **Not Verified**.

## 7. Localization, accessibility, dan security

- Manifest/app UI default `id`, dengan UI translations `en` dan `zh_CN`.
- Language selector/update/offline notice semuanya diterjemahkan.
- Install/update prompt dapat dioperasikan keyboard, mempunyai label, focus state, dan tidak memaksa fokus.
- Hormati `prefers-reduced-motion` dan `aria-live` untuk status koneksi/update.
- Locale preference non-sensitif boleh disimpan terpisah; tidak boleh berbagi storage dengan credential/session.
- Service worker dan manifest tidak memuat environment secrets, private API contract, credential, atau PII.

## 8. Acceptance Stage 8

### Status implementasi

- **Completed — UI:** manifest, PNG/SVG icons, service worker, selective hashed asset cache, localized offline fallback, install prompt/manual guidance, update notice/action, connection notice, dan route dashboard `no-store` tersedia pada kode.
- **Runtime browser — Not Verified:** install prompt/appinstalled, navigasi offline, update worker/lifecycle, perilaku multi-tab, visual/responsive, serta installability target platform belum diuji browser pada audit sinkronisasi dokumentasi ini. Status implementasi kode di atas tidak menyatakan skenario runtime tersebut telah berhasil.
- **Pending deployment verification:** HTTPS wajib di produksi; scope `/` diasumsikan root-domain deployment. Untuk subpath, manifest dan registration scope perlu disesuaikan.

- **Acceptance pending:** manifest dan identitas/ikon harus divalidasi pada browser/platform target.
- **Acceptance pending:** app install prompt harus diuji dan hanya tampil ketika didukung.
- **Acceptance pending:** offline fallback harus diuji saat network gagal dan hanya memuat konten publik aman.
- Service worker hanya men-cache allowlisted static assets dan offline fallback (kode sesuai inspeksi statis; runtime browser tetap **Not Verified**).
- Dashboard/auth/API/payment/private responses tidak pernah masuk cache; prompt/completion/secret tidak pernah disimpan.
- **Acceptance pending:** worker update harus diuji agar menginformasikan pengguna, tidak membuang form changes tanpa peringatan, dan mengganti cache lama dengan benar.
- **Acceptance pending:** test online/offline/reconnect/update dan locale di desktop serta mobile target harus dijalankan dan hasilnya dicatat.
- PWA verification artifacts/results dicatat pada `09-implementation-roadmap.md` dan `10-acceptance-checklist.md`.
