# 04 — Alur Pengguna

Alur berikut menggambarkan perpindahan layar dan respons antarmuka, bukan proses internal aplikasi.

## 1. Pengunjung baru

1. Membuka Home.
2. Memahami manfaat produk dari hero dan bagian cara kerja.
3. Membuka Models untuk melihat katalog.
4. Membuka Pricing untuk membandingkan paket.
5. Memilih Get started atau Sign up dan masuk ke flow Clerk yang telah disetujui.
6. Menyelesaikan verifikasi sesuai status yang dikembalikan Clerk.
7. Laravel memverifikasi autentikasi di server dan membuat secure application session sesuai kontrak.
8. Masuk ke Overview hanya jika sesi valid dan Backend API menyediakan akses/account mapping.

Sebelum integrasi Clerk dan Backend API aktif, layar ini adalah mock UI. Jangan tampilkan sukses login atau akses dashboard sebagai fakta.

## 2. Pengguna memilih paket

1. Membuka Pricing atau Top Up.
2. Membandingkan harga, jumlah token, bonus, dan masa berlaku.
3. Memilih satu paket.
4. Melihat ringkasan pilihan.
5. Melanjutkan ke layar instruksi/status pembayaran.
6. Melihat status yang disediakan Backend API/payment integration setelah kontrak tersedia.
7. Kembali ke Wallet atau Overview setelah data aktual berhasil dimuat.

Catatan tampilan: frontend tidak memproses pembayaran. Jangan menampilkan pesan pembayaran berhasil tanpa status terverifikasi dari Backend API. Pengembangan UI memakai mock berlabel `DEMO` dan tidak membuat transaksi.

## 3. Pengguna membuat API key

1. Membuka API Keys setelah sesi Clerk diverifikasi dan akses bisnis tersedia.
2. Memilih Create API Key.
3. Mengisi nama/label key, misalnya `Cursor - Personal`.
4. Membaca peringatan penyimpanan secret.
5. Memilih Create.
6. Melihat hasil dari Backend API pada layar hasil pembuatan. Secret sungguhan hanya mengikuti kontrak backend yang disetujui.
7. Menyalin secret.
8. Menutup layar dengan peringatan bahwa secret tidak akan ditampilkan kembali bila itu merupakan aturan produk yang telah ditetapkan.

Secret demo tidak boleh menyerupai kredensial aktif. Gunakan placeholder yang jelas. UI mock tidak membuat, menampilkan, atau menyalin API key valid.

## 4. Pengguna menghubungkan coding tool

1. Membuka Documentation.
2. Memilih panduan tool yang sesuai.
3. Melihat Base URL dan contoh konfigurasi hanya setelah nilai/kontrak disetujui; sebelum itu gunakan placeholder yang tidak dapat dipakai.
4. Menyalin snippet.
5. Mengikuti petunjuk konfigurasi di tool masing-masing.

Contoh tool yang disebut dalam kebutuhan arsip: Cursor dan Cline. Dokumentasi dapat diperluas untuk tool lain.

## 5. Pengguna memantau pemakaian

1. Membuka Overview untuk melihat ringkasan.
2. Membuka Usage & Analytics.
3. Memilih rentang waktu.
4. Melihat total token, input/output, pemakaian per model, dan riwayat.
5. Menggunakan filter atau pagination bila tersedia.
6. Membuka detail penggunaan bila desain produk menyediakan layar tersebut.

## 6. Pengguna memeriksa transaksi

1. Membuka Transactions.
2. Memfilter tanggal atau status.
3. Memilih satu transaksi.
4. Membaca detail transaksi.
5. Kembali ke daftar transaksi.

## 7. Pengguna mengelola akun

1. Membuka menu akun.
2. Memilih Profile, Security, atau Preferences.
3. Mengubah preferensi yang tersedia.
4. Mendapatkan feedback berhasil/gagal pada elemen yang relevan.
5. Memilih Sign out dan mengonfirmasi.

## 8. Prinsip navigasi

- CTA utama terlihat jelas.
- Pengguna selalu dapat kembali ke halaman induk.
- Setelah tindakan, berikan feedback dan arah berikutnya.
- Hindari redirect tanpa penjelasan.

## 9. Instalasi dan penggunaan offline PWA

1. Pengunjung membuka situs saat online; service worker mengelola hanya aset publik allowlisted dan offline fallback aman.
2. Jika browser mendukung install, UI boleh menawarkan instalasi tanpa memaksa pengguna.
3. Saat offline, tampilkan pesan bahwa data akun memerlukan koneksi. Jangan menyajikan dashboard lama, wallet, usage, transaksi, atau credential dari cache.
4. Saat worker baru tersedia, beri tahu pengguna dan tawarkan pembaruan dengan aman. Jangan reload hingga menghilangkan perubahan form tanpa pemberitahuan.
5. Saat koneksi pulih, tampilkan status tersambung; data disebut terbaru hanya setelah Backend API request berhasil.

Manifest values, cache strategy, worker lifecycle, dan copy platform masih `PENDING`; ikuti batas di `09-frontend-architecture.md`.

## 10. Batas teknologi dalam journey

- Blade merender setiap halaman dan komponen.
- Livewire memberi interaksi UI; otorisasi tetap di server dan data bisnis tetap milik Backend API.
- Clerk menangani identity lifecycle; Laravel memverifikasi sesi menurut kontrak resmi.
- LiteLLM tidak diakses pengguna melalui browser; pemakaian model mengikuti UI/kontrak Backend API.
- Redis tidak terlihat sebagai koneksi frontend. UI hanya menampilkan efek bisnis yang dikonfirmasi Backend API.
- JavaScript/Vite mengelola interaksi browser dan aset, bukan token atau business state.
