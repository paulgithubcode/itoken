# 07 — Product Features dan Batas Integrasi

Semua fitur di bawah adalah cakupan UI produk. UI/mock dapat dibuat sebelum integrasi, tetapi hanya Backend API yang menjadi sumber business state. Tidak ada backend/payment/Clerk/LiteLLM/Redis integration yang diasumsikan aktif.

| Fitur | Kebutuhan UI | Data/action nyata | Mock/demo boundary |
|---|---|---|---|
| Wallet & Balance | Placeholder Wallet dan ringkasan balance fiktif pada Overview/Billing | Backend API belum terhubung | **Demo/Partial**; bukan saldo pengguna |
| Top Up & Payment UI | Nominal, empat metode, ringkasan, kembali/batal, instruksi ilustratif per metode | Backend API/payment gateway belum terhubung | **Demo**; tidak memproses pembayaran, mengubah saldo, atau membuat kredensial pembayaran |
| Transactions | Placeholder route; tabel transaksi sintetis berada di Billing dengan filter/pagination/detail | Backend API belum terhubung | **Demo/Partial**; seluruh baris fiktif |
| API Key Management | Search/status, create/detail/revoke pada daftar masked DEMO lokal | Backend API/secret lifecycle belum terhubung | **Demo**; tidak membuat secret/key aktif dan tidak persist ke server |
| Model Catalog | Public model cards/search/provider filter pada dataset lokal; dashboard Models placeholder | Backend API belum terhubung | **Demo/Partial**; bukan katalog aktif |
| Usage & Analytics | Periode, summary, dua grafik SVG, search/model/status dan pagination | Backend API belum terhubung | **Demo**; data sintetik lokal, tanpa prompt/completion |
| Logs | Search/filter status/HTTP/model/periode, pagination dan modal detail teredaksi | Backend API belum terhubung | **Demo**; record fiktif dan tidak mewakili request akun |
| Developer Documentation | Public docs berisi quickstart/code sample placeholder; dashboard Developer Docs placeholder | API/SDK contract belum tersedia | **Partial**; bukan dokumentasi endpoint operasional |
| Profile & Account Settings | Tema global Light/Dark/System, density, table rows, reset, dan edit profil/foto/WhatsApp lokal | Clerk/Backend API belum terhubung | **Completed — Local** untuk preferensi/profil demonstrasi; tema dikelola melalui `window.iTokenTheme` dan bukan data akun server |
| Security | Tidak ada kontrol security operasional saat ini | Clerk/Backend API belum terhubung | **Pending**; jangan klaim password/MFA/session feature aktif |
| How It Works / FAQ | Edukasi produk, konsep credit, privasi, integrasi | Public copy yang disetujui | Jelaskan konsep; hindari menyatakan detail bisnis belum disahkan sebagai final |
| Service Status | Public status placeholder | Status source/API belum terhubung | **Demo/Partial**; bukan health monitor atau uptime live |

Semua business feature pada tabel belum **Completed — Integrated**. Label **Completed — UI** berarti antarmuka tersedia; **Completed — Local** hanya untuk perilaku browser yang bekerja lokal. Tidak satu pun status tersebut berarti backend/provider integration.

## Batas LiteLLM dan Redis

- LiteLLM berada di backend sebagai AI gateway/provider layer. Frontend tidak membuka browser connection ke LiteLLM atau upstream providers.
- Model names, metadata, rates, status, usage, errors/fallbacks yang ditampilkan harus berasal dari kontrak Backend API.
- Redis menjalankan cache, queue, dan temporary storage di backend. Frontend tidak mengakses Redis keys atau menentukan TTL/invalidation.
- UI hanya menampilkan dampak seperti freshness/status jika Backend API memberi field dan definisi yang disepakati.
- Infra failover, cache warmup, queue behavior, streaming, model request formats, dan provider credentials tetap tanggung jawab backend.

## Cross-feature states

Semua data pages memerlukan loading/empty/error/retry/permission-denied state. Stale/last updated hanya ditampilkan jika API contract mendefinisikan timestamp/freshness. Browser offline tidak boleh memakai data privat lama untuk menutupi error. Destructive actions memiliki confirmation dan hanya dilaksanakan setelah kontrak tersedia.
