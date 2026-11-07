# Spesifikasi Desain Database & Arsitektur Keamanan
**Platform:** AI API Aggregator (PecutOpus Clone)
**Database Engine:** PostgreSQL 14+ / 16 (Compatible with Cloud SQL, Supabase, Neon)
**Caching Layer:** Redis 7 (In-Memory Key Lookup & Rate Limiting)

---

## 1. Ikhtisar Arsitektur Database (Executive Summary)
Database dirancang dengan normalisasi Third Normal Form (3NF) yang ketat untuk menangani konkurensi tinggi, integritas saldo keuangan prabayar, dan perlindungan privasi zero-logging.

### 11 Tabel Inti:
1. `roles`: Definisi peran sistem (super_admin, admin, developer_user)
2. `permissions`: Granular privileges per modul
3. `role_permissions`: Relasi N:M antara role dan hak akses
4. `users`: Akun pengguna dengan password hash Argon2id dan proteksi brute force lockout
5. `user_oauth_accounts`: Tautan OAuth Google & GitHub
6. `user_sessions`: Sesi aktif & hash refresh token
7. `developer_api_keys`: Penyimpanan aman API Key (Hanya menyimpan hash SHA-256)
8. `token_wallets`: Saldo token prabayar dengan masa aktif 30 hari & optimistic lock version
9. `pricing_tiers`: Katalog paket Lite hingga Titan
10. `invoices`: Catatan tagihan pembayaran QRIS (Midtrans/Xendit) & USDT
11. `token_ledger_transactions`: Double-entry immutable accounting ledger
12. `ai_providers`: Registri penyedia hulu (OpenAI, Anthropic, DeepSeek, Google)
13. `ai_models`: Katalog 40+ model AI dengan Multiplier Rate dinamis
14. `api_usage_logs`: Metadata pemakaian token (Zero prompt retention)
15. `audit_logs`: Jejak audit forensik tindakan administrator

---

## 2. Pemisahan Hak Akses (PostgreSQL Row-Level Security / RLS)
Pemisahan hak akses ditegakkan di level mesin database:
* **Tampilan Pengguna (Developer):**
  - Hanya dapat membaca profil sendiri (`id = auth.uid()`).
  - Hanya dapat membaca & mengelola API Key miliknya sendiri.
  - Hanya dapat membaca saldo dompet miliknya sendiri (`token_wallets`). Dilarang melakukan `UPDATE` langsung!
  - Hanya dapat membaca metadata log pemakaian miliknya sendiri.
* **Tampilan Administrator:**
  - Membaca telemetri sistem global.
  - Memperbarui `ai_models.multiplier_rate` kapan saja tanpa downtime.
  - Melakukan penyesuaian saldo manual dengan catatan audit wajib.
  - Mengaudit log tindakan keamanan.
* **Service Gateway Proxy (Least Privilege):**
  - Memvalidasi hash API key di `developer_api_keys`.
  - Memanggil Stored Procedure `deduct_user_token_atomic()` dengan baris terkunci (`SELECT FOR UPDATE`).
  - Menulis metadata pemakaian ke `api_usage_logs`.

---

## 3. Autentikasi & Penyimpanan Kredensial Aman
1. **Password Hash:** Argon2id (m=65536, t=3, p=4) dengan salt acak 16 byte.
2. **API Key Hash:** Format `sk_live_[prefix]_[secret]`. Plaintext secret hanya diberikan 1x kepada pengguna dan tidak pernah disimpan di database. Database hanya menyimpan hash SHA-256.
3. **Pencegahan Brute Force:** Counter `failed_login_attempts` menggembok akun (`locked_until`) selama 15 menit jika 5x gagal berturut-turut.
4. **Pencegahan Race Condition:** Menggunakan baris kunci `SELECT ... FOR UPDATE` di tabel `token_wallets` untuk mencegah double-spending ketika Cursor mengirim banyak request *autocomplete* paralel.

---

## 4. Kebijakan Zero-Logging (Privasi Developer)
Tabel `api_usage_logs` **tidak memiliki kolom prompt maupun response AI**. Yang disimpan murni:
- `prompt_tokens` & `completion_tokens` (angka)
- `multiplier_applied` (angka)
- `billed_platform_tokens` (angka)
- `duration_ms` (angka)
- `status_code` (200, 429, 500)
- `ip_origin_masked` (contoh: 114.125.xxx.xxx)
