# 03 — Design System

Dokumen ini menetapkan arah dan aturan visual. Nilai warna dan ukuran berikut adalah titik awal yang boleh disesuaikan saat implementasi visual, tetapi konsistensi harus dijaga.

Stack UI menggunakan Blade untuk markup/layout, Livewire 4 untuk interaksi server-driven, Tailwind CSS 4 untuk styling, JavaScript seperlunya, dan Vite untuk aset. Design system tidak menentukan kontrak backend. Batas platform ada di `09-frontend-architecture.md`.

## 1. Tema

- Tema utama: Light.
- Latar halaman: abu-abu sangat muda atau putih hangat.
- Surface/kartu: putih.
- Teks utama: slate/abu-abu gelap dengan kontras tinggi.
- Teks sekunder: slate sedang.
- Border: abu-abu terang.
- Warna aksen: satu warna utama yang konsisten untuk CTA dan fokus.
- Warna status: success, warning, danger, info; selalu disertai label teks.

Jangan menggunakan banyak warna aksen sekaligus.

## 2. Tipografi

- Gunakan keluarga sans-serif yang bersih dan mudah dibaca.
- Heading memiliki skala dan bobot konsisten.
- Body text nyaman dibaca pada ukuran desktop maupun mobile.
- Angka saldo, harga, token, dan statistik menggunakan angka tabular bila tersedia.
- Code block menggunakan font monospace.

## 3. Spacing dan bentuk

Gunakan skala spacing konsisten berbasis kelipatan 4 px. Terapkan:
- Jarak antarbagian yang cukup.
- Padding kartu yang konsisten.
- Radius sedang untuk kartu, input, dan tombol.
- Border halus; shadow hanya bila membantu pemisahan layer.
- Lebar konten dibatasi agar baris teks tidak terlalu panjang.

## 4. Komponen inti

### Navigasi
- Public header.
- Public footer.
- Dashboard sidebar.
- Dashboard topbar.
- Breadcrumb.
- Mobile navigation/drawer.
- Language switcher.

### Tombol
- Primary: satu tindakan utama per area.
- Secondary: tindakan alternatif.
- Tertiary/ghost: tindakan ringan.
- Destructive: revoke/delete/logout bila relevan.
- Disabled dan loading state harus terlihat jelas.

### Form
- Label di atas input.
- Helper text bila diperlukan.
- Error text dekat field yang bermasalah.
- Password visibility toggle.
- Select, checkbox, radio, textarea dengan ukuran dan fokus konsisten.

### Data display
- Summary card.
- Badge status.
- Table.
- Pagination.
- Tabs.
- Filter bar.
- Search field.
- Empty state.
- Skeleton/loading state.
- Chart/graph.
- Code block dengan tombol copy.

### Feedback
- Toast success/error.
- Inline alert.
- Confirmation dialog.
- Tooltip untuk istilah teknis.
- Empty state dengan CTA kontekstual.

### State integrasi

- Identitas pengguna: tampilkan state Clerk seperti signed out, loading, verification pending, error, dan signed in hanya berdasarkan status yang tervalidasi.
- Data Backend API: loading, loaded, empty, stale/refreshing bila kontrak mendukung, dan error. Jangan mengisi state gagal dengan nilai demo yang terlihat nyata.
- Integrasi belum aktif: gunakan label `DEMO`/`PENDING` dan aksi nonaktif atau simulasi yang menjelaskan batasnya.
- PWA: tampilkan install, offline, update available, dan reconnected state secara informatif tanpa mengungkap data privat.

### Peran implementasi komponen

- Blade components menjadi sumber markup dan visual yang reusable.
- Livewire mengelola interaction state dan mengirim event server yang sesuai; aksi bisnis hanya setelah Backend API contract tersedia.
- Tailwind utilities mengatur visual state dan breakpoints, bukan data/authorization.
- JavaScript menangani browser-only interaction seperti menu, dialog, clipboard, filter lokal demo, `beforeinstallprompt`, dan notifikasi update service worker.
- Vite membangun CSS/JS dan aset publik; jangan menaruh runtime secret dalam bundle.

## 5. Status visual

Status tidak boleh hanya dibedakan dengan warna.

| Status | Gaya | Contoh label |
|---|---|---|
| Aktif / berhasil | Hijau lembut | Active, Paid, Success |
| Menunggu | Kuning/amber lembut | Pending |
| Gagal / kedaluwarsa | Merah lembut | Failed, Expired |
| Dicabut / nonaktif | Abu-abu | Revoked, Inactive |
| Informasi | Biru lembut | Info |

## 6. Ikon dan ilustrasi

- Gunakan satu keluarga ikon secara konsisten.
- Ikon dekoratif tidak boleh menggantikan label tindakan.
- Hindari emoji sebagai ikon navigasi utama.
- Ilustrasi homepage bersifat sederhana dan mendukung pesan produk.

## 7. Grafik

- Grafik harus memiliki judul, rentang waktu, label sumbu, dan satuan.
- Tooltip menampilkan nilai tepat.
- Sediakan ringkasan teks atau tabel untuk informasi penting.
- Jangan membuat grafik kosong tampak seperti data nyata.

## 8. Auth, gateway, dan PWA visual

- Form auth memakai label, error per-field, disabled/loading state, password visibility toggle bila flow mengizinkan, dan pesan yang tidak mengungkap informasi akun berlebihan.
- Branding layar autentikasi konsisten dengan iToken; tampilan hosted/embedded Clerk masih `PENDING`.
- Informasi katalog, usage, pricing, atau status yang berasal dari AI gateway ditandai berdasarkan data Backend API. Jangan menampilkan panel koneksi langsung ke LiteLLM atau Redis.
- Install/update/offline notices tidak menutupi tugas utama, dapat diakses keyboard, dan tidak menyiratkan offline access ke dashboard.
- Rincian manifest/service worker ada di `09-frontend-architecture.md`.
