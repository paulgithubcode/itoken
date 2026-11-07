# 07 — Responsif, Aksesibilitas, dan PWA

Frontend memakai Blade, Livewire 4, Tailwind CSS 4, JavaScript seperlunya, dan Vite. Responsive/accessibility behavior berlaku pada halaman server-rendered maupun update Livewire. Perubahan DOM Livewire harus mempertahankan label, focus order, feedback assistive technology, dan navigasi keyboard.

## 1. Responsive behavior

### Desktop
- Public header horizontal.
- Dashboard sidebar tetap terlihat.
- Tabel dapat menggunakan lebar penuh konten.
- Grafik dan summary card menggunakan grid.

### Tablet
- Sidebar dapat diperkecil atau menjadi drawer.
- Grid kartu menyesuaikan dua kolom bila cukup lebar.
- Navigasi publik tidak boleh bertabrakan dengan CTA.

### Mobile
- Navigasi publik menggunakan menu drawer.
- Dashboard menggunakan drawer atau navigasi ringkas.
- Summary card satu kolom atau dua kolom sesuai lebar.
- Tabel memiliki strategi mobile: scroll horizontal terkontrol atau tampilan list/card.
- Tombol dan input memiliki area sentuh yang nyaman.
- Dialog tidak keluar dari viewport.
- Hindari teks, angka, dan tombol yang terpotong.

## 2. Aksesibilitas

- Semua input memiliki label.
- Tombol memiliki nama aksi yang jelas.
- Navigasi dapat digunakan dengan keyboard.
- Fokus keyboard terlihat.
- Kontras teks memadai.
- Ikon penting memiliki teks pendamping atau accessible label.
- Status tidak disampaikan dengan warna saja.
- Dialog mengelola fokus dengan benar.
- Grafik memiliki ringkasan teks atau alternatif tabel.
- Gunakan heading secara berurutan dan semantik.
- Livewire loading/validation/error/success states diumumkan dengan `aria-live`/semantik yang tepat tanpa memindahkan fokus secara mengejutkan.
- Setelah modal dibuka fokus masuk ke dialog dan dikembalikan setelah dialog ditutup; operasi destruktif memiliki konfirmasi yang dapat dibaca screen reader.
- Form Clerk menggunakan pesan yang aman, tidak menyingkap apakah akun tertentu terdaftar tanpa keputusan/auth response yang benar.

## 3. PWA dari sisi pengguna

Pengalaman PWA mencakup:
- Nama dan ikon aplikasi iToken.
- Prompt instalasi yang tidak mengganggu.
- Tampilan saat aplikasi dibuka dari home screen.
- Halaman offline yang informatif.
- Feedback ketika koneksi terputus dan pulih.
- Pengalaman pembaruan aplikasi yang jelas.

Untuk pengalaman offline, tampilkan halaman informasi bahwa koneksi diperlukan untuk memuat data akun. Jangan menampilkan data dashboard lama seolah-olah masih terkini. Konten privat tidak boleh dianggap tersedia offline.

### Manifest

- Memiliki `name`/`short_name` iToken, description, locale default, `start_url`, `scope`, `display`, theme/background color, dan ikon standar/maskable.
- Tetap mengikuti light theme dan locale default `id`; dukungan UI `en` dan `zh_CN` tidak hilang dalam mode install.
- Nilai final manifest, URL start/scope, file/ukuran ikon, dan display mode `PENDING` sampai domain deployment ditentukan.
- Jangan jadikan URL privat sebagai offline start destination.

### Service worker dan cache

- Service worker hanya meng-cache static assets publik yang telah di-allowlist dan halaman offline fallback aman.
- Jangan menyimpan dashboard, response Backend API, Clerk session/credential, saldo, wallet, usage, transaksi, API key, token, secret, prompt, atau completion.
- Jangan memakai runtime cache generik untuk navigasi/data privat. Request business data diteruskan ke server tanpa menyimpan response di Cache Storage.
- Locale boleh disimpan sebagai preferensi non-sensitif saja. Tidak boleh ada credential atau private business state di localStorage, sessionStorage, Cache Storage, atau IndexedDB.
- Asset list, cache-first/network-first strategy, cache versioning/name, scope, invalidation, update cleanup, dan offline fallback route `PENDING`. Pilihan harus mempertahankan larangan cache privat.

### Install dan update

- Tawarkan instalasi hanya saat browser/platform mendukung dan app memenuhi kriteria installability.
- Jangan memaksa install; sediakan dismiss dan petunjuk manual bila browser tidak menyediakan prompt.
- Saat versi worker baru tersedia, tunjukkan notice dan aksi update. Jangan reload saat ada perubahan pengguna yang belum dikirim tanpa peringatan.
- Setelah aktivasi, aset publik dapat diperbarui dan cache lama yang dimiliki aplikasi dibersihkan; data privat tidak dipindahkan/cached.
- Copy, behavior `beforeinstallprompt`, kapan reload, dan strategi menjaga form state `PENDING`.

### Offline dan perubahan koneksi

- Offline fallback menjelaskan bahwa internet diperlukan untuk data akun dan operasi layanan.
- Tampilkan empty/offline state, bukan data cached lama.
- Pesan reconnected tidak menyatakan saldo/usage sudah refresh sampai request sukses.
- Retry, pending action, draft, dan sinkronisasi saat online tidak boleh diasumsikan. Tidak ada background sync untuk business action sebelum kontrak dan UX disetujui.

### Batas integrasi

- PWA tidak berkomunikasi langsung dengan Clerk, LiteLLM, Redis, atau database.
- Service worker tidak menjalankan aksi transaksi/auth dan tidak menyimpan payload business request.
- Manifest/service worker adalah aset publik; jangan masukkan environment secret atau endpoint internal.
- Spesifikasi source, lifecycle dan `PENDING` lengkap tercantum di `09-frontend-architecture.md`.

## 4. Motion

- Gunakan transisi singkat hanya untuk membantu memahami perubahan.
- Hormati preferensi reduced motion.
- Hindari animasi berulang yang mengganggu.
- Loading indicator harus menunjukkan proses yang sedang berlangsung.
- Hormati `prefers-reduced-motion` pada drawer, dialog, skeleton, dan update notices.
