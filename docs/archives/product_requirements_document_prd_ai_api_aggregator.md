# Product Requirements Document (PRD): AI API Aggregator

## 1. Ringkasan Eksekutif (Executive Summary)
**Nama Proyek:** [Nama Platform Anda]
**Visi Produk:** Menyediakan akses prabayar yang terjangkau dan mulus ke berbagai model AI unggulan (LLM) melalui satu API Key tunggal. Layanan ini ditujukan bagi *developer* yang ingin menggunakan AI pada *coding tools* (seperti Cursor, Cline, atau IDE lainnya) tanpa harus berlangganan bulanan di setiap penyedia model AI.
**Value Proposition:** "Satu API Key, 40+ Model AI. Sistem prabayar tanpa langganan, langsung terhubung ke *coding tool* Anda."

## 2. Target Pengguna (Target Audience)
* **Software Engineers / Developers:** Membutuhkan akses ke AI canggih untuk bantuan pemrograman, namun merasa keberatan dengan biaya langganan bulanan yang mahal ($20/bulan/layanan).
* **AI Enthusiasts & Tinkerers:** Pengguna yang suka bereksperimen dengan berbagai model dari *provider* yang berbeda (OpenAI, Anthropic, Google, DeepSeek) tanpa harus mendaftar ke masing-masing platform.
* **Freelancers:** Membutuhkan kebebasan membayar hanya untuk token yang mereka gunakan (*pay-as-you-go / prepaid*).

## 3. Fitur Utama (Core Features)

### 3.1. Unified API Gateway
* **OpenAI-Compatible Endpoint:** Sistem harus mendukung format standar `/v1/chat/completions` milik OpenAI. Ini memastikan API bisa langsung di-*plug-and-play* ke ribuan *tools* yang sudah ada.
* **One API Key:** Pengguna hanya membuat satu kunci rahasia (*secret key*) di dalam dasbor platform untuk mengakses semua model dari 8+ penyedia (OpenAI, Anthropic, DeepSeek, Zhipu, Google, Meta, Xiaomi, dll.).
* **Auto-config Script:** Skrip CLI (contoh: `npx [nama-platform]`) untuk mengatur *environment variables* (`OPENAI_BASE_URL` dan `OPENAI_API_KEY`) secara otomatis di *environment* lokal pengguna.

### 3.2. Sistem Token & *Billing* Prabayar (Prepaid)
* **Paket Prabayar:** Tidak ada *auto-renewal* atau tagihan bulanan. Pengguna membeli paket token secara sekali putus (*one-time*).
* **Masa Aktif (Validity):** Saldo berlaku selama 30 hari sejak pembelian terakhir. Melakukan *top-up* otomatis akan memperpanjang masa aktif seluruh saldo token.
* **Multiplier Rate (Nilai Tukar Model):** Karena harga dasar (modal) setiap model AI berbeda-beda dari penyedia aslinya, platform menggunakan sistem "*Usage Rate*".
  * *Contoh: Token dasar = 1x. DeepSeek mungkin menggunakan rate 0.3x (lebih murah), sedangkan GPT terbaru mungkin menggunakan rate 12x (lebih mahal).*
* **Metode Pembayaran:** Terintegrasi dengan gerbang pembayaran lokal dan kripto (Contoh: QRIS untuk IDR dan USDT untuk Kripto).

### 3.3. Dashboard Pengguna
* **Manajemen API Key:** Membuat, mencabut (*revoke*), dan menyalin API key.
* **Pantauan Penggunaan (Usage Analytics):** Menampilkan grafik sisa token, riwayat penggunaan berdasarkan model, dan waktu (*timestamp*).
* **Top-up Saldo:** Halaman untuk memilih paket dan melakukan pembayaran.

### 3.4. Transparansi & Privasi
* **Live Server Stats:** Halaman muka (Homepage) yang menampilkan angka otomatis: Total token diproses, jumlah model aktif, rata-rata *latency*, dan *success rate*.
* **Zero-Logging Policy:** Platform **TIDAK Boleh** menyimpan *prompt* pengguna atau balasan dari AI. Hanya menyimpan *metadata* (jumlah token yang dihabiskan, status gagal/sukses, dan waktu) untuk keperluan penagihan. Enkripsi TLS wajib diterapkan.

## 4. Alur Pengguna (User Flow)
1. **Registrasi:** Pengguna mendaftar akun menggunakan Email/Password atau OAuth (Google/GitHub).
2. **Top-up Awal:** Pengguna diarahkan ke halaman *Pricing*, memilih paket (misal: "Lite Plan" seharga $1.18 untuk 20M Token), dan membayar via QRIS/USDT.
3. **Generate Key:** Setelah pembayaran berhasil, pengguna masuk ke Dasbor dan membuat *API Key*.
4. **Integrasi:** Pengguna menyalin *Base URL* platform dan *API Key*, lalu memasukkannya ke *settings* aplikasi *coding* mereka (misal: Cursor IDE).
5. **Konsumsi:** Pengguna meminta *prompt* di aplikasi mereka. Platform meneruskan (*proxy*) permintaan tersebut ke penyedia asli (misal: Anthropic), menerima balasan, mengurangi saldo token pengguna sesuai *rate* model, lalu mengirimkan balasan ke aplikasi pengguna.

## 5. Rencana Paket Harga (Pricing Strategy)
*(Harga ditampilkan dalam USD tetapi bisa dikonversi ke IDR pada saat *checkout*)*
* **Lite:** $1.18 (20M + 5M Bonus Token)
* **Plus:** $2.89 (50M + 15M Bonus Token)
* **Pro:** $5.71 (100M + 35M Bonus Token)
* **Max:** $11.12 (200M + 70M Bonus Token)
* **Ultra:** $16.42 (300M + 105M Bonus Token)
* **Titan:** $22.89 (430M + 150M Bonus Token)

## 6. Persyaratan Teknis & Arsitektur
* **Backend Framework:** Node.js, Go, atau Python (FastAPI/LiteLLM) yang mampu menangani *high concurrency* (banyak permintaan secara bersamaan) dengan *latency* sangat rendah.
* **Database:** PostgreSQL (untuk pengguna, *billing*, histori transaksi) dan Redis (untuk *caching*, validasi API key super cepat, dan *rate limiting*).
* **AI Proxy Server:** Bisa menggunakan solusi *open-source* seperti **LiteLLM** atau **Songer** yang sudah memiliki fitur penerjemahan API format OpenAI ke provider lain secara otomatis (mengurus masalah *routing* dan *token counting*).
* **Payment Gateway:** Midtrans / Xendit (untuk QRIS IDR), dan prosesor pembayaran Crypto (seperti NowPayments atau Coinbase Commerce) untuk USDT.
* **Frontend:** React, Next.js, atau Vue (Tailwind CSS) untuk antarmuka yang cepat dan modern.

## 7. Risiko & Mitigasi
* **Penyalahgunaan API (Abuse):** Pengguna dengan *script* bot yang menghabiskan *rate limit* API Master (Kunci AI asli platform). *Mitigasi:* Terapkan *Rate Limiting* (Requests Per Minute/RPM) ketat di level API Gateway per akun pengguna.
* **Fluktuasi Harga Model:** *Provider* AI asli sering mengubah harga API mereka. *Mitigasi:* Dasbor admin untuk mengubah *Multiplier Rate* setiap model kapan saja tanpa memutus layanan.
* **Downtime Provider AI:** API OpenAI atau Anthropic bisa tumbang dari pusat. *Mitigasi:* Sistem deteksi *error* yang baik dan memberikan pesan balasan standar (JSON yang kompatibel dengan format OpenAI) yang menjelaskan bahwa model asal sedang *down*.