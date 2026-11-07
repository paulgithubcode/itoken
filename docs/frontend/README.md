# iToken — Dokumentasi Frontend

Dokumentasi ini menjadi acuan untuk merancang dan mengembangkan frontend iToken: halaman, komponen, navigasi, localization, PWA, serta batas integrasi dengan layanan identitas dan AI.

## Tujuan produk

iToken adalah platform akses terpadu ke berbagai model AI dengan konsep prabayar. Pengguna ditujukan terutama untuk developer, AI enthusiasts, dan freelancer yang ingin memakai beragam model AI melalui satu akun dan satu API key platform.

**Pesan utama produk:** Satu API Key untuk mengakses berbagai model AI, dengan sistem prabayar tanpa langganan bulanan.

## Cakupan dokumen

| Dokumen | Isi |
|---|---|
| `01-product-ui.md` | Identitas produk, target pengguna, prinsip pengalaman |
| `02-page-inventory.md` | Daftar halaman publik dan halaman akun |
| `03-design-system.md` | Arah visual, warna, tipografi, spacing, komponen |
| `04-user-journeys.md` | Alur pengguna dari pengunjung sampai pengguna dashboard |
| `05-components-and-interactions.md` | Komponen dan perilaku antarmuka |
| `06-content-and-mock-data.md` | Konten, label, data demonstrasi, dan aturan penyajiannya |
| `07-responsive-accessibility.md` | Responsif, aksesibilitas, dan PWA dari sisi pengalaman |
| `08-ui-acceptance-checklist.md` | Kriteria penerimaan hasil UI |
| `09-frontend-architecture.md` | Peran teknologi, batas integrasi Clerk/LiteLLM/Redis, data flow UI, keamanan, dan spesifikasi PWA |

## Technology stack resmi

- **Laravel 13** menangani aplikasi web dan server-side rendering.
- **Blade** menyusun halaman, layout, dan komponen UI.
- **Livewire 4** menyediakan interaksi server-driven untuk UI; aksi bisnis tetap harus melalui Backend API.
- **Tailwind CSS 4** menyediakan utility styling dan design tokens.
- **JavaScript** dipakai seperlunya untuk interaksi browser dan PWA.
- **Vite** memproses dan menyajikan aset frontend.
- **Clerk** adalah Identity Provider untuk autentikasi pengguna.
- **LiteLLM** adalah komponen AI gateway yang direncanakan untuk routing model; batas layanan dan integrasinya masih mengikuti kontrak Backend API.
- **Redis** adalah komponen infrastruktur server-side; pemakaian spesifiknya belum ditetapkan.
- **PWA** wajib, dengan offline access yang terbatas pada aset publik dan fallback aman.

Rincian kepemilikan dan batas data setiap teknologi ada di [`09-frontend-architecture.md`](09-frontend-architecture.md).

## Batas dokumentasi dan integrasi

- Dokumen ini membahas frontend dan kontraknya dengan Clerk/Backend API, bukan implementasi layanan backend.
- Frontend tidak memiliki database bisnis, tidak mengakses database Backend API secara langsung, dan tidak menjalankan pembayaran sungguhan.
- Clerk menangani signup, login, logout, email verification, password, dan OAuth; Laravel memverifikasi autentikasi di server dan mengelola secure application session sesuai kontrak resmi.
- LiteLLM dan Redis bukan layanan yang dipanggil langsung browser. Peran, endpoint, credential, cache behavior, serta data yang diekspos ke UI harus mengikuti kontrak backend yang disepakati.
- Semua mock data harus ditandai. Mock tidak boleh terlihat seperti akun, model aktif, pembayaran, saldo, atau transaksi nyata.
- Detail yang belum disepakati ditandai `PENDING`. Jangan mengarang endpoint, payload, response, token flow Clerk, atau mekanisme LiteLLM/Redis.
- Dokumen arsip PecutOpus AI Gateway adalah referensi historis saja. Gunakan nama **iToken** dan keputusan terbaru pada semua dokumen aktif.

## Konteks implementasi UI

Stack proyek frontend yang telah dipilih:
- Laravel 13
- Livewire 4
- Blade
- Tailwind CSS 4
- JavaScript seperlunya
- Vite
- Clerk, LiteLLM, Redis, dan PWA sesuai batas pada dokumen arsitektur

Preferensi tampilan yang telah ditetapkan:
- Light theme
- Bahasa Indonesia sebagai default
- Bahasa Inggris dan Mandarin Sederhana sebagai pilihan
- PWA
- Tampilan ringan dan responsif

Default locale adalah Bahasa Indonesia (`id`); English (`en`) dan Simplified Chinese (`zh_CN`) juga wajib didukung. Semua teks UI, termasuk state interaksi dan PWA, harus memiliki terjemahan.

Dokumen ini tidak mengubah keputusan stack tersebut.
