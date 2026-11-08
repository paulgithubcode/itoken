# iToken Frontend — Indeks Dokumentasi

Dokumen di direktori ini adalah acuan resmi UI/UX dan implementasi frontend iToken. Gunakan bahasa Indonesia untuk dokumentasi dan konten antarmuka, dengan dukungan locale `id` (default), `en`, dan `zh_CN`.

## Dokumen kanonis

| Dokumen | Isi |
|---|---|
| [01 — Technology Stack](01-technology-stack.md) | Peran teknologi, kepemilikan, dan batas frontend/backend |
| [02 — Frontend Architecture](02-frontend-architecture.md) | Arsitektur komponen, data flow, keamanan, dan integrasi |
| [03 — Design System](03-design-system.md) | Token visual, tema Public/Dashboard, komponen dan aksesibilitas |
| [04 — Public Website](04-public-website.md) | Homepage sebagai prioritas visual, seluruh halaman publik, navigasi dan journeys |
| [05 — Customer Dashboard](05-customer-dashboard.md) | Dashboard, overview dan navigasi area pengguna |
| [06 — Authentication](06-authentication.md) | UI Clerk dan persyaratan verifikasi autentikasi server-side |
| [07 — Product Features](07-product-features.md) | Wallet, billing, transactions, API keys, models, usage dan settings |
| [08 — PWA](08-pwa.md) | Manifest, icons, service worker, caching, offline, install dan update |
| [09 — Implementation Roadmap](09-implementation-roadmap.md) | Stage 0–9, dependensi, deliverable, acceptance dan status |
| [10 — Acceptance Checklist](10-acceptance-checklist.md) | Checklist lintas halaman, integrasi, aksesibilitas, PWA dan rilis |
| [11 — SEO dan SEM](11-seo-sem.md) | Metadata, indexability, sitemap, structured data, kampanye dan pengukuran |

## Status implementasi

Gunakan label berikut di semua dokumen:

- **Completed — UI:** tampilan dan interaksi frontend tersedia.
- **Completed — Local:** fungsi berjalan lokal di browser, misalnya localStorage.
- **Completed — Integrated:** terhubung ke backend/provider dan telah diverifikasi.
- **Demo:** data atau proses simulasi, bukan data operasional.
- **Partial:** hanya sebagian spesifikasi yang tersedia.
- **Pending:** belum diimplementasikan.
- **Not Verified:** belum diverifikasi dengan metode yang sesuai.

Status implementasi dipisahkan dari status test/build/browser. Halaman atau tombol saja tidak cukup untuk menyebut proses bisnis selesai. Lihat [09 — Implementation Roadmap](09-implementation-roadmap.md) untuk status terkini.

## Aturan menggunakan dokumentasi

- Roadmap menentukan urutan implementasi; **Public Website dan homepage menjadi prioritas tampilan pertama**. PWA direncanakan sejak awal dan diverifikasi pada Stage 8.
- Stack repository: Laravel 13, Blade, Livewire 4 dependency, Tailwind CSS 4, Vanilla JavaScript ES modules, dan Vite. Halaman yang diaudit memakai Blade/Vanilla JS untuk interaksi; Livewire belum dipakai signifikan. Jangan menambah React, Vue, Next.js, atau Inertia.js tanpa keputusan arsitektur baru.
- Clerk adalah Identity Provider. LiteLLM dan Redis adalah infrastruktur/backend dan tidak diakses browser secara langsung.
- Frontend tidak memiliki database bisnis. Saat ini dashboard/business UI masih DEMO dan belum terhubung ke Backend API. Jika integrasi disetujui, Laravel menjadi perantara; jangan mengarang endpoint, payload, credential flow, response, atau perilaku layanan.
- Tandai data sintetis dan interaksi yang belum terintegrasi sebagai **Demo**. Tandai keputusan atau kontrak yang belum disepakati sebagai **Pending**.
- Jangan menyatakan pembayaran, saldo, model, API key, penggunaan, sesi, atau status layanan aktif bila hanya berupa mock.
- Pertahankan zero-logging prompt/completion dan jangan cache data privat di PWA.
- Public Website dan Dashboard menggunakan preferensi tema global Light/Dark/System; System mengikuti preferensi OS. Public Header menyediakan switcher desktop/mobile, Dashboard Settings menyediakan pengaturan tema, dan `window.iTokenTheme` mengelola preferensi dengan key utama `itoken.theme`.
- `itoken.dashboard.theme` hanya legacy key untuk migrasi dan bukan key utama tema saat ini.
- Dokumen lama di `docs/archives/` adalah referensi historis PecutOpus, bukan spesifikasi aktif iToken.

## Status saat konsolidasi

Status implementasi terkini dan kebutuhan verifikasi terdapat di `09-implementation-roadmap.md` dan `10-acceptance-checklist.md`. Clerk server verification dan Backend API integration masih Pending; UI DEMO bukan fitur operasional. Browser responsive/accessibility/PWA belum diverifikasi dalam sinkronisasi dokumen ini.
