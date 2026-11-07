# 10 — Acceptance Checklist

Checklist ini mencatat keadaan implementasi yang diketahui dan hal yang masih harus diterima. Status UI, perilaku lokal, integrasi, dan pengujian dipisahkan. `Completed — Integrated` memerlukan koneksi layanan nyata dan verifikasi; UI atau test render saja tidak cukup.

Legenda status implementasi: **Completed — UI**, **Completed — Local**, **Completed — Integrated**, **Demo**, **Partial**, **Pending**, **Not Verified**. Hasil pengujian dicatat terpisah dan hanya boleh dicentang setelah command/browser yang disebut benar-benar dijalankan.

## Public Website

- [x] Route untuk Home, Models, Pricing, Docs, FAQ, About, Contact, Terms, Privacy, Status, dan fallback tersedia.
- [x] Pricing/model contoh diberi label atau copy DEMO; homepage menyebut metode pembayaran sebagai rencana informasional.
- [ ] Target anchor `#how-it-works` tersedia dan link section teruji.
- [ ] Semua route, CTA, link header/footer dan placeholder ditinjau browser.
- [ ] Responsive desktop/tablet/mobile, tanpa overflow, diuji browser.
- [ ] Keyboard, focus, contrast, screen reader dan reduced motion diuji.

## Dashboard UI dan data

- [x] Dashboard menampilkan Overview, API Keys, Usage, Logs, Billing, Settings.
- [x] Wallet, Transactions, dashboard Models dan Developer Docs ditandai placeholder/partial dalam dokumentasi.
- [x] UI API Keys, Usage, Logs, Billing tersedia dan data/actions diberi batas DEMO.
- [x] Top Up hanya simulasi; tidak mengirim payment request, menampilkan kredensial aktif, atau mengubah saldo.
- [x] Theme, density, table rows dan profil demo menggunakan localStorage browser; tidak diklaim sebagai setting/profile server.
- [ ] Route Dashboard dilindungi autentikasi server-side sebelum data privat operasional ditampilkan.
- [ ] Dashboard business data terhubung hanya melalui kontrak Backend API yang disahkan.
- [ ] Responsive layout, modal/drawer keyboard behavior, overflow dan tema Light/Dark diuji browser.

## Authentication

- [x] UI login, register, forgot-password, dan instruksi reset tersedia dengan pemberitahuan bahwa auth belum aktif.
- [x] Logout menggunakan POST route; interaksi saat ini menyatakan tidak ada session yang diakhiri.
- [ ] Clerk SDK/hosted flow dikonfigurasi dengan kredensial sah.
- [ ] Laravel memverifikasi Clerk session di server dan membuat session aplikasi aman.
- [ ] Dashboard/route privat memakai middleware autentikasi dan authorization.
- [ ] Login, register, reset, OAuth yang diaktifkan, verification dan logout end-to-end diverifikasi.
- [ ] Keputusan Laravel scaffold `users`/guard versus Clerk terdokumentasi dan diterapkan.

## Product integration

- [ ] Wallet/balance, payment, transactions, API keys, model catalog, usage/logs dan account business memakai sumber Backend API yang disahkan.
- [ ] Tidak ada secret/key real yang disimpan di browser; lifecycle API key mengikuti contract.
- [ ] Status payment hanya dinyatakan berdasarkan hasil terverifikasi provider/backend.
- [ ] LiteLLM dan Redis tidak diakses dari browser.
- [ ] Zero-logging prompt/completion dan larangan cache data privat diverifikasi pada integration path.

## Localization, responsive, accessibility

- [x] Locale `id`, `en`, dan `zh_CN` tersedia secara statis untuk UI yang diperiksa; PWA memiliki kamusnya sendiri.
- [ ] Terjemahan diuji browser pada seluruh halaman/state, termasuk kesalahan dan modal.
- [ ] Format tanggal/angka/mata uang diverifikasi per locale.
- [ ] Desktop, tablet, mobile: tidak ada unintended overflow.
- [ ] Keyboard, focus, form labels, heading order, status nonwarna, contrast dan screen reader diperiksa.
- [ ] `prefers-reduced-motion` diverifikasi; dukungan global saat ini belum lengkap.

## PWA

- [x] Manifest, icons, service worker dan offline fallback tersedia pada kode.
- [x] Kode worker membatasi cache ke offline fallback dan hashed build assets satu origin; HTML navigation network-only.
- [ ] Install prompt/appinstalled diuji pada browser/platform target.
- [ ] Offline navigation, reconnect, update, multi-tab, precache failure dan recovery diuji browser.
- [ ] Production HTTPS, deployment scope, MIME dan installability target diverifikasi.

## Test dan verifikasi

Status pada sinkronisasi dokumentasi: **Not Verified pada run ini**. Tes tidak dijalankan selama audit sinkronisasi ini; hasil yang tercatat dari pemeriksaan sebelumnya bukan hasil run saat ini.

- [ ] Catat `npm run build` beserta hasil/lingkungan untuk perubahan berikutnya.
- [ ] Catat Laravel feature tests beserta command, PHP/container dan hasil.
- [ ] Catat tes JavaScript yang benar-benar dijalankan; `package.json` saat ini tidak memiliki script test.
- [ ] Catat Pint jika file PHP disentuh.
- [ ] Jalankan `git diff --check` dan simpan status/diff perubahan.
- [ ] Catat browser, ukuran viewport, skenario dan hasil visual/accessibility/PWA.

Lihat `09-implementation-roadmap.md` untuk ringkasan implementasi dan pekerjaan berikutnya. Checklist ini tidak menyatakan seluruh aplikasi siap produksi.
