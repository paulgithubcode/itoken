# 02 — Inventaris Halaman

Daftar ini merupakan inventaris pengalaman iToken yang dikerjakan bertahap. Dokumen arsip hanya referensi historis; harga, paket, provider, model, dan statistik di dalamnya bukan keputusan produk final.

## A. Website publik

| Halaman | Tujuan | Elemen utama |
|---|---|---|
| Home | Menjelaskan nilai produk dan mengarahkan pengunjung | Hero, CTA, keunggulan, statistik publik yang tervalidasi, ringkasan model, cara kerja, FAQ ringkas |
| Models | Menjelajahi katalog model yang disediakan Backend API | Search, filter provider, kartu/tabel model, status dan detail bila kontrak mendukung; tanpa klaim model aktif dari mock |
| Pricing | Membandingkan paket prabayar yang disediakan Backend API | Kartu paket, mata uang, kuota, bonus, masa berlaku, FAQ; nilai mock wajib berlabel DEMO |
| Documentation | Membantu developer memahami produk dan integrasi yang telah disetujui | Sidebar/daftar isi, contoh kode placeholder, tombol copy; jangan mengklaim endpoint aktif sebelum kontrak disetujui |
| FAQ | Menjawab pertanyaan umum | Kategori dan accordion |
| About | Menjelaskan produk dan tujuan | Ringkasan, manfaat, prinsip layanan |
| Contact | Menyediakan kanal kontak yang telah disetujui | Informasi kontak; formulir hanya bila tersedia endpoint dan status pengiriman nyata, selain itu tampilkan placeholder |
| Terms | Menampilkan syarat layanan | Konten legal dengan tipografi nyaman |
| Privacy | Menampilkan kebijakan privasi | Konten legal dan penekanan privasi |
| Status | Menampilkan ringkasan status layanan | Status keseluruhan dan daftar komponen sebagai tampilan |
| 404 | Membantu pengguna kembali ke halaman yang benar | Pesan tidak ditemukan dan tautan kembali |

### Struktur homepage

Urutan bagian yang disarankan:
1. Header: logo, Models, Pricing, Documentation, FAQ, About, Contact, language selector, Sign in dan Get started. Sign in/Get started mengarah ke layar Clerk jika telah dikonfigurasi; selain itu tampilkan CTA demo yang tidak mengklaim signup berhasil.
2. Hero: proposisi nilai, CTA utama dan sekunder.
3. Ringkasan manfaat: satu key, banyak model, prabayar, transparansi.
4. Statistik publik: total token diproses, jumlah model aktif, rata-rata latency, success rate. Tampilkan hanya bila sumber Backend API tervalidasi; jika belum, sembunyikan atau beri placeholder DEMO yang tidak menyerupai statistik aktual.
5. Model unggulan: beberapa kartu model sebagai contoh.
6. Cara kerja: pilih paket, buat API key, hubungkan ke coding tool.
7. Ringkasan pricing.
8. FAQ ringkas.
9. Footer: tautan produk, dokumentasi, legal, dan kontak.

## B. Autentikasi dan akun

| Halaman/layar | Elemen utama |
|---|---|
| Sign in | Clerk-hosted/approved UI atau branded shell, email/password dan OAuth hanya sesuai konfigurasi Clerk; state loading/error/verification |
| Sign up | Form/flow Clerk, persetujuan dan pilihan provider hanya sesuai konfigurasi aktif |
| Email verification | Status dan aksi kirim ulang dari Clerk; jangan mensimulasikan verifikasi berhasil |
| Forgot password | Flow pemulihan Clerk; feedback hanya setelah respons nyata |
| Reset password | Flow Clerk; aturan validasi mengikuti kontrak/provider |
| Account profile | Informasi profil dan preferensi |
| Security | Status keamanan akun, email terverifikasi, pengelolaan sesi bila ditampilkan |
| Sign out confirmation | Dialog konfirmasi keluar |

Layar autentikasi mengikuti tampilan dan branding iToken. Jangan menampilkan pilihan login sosial sebagai aktif jika belum tersedia pada konfigurasi produk.

**Status saat ini:** UI auth belum menjadi integrasi nyata. Clerk mengelola seluruh identitas dan credential; Laravel wajib memverifikasi bukti autentikasi di server. Jangan mengasumsikan JWT, session exchange, refresh, atau token flow. Lihat `09-frontend-architecture.md`.

## C. Dashboard pengguna

Dashboard menggunakan sidebar pada desktop dan navigasi ringkas/drawer pada layar kecil. Semua saldo, key, transaksi, dan usage adalah data milik Backend API; dashboard tidak boleh mengandalkan local database atau cache PWA untuk state bisnis.

| Halaman | Tujuan | Elemen utama |
|---|---|---|
| Overview | Ringkasan kondisi akun | Saldo, saldo bonus, masa berlaku, ringkasan penggunaan, aktivitas terbaru, CTA top-up dan API key |
| Wallet | Menjelaskan saldo token | Saldo utama, bonus, masa berlaku, ringkasan saldo |
| Top Up | Memilih paket dan melihat ringkasan pembelian | Paket, kuota, bonus, harga, ringkasan pilihan |
| Payment instruction/status | Menampilkan instruksi dan status pembayaran | Nomor/instruksi pembayaran bila disediakan, nominal, countdown jika relevan, status |
| Transactions | Melihat riwayat transaksi | Tabel, filter tanggal/status/jenis, pagination |
| Transaction detail | Melihat detail satu transaksi | Nomor referensi, tanggal, nominal, paket, metode, status |
| API Keys | Mengelola key dari sudut pandang UI | Daftar key, nama, prefix tersamarkan, tanggal dibuat, status, tombol create/revoke/copy |
| Create API Key | Membuat key melalui dialog/halaman | Nama key, ringkasan peringatan, tombol buat |
| API Key created | Menampilkan secret yang baru dibuat | Secret hanya ditampilkan pada layar hasil pembuatan; tombol copy dan peringatan untuk menyimpannya |
| Models | Menjelajahi katalog dari dashboard | Search, filter, provider, status, multiplier bila tersedia, context info |
| Usage & Analytics | Memahami pemakaian | Grafik pemakaian token, input/output, pemakaian per model, riwayat penggunaan |
| Documentation | Panduan penggunaan | Navigasi dokumentasi dan contoh konfigurasi |
| Profile | Melihat/mengubah informasi profil sesuai fitur yang tersedia | Nama, email, preferensi |
| Security | Pengaturan keamanan akun | Status verifikasi, password/account security sesuai fitur yang tersedia |
| Preferences | Preferensi tampilan | Bahasa, tema bila tema tambahan kelak tersedia, preferensi email bila tersedia |

## D. Pola layout dashboard

- Sidebar desktop: logo, navigasi berkelompok, indikator halaman aktif, area akun di bagian bawah.
- Topbar: breadcrumb/judul kontekstual, pemilih bahasa, menu akun.
- Konten: judul halaman, deskripsi singkat, tindakan utama, lalu konten.
- Mobile: sidebar berubah menjadi drawer atau navigasi yang tidak memakan lebar konten.
- Jangan memaksakan semua informasi menjadi kartu; tabel dan ringkasan inline lebih tepat untuk data padat.

## E. Status implementasi UI dan dependency

| Bagian | Status UI | Sumber/interaksi yang dibutuhkan |
|---|---|---|
| Public Home, FAQ, About | Copy dan layout dapat dirender tanpa business API | Statistik dinamis, bila kelak dipakai, memerlukan sumber Backend API tervalidasi; selain itu disembunyikan/DEMO |
| Pricing | Mock package dapat dipakai dengan badge DEMO | Paket/harga final dan status pembelian memerlukan Backend API; payment hanya jika kontrak terpisah disetujui |
| Models | Search/filter dapat berfungsi pada mock | Katalog, availability, model capabilities dan pricing aktual memerlukan Backend API; hubungan LiteLLM ↔ Backend API `PENDING` |
| Documentation | Placeholder ilustratif aman | Endpoint, SDK, auth, request/response, Base URL final memerlukan kontrak resmi; jangan menurunkan kontrak dari LiteLLM langsung |
| Sign in / Sign up / verification / recovery | UI dapat dibuat, tetapi status auth harus jujur | Clerk flow yang disetujui dan Laravel server-side verification; integrasi saat ini belum dikerjakan |
| Dashboard dan account screens | UI kelak dapat memakai mock berlabel DEMO | Auth Clerk terverifikasi, account mapping, otorisasi, dan data Backend API; tidak ada database bisnis frontend |
| Status dan Contact | Placeholder dapat dipakai selama sumber/kanal belum ada | Status API dan detail kontak harus disetujui; Redis/LiteLLM internal health tidak dipaparkan otomatis |
| PWA | Experience dan states perlu dirancang | Manifest, service worker, asset allowlist, offline fallback, install/update policy; detail final `PENDING` dan tidak boleh cache konten privat |

LiteLLM bukan screen atau koneksi browser. Redis juga tidak diekspos ke UI. UI hanya dapat menampilkan dampak yang telah disediakan Backend API dengan kontrak yang jelas.
