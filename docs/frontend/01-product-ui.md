# 01 — Identitas Produk dan Prinsip UI

## 1. Ringkasan produk

iToken menyajikan akses ke berbagai model AI melalui satu platform. Pengguna dapat melihat model, memahami harga/penggunaan, membeli paket token prabayar, membuat API key, dan memantau pemakaian melalui dashboard.

### Nilai utama yang perlu terlihat

1. **Satu platform:** berbagai model AI tersedia dalam satu katalog.
2. **Satu API key platform:** pengguna tidak perlu mengelola banyak key platform untuk setiap model.
3. **Prabayar:** pembelian paket dilakukan sesuai kebutuhan, bukan langganan bulanan otomatis.
4. **Transparan:** pengguna dapat memahami paket, saldo, pemakaian, dan riwayatnya.
5. **Ramah developer:** informasi teknis seperti nama model, provider, endpoint, dan petunjuk penggunaan mudah ditemukan.

## 2. Target pengguna

- Software engineer / developer.
- AI enthusiast dan pengguna yang bereksperimen dengan berbagai model.
- Freelancer yang membutuhkan biaya penggunaan fleksibel.

## 3. Karakter visual

Arah visual: **modern, profesional, bersih, tenang, dan developer-friendly**.

Hindari:
- Tampilan terlalu ramai atau penuh efek dekoratif.
- Gradien berlebihan dan animasi yang tidak memiliki fungsi.
- Terlalu banyak warna aksen.
- Kartu dengan informasi berulang.
- Tabel padat tanpa filter atau hierarki visual.

## 4. Prinsip pengalaman

- Pengguna harus memahami fungsi halaman dalam beberapa detik.
- Saldo dan tindakan utama mudah ditemukan.
- Harga dan jumlah token ditampilkan dengan satuan yang jelas.
- Status penting memakai teks dan ikon, bukan warna saja.
- Tindakan berisiko seperti revoke API key harus meminta konfirmasi.
- Halaman kosong memiliki penjelasan dan langkah berikutnya.
- Semua halaman memiliki hierarki judul dan navigasi konsisten.
- Formulir memberi label, petunjuk, dan pesan validasi yang mudah dipahami.

## 5. Prioritas visual

1. Keterbacaan dan hierarki informasi.
2. Navigasi yang konsisten.
3. Konsistensi komponen.
4. Responsif pada desktop, tablet, dan ponsel.
5. Kecepatan dan kesederhanaan interaksi.

## 6. Konteks teknologi untuk UI

Frontend resmi memakai Laravel 13, Blade, Livewire 4, Tailwind CSS 4, JavaScript, dan Vite. Clerk menangani autentikasi; Laravel melakukan verifikasi server-side sesuai kontrak resmi dan mengelola secure application session. LiteLLM direncanakan sebagai AI gateway di sisi layanan, sementara Redis merupakan infrastruktur server-side. Browser dan UI tidak terhubung langsung ke Redis atau credential LiteLLM. Rincian peran layanan di sisi backend tetap `PENDING` sampai dikonfirmasi pada kontrak Backend API.

PWA wajib tersedia untuk shell aplikasi, instalasi, update, dan fallback offline yang aman. PWA tidak berarti halaman privat atau data akun tersedia saat offline.

## 7. Kepercayaan dan status konten

- Signup, login, logout, email verification, password, dan OAuth adalah alur Clerk. Sebelum Clerk terintegrasi, layar hanya boleh berupa mock dan tidak boleh menyatakan autentikasi berhasil.
- Data dari LiteLLM/Backend API seperti katalog model, usage, harga, saldo, dan status harus datang melalui kontrak Backend API; tampilan tanpa kontrak memakai data `DEMO` atau `PENDING`.
- Harga, paket, status pembayaran, statistik, dan status model tidak boleh disajikan sebagai nilai aktual tanpa sumber terkonfirmasi.
- Kebijakan zero-logging prompt dan completion tetap berlaku. UI, analytics, telemetry, dan PWA tidak boleh menampilkan atau menyimpan isi prompt/completion.
