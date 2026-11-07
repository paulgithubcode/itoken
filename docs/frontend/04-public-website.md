# 04 — Public Website

## 1. Tujuan dan prioritas

Public Website menjelaskan nilai iToken sebelum login dan membawa pengunjung ke eksplorasi model, harga, petunjuk, dan FAQ. **Homepage adalah prioritas visual pertama**: proposisi nilai harus dipahami cepat, CTA terlihat, dan seluruh data yang belum final ditandai DEMO/PENDING.

Public Website dan Customer Dashboard berbagi logo, light theme, type scale, spacing, color tokens, buttons, cards, badges, forms, dan accessibility patterns. Public navigation dan dashboard navigation boleh berbeda untuk tujuan tugas.

### Pengguna dan nilai utama

- Pengguna sasaran: software engineers/developers, AI enthusiasts, dan freelancers.
- Satu platform untuk mengeksplorasi model dari provider yang berbeda.
- Konsep satu platform API key untuk menggunakan model adalah business credential dan **berbeda dari identity/auth credential Clerk**.
- Konsep kredit prabayar dan transparansi penggunaan harus mudah dipahami; detail final kredit, pricing, dan masa berlaku tetap menunggu persetujuan produk/backend.
- Developer dapat menemukan dokumentasi dan detail teknis yang sudah disetujui tanpa membuat kontrak API sendiri.

## 2. Inventaris dan status route

Route publik yang tersedia pada implementasi saat ini:

| Halaman | Route saat ini | Tujuan/isi | Sumber data/status |
|---|---|---|---|
| Homepage | `/` | Hero, manfaat, model unggulan, konsep kredit, ringkasan pricing, metode pembayaran informasional, developer value, FAQ | Copy statis; model/pricing mock berlabel DEMO; metode pembayaran hanya rencana visual |
| Models | `/models` | Search, filter provider, cards, category/context | Mock; bukan katalog aktif |
| Pricing | `/pricing` | Paket, bonus, masa berlaku demo, FAQ | Mock; bukan penawaran dan tidak memulai payment |
| Documentation | `/docs` | Overview, quickstart placeholder, model info, code examples, security | Placeholder; bukan API contract |
| How It Works | Section homepage (saat ini tidak memiliki target `#how-it-works`) | Konsep jelajah model, kredit, penggunaan | **Partial**; section ada, anchor yang didokumentasikan belum tersedia |
| FAQ | `/faq` | Pertanyaan umum produk | Copy statis, sebagian jawaban masih Pending |
| About | `/about` | Tujuan dan prinsip iToken | Copy produk; bukan klaim service availability |
| Contact | `/contact` | Kanal resmi atau placeholder | Kanal kontak belum ditentukan; jangan pura-pura mengirim pesan |
| Terms | `/terms` | Informasi legal | Placeholder sampai disetujui pihak terkait |
| Privacy | `/privacy` | Informasi privasi | Placeholder; zero-logging menjadi ketentuan, legal copy resmi Pending |
| Status | `/status` | Ringkasan status | Saat ini belum terhubung ke source status; tidak ada uptime/live health claim |
| 404 | Fallback route | Pesan dan kembali ke homepage | UI lokal |

Route yang belum tersedia atau berubah harus diperbarui di dokumen sebelum link publik diarahkan ke sana. Jangan membuat route integrasi/API berdasarkan asumsi.

## 3. Homepage sections

Urutan visual yang disepakati:

1. **Header:** logo, Models, Pricing, Documentation, FAQ, About/Contact sesuai ruang, language selector, CTA. Sign in/Get started menuju Clerk hanya ketika flow tersedia; jika tidak gunakan CTA eksplorasi yang benar-benar hidup.
2. **Hero:** satu platform untuk berbagai model, penjelasan ringkas, CTA ke katalog dan pricing.
3. **Benefits:** katalog terpadu, konsep prabayar, transparansi penggunaan, developer-friendly, privasi.
4. **Public stats:** total token, model aktif, latency, success rate hanya jika Backend API menyediakan data valid; jika tidak sembunyikan atau pakai placeholder yang sangat jelas.
5. **Featured models:** kartu model dengan provider/kemampuan; data mock tidak mengklaim aktif.
6. **How It Works:** konsep produk tiga langkah, bukan autentikasi/payment operasional.
7. **Pricing preview:** beberapa package demo dan link ke `/pricing`.
8. **Developer section:** dokumentasi, contoh ilustratif dan batas integrasi.
9. **Privacy statement:** zero-logging prompt/completion.
10. **FAQ preview** dan **footer** yang memiliki semua tautan route valid.

Homepage tidak menampilkan saldo akun, key aktif, transaksi, statistik live, atau tombol pembelian yang berfungsi seolah-olah produk sudah operasional.

## 4. Models

- Search client-side pada dataset demo; provider filter memiliki “All” dan empty state.
- Card menampilkan nama model/provider, category/capability, context bila terkonfirmasi, status, multiplier/pricing hanya bila tersedia.
- Semua mock diberi `DEMO · availability unconfirmed`.
- Detail model merupakan bagian inventaris; route/detail schema masih Pending sampai kebutuhan halaman dan data API disetujui. Jangan membangun endpoint atau klaim dari LiteLLM.
- CTA ke dokumentasi atau section katalog yang benar-benar tersedia.

## 5. Pricing

- Kartu menampilkan nama paket, currency, kredit dasar, bonus, masa berlaku, dan total hanya bila formula disepakati.
- Nilai dari arsip adalah historical reference, bukan harga iToken.
- Semua nilai mock diberi label DEMO dan disclaimer “bukan harga final”.
- Paket ditandai DEMO; pemilihan mock dapat membuka dialog yang jelas menyatakan tidak ada invoice/payment.
- Homepage menampilkan empat metode pembayaran sebagai informasi rencana saja; tidak ada pilihan, QR, rekening, atau alur pembayaran di halaman publik.
- Tombol pembelian nyata menunggu Backend API/payment contract.

## 6. Documentation, FAQ, dan informasi publik

- Documentation menggunakan sidebar/TOC, heading berurutan, code block dengan copy feedback, dan placeholder yang aman.
- Tidak mengarang base URL, endpoint, request/response, SDK, token flow, rate limit, atau provider configuration.
- Contoh code hanya pseudocode/placeholder non-credential dan diberi label.
- FAQ pakai native/keyboard accessible accordion.
- Terms/Privacy bukan kebijakan legal final sebelum disetujui.
- Contact tidak memakai form palsu. Status tidak menampilkan status Redis/LiteLLM internal atau uptime tanpa source yang disetujui.

## 7. Language, navigation, responsive

`id` default; `en` dan `zh_CN` harus mencakup seluruh copy dan UI states. Language selector konsisten desktop/mobile. Locale persistence server/account policy masih Pending; browser preference boleh disimpan sebagai data non-sensitif saja.

Public header horizontal di desktop dan drawer/menu pada mobile; tombol memiliki `aria-expanded`, nama accessible, focus, dan Escape behavior. Semua footer/header link harus menuju route/section yang tersedia. Tablet tidak boleh membuat nav/CTA bertabrakan.

## 8. Implementasi dan state

- Blade layouts/components menjadi sumber markup.
- Livewire tersedia sebagai dependency, tetapi public pages yang diperiksa memakai Blade dan JavaScript; belum ada interaksi Livewire signifikan.
- Tailwind CSS 4 menjaga tokens dan responsive layout.
- JavaScript/Vite mendukung search/filter mock, copy, locale dan drawer.
- Loading/error/empty states menjelaskan status; mock tidak menggantikan kegagalan layanan sebagai data nyata.
- Tidak ada Clerk, LiteLLM, Redis, payment, atau Backend API integrasi operasional pada public pages saat ini.
