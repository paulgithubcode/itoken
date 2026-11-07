# 05 — Komponen dan Interaksi UI

## 1. Public website

Public UI dirender dengan Blade; komponen statis memakai Blade components dan interaksi server-driven memakai Livewire 4 bila bermanfaat. Tailwind CSS 4 menjaga visual konsisten, JavaScript dibatasi pada browser behaviors, dan Vite membangun aset. Data bisnis bukan milik komponen UI.

### Header
- Logo iToken.
- Navigasi Models, Pricing, Documentation, FAQ, About, Contact.
- Language switcher.
- Sign in dan Get started.
- Pada mobile, navigasi masuk ke menu drawer.
- Link Sign in/Get started hanya menuju flow Clerk yang dikonfigurasi; jika belum tersedia, gunakan CTA yang jelas berstatus demo dan jangan menyatakan pengguna berhasil mendaftar.

### Hero
- Headline singkat yang menjelaskan nilai utama.
- Deskripsi satu atau dua kalimat.
- CTA utama: Get started.
- CTA sekunder: Explore models atau View pricing.
- Area visual pendukung yang tidak mengganggu teks.

### Pricing card
Setiap kartu menampilkan:
- Nama paket.
- Harga dan mata uang.
- Kuota token utama.
- Bonus token bila ada.
- Total token bila perhitungan sudah pasti.
- Masa berlaku bila dikonfirmasi.
- Tombol pilih paket.

Harga dan paket yang tercantum dalam arsip adalah rancangan historis, bukan otomatis harga final iToken. Untuk tampilan produksi gunakan nilai yang telah disetujui; selama belum final gunakan placeholder atau label Demo.

Harga/kuota final berasal dari Backend API setelah contract tersedia. Tombol pilihan paket pada mock hanya boleh membuka simulasi UI bertuliskan DEMO; dilarang membuat invoice atau menampilkan Paid/Success palsu.

### Model card / row
- Nama model.
- Provider.
- Deskripsi singkat.
- Status ketersediaan.
- Multiplier/usage rate bila telah ditetapkan.
- Context information bila tersedia.
- Link detail bila diperlukan.

Jangan menandai model sebagai aktif tanpa data yang telah dikonfirmasi.
Data model yang direncanakan berasal dari Backend API. LiteLLM mungkin berada di belakang jalur layanan AI; UI tidak memanggil LiteLLM dan belum boleh mengasumsikan identifier, capability, context, routing, fallback, atau status sebelum kontrak data disetujui. Redis bukan dependency browser.

## 2. Dashboard

### Overview
- Saldo token utama.
- Saldo bonus.
- Masa berlaku.
- Ringkasan pemakaian.
- Grafik sederhana.
- Aktivitas terbaru.
- Shortcut Top Up dan API Keys.

### Wallet
- Saldo utama dan bonus ditampilkan terpisah.
- Masa berlaku dijelaskan dengan bahasa sederhana.
- Gunakan format angka yang konsisten.
- Hindari visualisasi yang menyulitkan pembacaan angka besar.

### API Keys
Tabel menampilkan nama key, prefix tersamarkan, tanggal dibuat, status, dan tindakan.
- Copy hanya tersedia untuk nilai yang memang boleh disalin.
- Revoke menggunakan dialog konfirmasi.
- Secret penuh tidak ditampilkan di daftar.
- Layar hasil pembuatan memiliki tombol copy dan peringatan keamanan.

### Usage & Analytics
- Filter rentang waktu.
- Total token.
- Input tokens dan output tokens.
- Penggunaan berdasarkan model.
- Riwayat dengan waktu dan model.
- Cost/billed token breakdown bila definisinya tersedia.

Jangan pernah menampilkan prompt atau completion pengguna dalam dashboard. Kebutuhan produk arsip menetapkan kebijakan zero-logging untuk isi prompt dan respons AI.

### Transactions
- Tabel responsif.
- Status dengan badge dan label.
- Filter tanggal/status/jenis bila relevan.
- Detail transaksi.
- Empty state untuk akun tanpa transaksi.

## 3. Interaksi standar

| Interaksi | Perilaku visual |
|---|---|
| Copy | Feedback singkat “Copied” atau pesan gagal |
| Search | Hasil berubah sesuai kata kunci; tampilkan empty state jika tidak ada hasil |
| Filter | Filter aktif terlihat dan dapat dihapus |
| Pagination | Halaman aktif dan jumlah data terlihat |
| Modal | Fokus berada di modal; Escape menutup bila aman |
| Destructive action | Dialog konfirmasi menyebut tindakan secara eksplisit |
| Form submit | Tombol loading/disabled selama proses |
| Validation | Pesan error dekat field terkait |
| Toast | Hilang setelah beberapa saat dan tidak menutupi tindakan penting |
| Tabs | Tab aktif jelas dan konten sesuai |
| Accordion | Status buka/tutup dapat dipahami dan keyboard-accessible |
| Auth state | Loading/error/verification/success mengikuti hasil Clerk yang tervalidasi; mock tidak boleh mengklaim login berhasil |
| API data state | Loading/empty/error/retry hanya menyajikan business state setelah Backend API contract tersedia |
| Install PWA | Tawarkan install hanya ketika didukung; dismissible dan tidak menghalangi konten |
| Offline PWA | Beri tahu bahwa koneksi dibutuhkan untuk data akun; jangan memuat state privat dari cache |
| Update PWA | Tampilkan versi baru dan aksi update; hindari reload yang membuang perubahan tanpa peringatan |

## 4. Empty, loading, error, success

Setiap halaman data perlu memiliki state:
- Loading/skeleton.
- Berhasil dengan data.
- Kosong.
- Gagal memuat.
- Filter tidak menemukan hasil.

Jangan menggunakan spinner tanpa batas waktu atau membiarkan halaman terlihat rusak ketika data belum tersedia.

## 5. Data demonstrasi

- Tandai data demo secara konsisten, misalnya badge `DEMO`.
- Gunakan nama dan nilai fiktif yang jelas.
- Jangan gunakan API key yang tampak seperti secret sungguhan.
- Jangan membuat status Paid atau Success palsu pada layar yang dapat disalahartikan sebagai pembayaran nyata.
- Data contoh hanya untuk memeriksa layout, format, grafik, tabel, dan interaksi.

## 6. Komponen Clerk dan keamanan auth

- Sign in / Sign up form atau branded Clerk entry point, provider OAuth yang tersedia, verification notice, forgot/reset password flow, loading state, error state, dan sign-out confirmation.
- Komponen UI tidak memvalidasi identity sendiri. Laravel memverifikasi proof/session dari Clerk di server dan membuat application session aman sesuai kontrak.
- Jangan menyimpan password, credential, refresh token, atau auth token di localStorage, Cache Storage, IndexedDB, atau state yang diserialisasi ke HTML.
- Pemetaan Clerk User ID ke Backend User ID mengikuti kesepakatan backend; UI tidak menebak mapping dari email atau input pengguna.
- Mode hosted vs embedded, SDK, token, callback, dan error copy spesifik `PENDING`.

## 7. LiteLLM dan Redis dalam UI

- UI model, pricing, usage, dan status membaca data dari Backend API, bukan dari LiteLLM atau Redis langsung.
- Jangan paparkan provider master credential, Redis key, cache hit, internal routing, infrastructure health, atau raw error kecuali ada response contract dan keputusan produk yang disetujui.
- LiteLLM dapat menjadi AI gateway pada sisi layanan; data model yang boleh ditampilkan dan bentuk error/fallback `PENDING`.
- Tujuan Redis, TTL, freshness, invalidation, dan efeknya pada UI `PENDING`. UI hanya menampilkan freshness/state jika Backend API mengirimkannya secara eksplisit.

## 8. Komponen PWA

- Install prompt/banner yang dapat ditutup.
- Offline notice/fallback untuk halaman publik; teks menegaskan data akun butuh koneksi.
- Update available notice dengan tombol update.
- Reconnected feedback yang tidak mengklaim data tersinkron sebelum request berhasil.
- Manifest/icon requirements dan cache allowlist dirinci di `09-frontend-architecture.md`.
- Tidak ada komponen PWA yang membaca/menulis business state atau credential ke cache.
