# 08 — Checklist Penerimaan UI

## Struktur dan navigasi
- [ ] Semua halaman pada inventaris memiliki rancangan atau implementasi.
- [x] Public header dan footer konsisten untuk seluruh route publik.
- [ ] Dashboard sidebar/topbar konsisten.
- [ ] Halaman aktif ditandai dengan jelas.
- [x] Tautan dan CTA halaman publik mengarah ke route atau section yang tersedia.
- [x] Halaman 404 tersedia.
- [ ] Sign in, Sign up, verifikasi, reset password, dan sign out UI Clerk memiliki state loading/error/pending sesuai kontrak tanpa menyatakan mock sukses.

## Visual
- [ ] Light theme diterapkan konsisten.
- [ ] Tipografi, spacing, warna, radius, dan tombol konsisten.
- [ ] Hierarki judul dan isi jelas.
- [ ] Tidak ada elemen yang saling bertumpuk.
- [ ] Tidak ada horizontal overflow yang tidak disengaja.
- [ ] Data padat menggunakan tabel atau pola yang mudah dibaca.

## Interaksi
- [ ] Menu mobile dapat dibuka dan ditutup.
- [ ] Form memiliki label dan feedback validasi.
- [ ] Tombol memiliki hover, focus, disabled, dan loading state yang sesuai.
- [x] Search dan filter katalog memiliki empty state.
- [ ] Dialog konfirmasi tersedia untuk tindakan destruktif.
- [ ] Copy menampilkan feedback.
- [ ] Loading, empty, error, dan success state dirancang.
- [ ] Livewire updates mempertahankan focus, label, keyboard order, dan screen reader feedback.
- [ ] Tidak ada business action yang berjalan hanya dari mock data.

## Konten dan data
- [ ] Bahasa Indonesia menjadi default.
- [ ] Pilihan English dan 简体中文 tersedia pada UI.
- [ ] Tidak ada klaim statistik yang belum terverifikasi.
- [x] Harga dan kuota ditandai DEMO, bukan harga final.
- [ ] Semua data demonstrasi ditandai DEMO.
- [ ] Tidak ada API key palsu yang tampak aktif.
- [ ] Tidak ada prompt atau completion pada tampilan analytics/history.
- [ ] Mock status Clerk, Backend API, LiteLLM, Redis, payment, dan model mudah dibedakan dari status nyata.
- [ ] UI tidak mengklaim data/cache/health Redis atau status provider LiteLLM tanpa response contract.

## Responsif dan aksesibilitas
- [ ] Tampilan diperiksa pada desktop.
- [ ] Tampilan diperiksa pada tablet.
- [ ] Tampilan diperiksa pada ponsel.
- [ ] Keyboard navigation dapat digunakan.
- [ ] Focus state terlihat.
- [ ] Kontras dan label aksesibel.
- [ ] Grafik memiliki alternatif ringkasan.
- [ ] PWA memiliki layar offline dan pengalaman instalasi yang jelas.
- [ ] Manifest berisi metadata iToken dan tidak mengarahkan ke data dashboard privat offline.
- [ ] Service worker hanya meng-cache allowlist aset publik dan offline fallback aman.
- [ ] Dashboard, API response, wallet, transaksi, usage, API key, Clerk credential, prompt/completion, token, dan secret tidak masuk ke Cache Storage.
- [ ] Install prompt hanya muncul jika didukung dan dapat ditutup.
- [ ] Update notice menjelaskan pembaruan dan tidak membuang perubahan form tanpa peringatan.
- [ ] Reconnected notice tidak mengklaim data telah diperbarui sebelum request sukses.

## Kualitas
- [ ] Komponen yang sama menggunakan pola visual yang sama.
- [ ] Tidak ada animasi berlebihan.
- [ ] Tidak ada placeholder generik yang tertinggal pada halaman final.
- [ ] Build frontend berhasil.
- [ ] Hasil visual benar-benar diperiksa di browser pada beberapa ukuran layar.

## Catatan progres implementasi

### Tahap 1 — Fondasi UI

- [x] Layout publik dasar dengan header, footer, dan navigasi mobile.
- [x] Design tokens light theme, tipografi, warna, radius, dan spacing.
- [x] Komponen reusable button, card, field, badge, dan alert.
- [x] Dialog demonstrasi, toast, language switcher, dan menu mobile interaktif.
- [x] Contoh tabel responsif dengan data yang ditandai DEMO.
- [ ] Dashboard sidebar/topbar final dan pemeriksaan visual lintas perangkat dilanjutkan pada tahap halaman terkait.

Catatan Tahap 1: fondasi awal telah dipakai ulang pada halaman publik. Pilihan bahasa menggunakan terjemahan UI di browser.

### Tahap 2 — Public Pages

- [x] Homepage, Pricing, Model AI, dan Dokumentasi publik.
- [x] FAQ, About, Contact, Terms, Privacy, Status, dan 404 memiliki route.
- [x] Search/filter katalog serta copy code bekerja di frontend.
- [x] Tombol pemilihan paket hanya membuka dialog simulasi.
- [x] Konten nonfinal (harga, model, kontak, legal, status) diberi penanda demo atau placeholder.
- [ ] Pemeriksaan tampilan visual langsung di browser pada beberapa ukuran layar.

Catatan: Terms, Privacy, Contact, dan Status tetap placeholder karena konten resmi atau sumber datanya belum ditetapkan. Model dan paket harga menggunakan mock data dan tidak menunjukkan ketersediaan atau penawaran aktif.

## Integrasi platform dan PWA

- [ ] Batas teknologi Laravel 13, Blade, Livewire 4, Tailwind CSS 4, JavaScript, dan Vite mengikuti `09-frontend-architecture.md`.
- [ ] Clerk adalah pemilik identity lifecycle dan Laravel melakukan verifikasi server-side setelah kontrak disetujui.
- [ ] LiteLLM tidak dipanggil langsung dari browser; data model/usage yang tampil mengikuti Backend API contract.
- [ ] Redis tidak diakses browser; tujuan dan pengaruhnya pada freshness UI belum diasumsikan.
- [ ] Manifest, cache allowlist, install, offline fallback, dan update lifecycle ditetapkan sebelum implementasi Tahap 5.
- [ ] `id` default, `en`, dan `zh_CN` tersedia pada semua halaman dan state PWA.

Catatan status: Auth UI dan integrasi Clerk adalah kebutuhan tahap berikutnya dan belum diimplementasikan. PWA adalah tahap tersendiri dan belum diimplementasikan. Nilai PWA dan kontrak Clerk/Backend API/LiteLLM/Redis yang belum dikonfirmasi tetap `PENDING`.
