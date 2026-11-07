# 06 — Konten dan Data Demonstrasi

Mock data adalah data presentasi untuk membangun UI. Data tersebut bukan seed bisnis dan tidak membuktikan model, harga, saldo, transaksi, provider, maupun endpoint tersedia.

## 1. Bahasa

Bahasa antarmuka:
- Default: Bahasa Indonesia (`id`).
- English (`en`).
- 简体中文 (`zh_CN`).

Ketentuan:
- Semua teks UI harus memiliki padanan pada ketiga bahasa.
- Gunakan istilah yang konsisten.
- Hindari mencampur bahasa dalam satu kalimat kecuali istilah teknis umum.
- Format angka, tanggal, dan mata uang menyesuaikan locale.
- Jangan menerjemahkan nama model, nama provider, kode, endpoint, dan identifier.

## 2. Istilah UI yang disarankan

| Konsep | Indonesia | English |
|---|---|---|
| Dashboard overview | Ringkasan | Overview |
| Wallet | Dompet Token | Wallet |
| Top up | Isi Saldo | Top Up |
| API keys | API Key | API Keys |
| Usage | Penggunaan | Usage |
| Transactions | Transaksi | Transactions |
| Models | Model AI | Models |
| Pending | Menunggu | Pending |
| Paid | Dibayar | Paid |
| Expired | Kedaluwarsa | Expired |
| Revoked | Dicabut | Revoked |

## 3. Konten yang bersumber dari arsip

Poin produk yang dapat menjadi dasar copy:
- Satu API key platform untuk berbagai model.
- Sistem prabayar tanpa auto-renewal.
- Model dari beberapa provider dalam satu katalog.
- Target pengguna developer dan AI enthusiasts.
- Integrasi penggunaan dengan coding tools seperti Cursor dan Cline.
- Transparansi saldo dan pemakaian.
- Kebijakan tidak menyimpan isi prompt dan respons AI.

Jangan menambahkan klaim seperti “40+ model aktif”, “99.99% uptime”, atau angka statistik aktual tanpa data yang sudah disetujui.

## 4. Paket harga arsip

Arsip memuat contoh paket berikut:

| Paket | Harga arsip | Token utama | Bonus |
|---|---:|---:|---:|
| Lite | USD 1.18 | 20M | 5M |
| Plus | USD 2.89 | 50M | 15M |
| Pro | USD 5.71 | 100M | 35M |
| Max | USD 11.12 | 200M | 70M |
| Ultra | USD 16.42 | 300M | 105M |
| Titan | USD 22.89 | 430M | 150M |

**Penting:** tabel ini hanya referensi dari dokumen arsip. Jangan menganggap harga, kuota, bonus, mata uang checkout, atau masa berlaku tersebut sebagai keputusan final. Sebelum dipakai pada tampilan publik, tandai dan konfirmasi nilainya.

## 5. Data demo yang diperbolehkan

Untuk pengembangan UI, data contoh dapat mencakup:
- Nama model dan provider contoh.
- Paket harga dengan label Demo.
- Saldo contoh dengan label Demo.
- Baris transaksi fiktif dengan label Demo.
- Grafik pemakaian sintetis dengan label Demo.
- API key placeholder yang tidak dapat digunakan.

### Data katalog yang sedang dipakai untuk preview

Mock frontend saat ini menampilkan model `GPT-4o`, `Claude 3.5 Sonnet`, `DeepSeek Chat`, `Gemini 1.5 Flash`, `GPT-4o mini`, dan `DeepSeek Reasoner`, beserta nama provider dan context-window contoh. Setiap kartu harus menyatakan bahwa ketersediaan dan spesifikasi belum dikonfirmasi. Nilai context tidak boleh dipakai sebagai klaim produk.

Mock pricing menampilkan paket Lite/Plus/Pro dengan nilai contoh IDR 19.000/46.000/92.000, kredit 20M/50M/100M, bonus 5M/15M/35M, dan validity 30 hari. Sebagian angka ini berasal dari arsip historis. Semua nilainya hanya untuk preview, diberi label `DEMO`, dan tidak mewakili keputusan harga, kuota, mata uang checkout, bonus, atau masa berlaku final iToken.

### Mock state integrasi

- Clerk: boleh mendemonstrasikan layout form, loading, validation, error, dan verification pending. Jangan mock state `authenticated`, email verified, atau sukses signup sebagai fakta; jangan mengumpulkan password atau credential sungguhan pada demo.
- Backend API/LiteLLM: boleh menampilkan katalog sintetis dan status `DEMO`; jangan menampilkan provider aktif, latency, success rate, usage, atau output model sebagai live.
- Redis: jangan tampilkan cache hit, key, TTL, atau status koneksi Redis sebagai UI. Tujuan Redis dan data yang digunakan `PENDING`.
- Payment: boleh menampilkan pilihan paket simulasi; jangan membuat invoice palsu, countdown pembayaran, detail QR/transfer, atau status Paid/Success.
- API key: gunakan placeholder yang jelas tidak valid, misalnya `DEMO_KEY_NOT_VALID`; hindari string yang tampak seperti credential produksi.
- PWA: status offline/install/update boleh disimulasikan untuk layout dengan label demo. Cache offline tidak boleh berisi data pribadi atau business mock yang menyerupai snapshot akun.

Jangan membuat:
- Secret API key yang tampak valid.
- Prompt atau completion fiktif yang seolah-olah merupakan riwayat pengguna.
- Pembayaran sukses palsu.
- Statistik publik palsu yang ditampilkan sebagai live.
- Model atau status aktif yang belum dikonfirmasi.

## 6. Format tampilan

- Gunakan pemisah ribuan sesuai locale.
- Selalu tampilkan satuan token.
- Harga selalu disertai mata uang.
- Timestamp menampilkan tanggal dan waktu secara jelas.
- Nilai kosong ditampilkan sebagai `—` atau empty state yang sesuai, bukan angka nol yang menyesatkan.

## 7. Sumber data menurut teknologi

- Halaman publik dapat memakai content copy dan mock data lokal selama diberi label yang sesuai.
- Setelah integrasi, data bisnis harus berasal dari Backend API melalui Laravel, bukan local database, file mock, atau Redis yang dibaca langsung.
- Clerk adalah sumber identity lifecycle; data identitas yang dikirim browser tanpa verifikasi server bukan sumber yang dipercaya.
- LiteLLM berperan pada lapisan AI gateway server-side. UI hanya menggunakan data yang secara eksplisit diekspos melalui kontrak Backend API.
- Vite asset manifest, service worker cache, dan browser storage bukan tempat menyimpan business state.
- Isi prompt/completion tidak boleh dipakai sebagai mock history. Zero-logging tetap berlaku pada konten, analytics, telemetry, dan PWA.

Semua schema/API contract, source freshness, dan sinkronisasi data tetap `PENDING` sampai disepakati.
