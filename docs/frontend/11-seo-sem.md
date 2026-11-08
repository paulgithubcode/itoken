# 11 — SEO dan SEM

Dokumen ini mencatat kondisi frontend yang diperiksa pada 8 November 2026 dan kebijakan implementasi SEO/SEM iToken. SEO mengupayakan visibilitas organik melalui konten yang berguna, struktur yang dapat dirayapi, dan metadata yang jelas. SEM menggunakan iklan berbayar, misalnya Google Ads, untuk menjangkau pencarian yang relevan. Keduanya dapat mendatangkan calon pengguna; biaya dan konversi hanya berlaku untuk SEM berbayar.

## 1. Tujuan SEO dan SEM

- SEO: membantu orang menemukan informasi iToken yang benar melalui pencarian organik.
- Akuisisi: menjangkau developer dan pengguna lain yang mencari informasi model AI atau akses API.
- Konversi: mengarahkan pengunjung ke langkah yang benar-benar tersedia, seperti membaca dokumentasi atau menjelajahi pratinjau katalog. Pendaftaran, pembayaran, dan konsultasi belum menjadi funnel operasional.
- SEM: membeli penempatan iklan dan mengukur hasil kampanye. Iklan tidak menjamin peringkat organik.

## 2. Kondisi dan karakteristik website

Aplikasi adalah Laravel dengan halaman server-rendered Blade. Route yang benar-benar tersedia tercatat pada `routes/web.php`.

| Halaman | Route | Kondisi konten | Kebijakan saat ini |
|---|---|---|---|
| Home | `/` | Pratinjau produk; model dan paket merupakan demo | `index, follow`; masuk sitemap |
| Pricing | `/pricing` | Angka paket demo, bukan penawaran | `noindex, follow` sampai data final |
| Models | `/models` | Katalog contoh, spesifikasi/ketersediaan belum dikonfirmasi | `noindex, follow` |
| Docs | `/docs` | Orientasi dan placeholder, bukan kontrak API | `noindex, follow` |
| FAQ | `/faq` | Jawaban konsep produk, sebagian detail masih menunggu keputusan | `index, follow`; masuk sitemap |
| About | `/about` | Tujuan dan prinsip rancangan, tanpa klaim operasional | `index, follow`; masuk sitemap |
| Contact | `/contact` | Kanal dukungan belum diumumkan | `noindex, follow` |
| Terms | `/terms` | Placeholder, bukan ketentuan berlaku | `noindex, follow` |
| Privacy | `/privacy` | Placeholder; kebijakan resmi belum tersedia | `noindex, follow` |
| Status | `/status` | Belum terhubung ke pemantauan layanan | `noindex, follow` |
| 404 | Fallback route | Halaman tidak ditemukan, status HTTP 404 | `noindex, nofollow`; tanpa canonical dan sitemap |

`/login`, `/register`, `/forgot-password`, dan `/password-reset/instructions` adalah UI auth tanpa integrasi autentikasi operasional. `/dashboard/{section?}` adalah DEMO dan belum dilindungi autentikasi backend. Keduanya tidak menjadi target pencarian. `noindex` dan robots.txt bukan kontrol akses; jangan menyajikan data privat sebelum autentikasi server tersedia.

## 3. SEO On-Page

- Setiap halaman publik mempunyai title dan description sendiri melalui layout Blade; Open Graph dan Twitter Card memakai nilai halaman tersebut.
- Gunakan satu H1 deskriptif per halaman, urutan heading yang masuk akal, landmark (`header`, `nav`, `main`, `footer`), dan link/button sesuai fungsi.
- Gunakan internal link ke route yang tersedia. Jangan membuat link ke halaman produk/API yang belum ada.
- Gambar informatif memerlukan alt text kontekstual; gambar dekoratif memakai alt kosong/atribut dekoratif. Periksa aset saat gambar konten ditambahkan.
- Pertahankan URL route stabil dan sederhana. Redirect permanen perlu konfigurasi hosting/aplikasi ketika perubahan URL benar-benar diperlukan.
- Hindari copy generik/duplikat. Informasi demo, placeholder, harga, model, dan klaim harus jelas dan bermanfaat; finalisasi konten sebelum halaman diberi index.

## 4. Technical SEO

- **Origin/canonical:** origin produksi dikonfigurasi sebagai `https://itoken.id` di `config/services.php`, tidak dibaca dari host request atau `.env`. Canonical mengikuti path halaman dan mengabaikan query string, sehingga lingkungan lokal tidak mengeluarkan canonical `localhost`. Halaman 404 tidak memiliki canonical.
- **Sitemap:** `/sitemap.xml` menghasilkan XML untuk Home, About, dan FAQ saja. URL memakai origin produksi; tidak ada `lastmod` karena tanggal perubahan konten yang tepercaya belum dikelola. Route demo, placeholder, auth, dashboard, query, dan error dikecualikan.
- **robots.txt:** mengizinkan crawler mengambil halaman publik, dashboard, dan auth agar dapat membaca meta robots `noindex`; sitemap produksi dicantumkan. Tidak ada `Disallow` untuk route tersebut. Robots mengatur crawl dan bukan mekanisme noindex, kerahasiaan, atau jaminan tidak terindeks.
- **Meta robots:** halaman terpilih memakai `index, follow`; demo/placeholder memakai `noindex, follow`; auth/dashboard memakai `noindex, nofollow`; error memakai `noindex, nofollow`.
- **Open Graph/Twitter:** title, description, URL, type website, summary card, serta ikon aplikasi PNG 512px sebagai gambar share tersedia. Komposisi gambar sosial khusus belum disiapkan.
- **Structured data:** Organization dan WebSite dasar pada Home hanya menyatakan nama iToken dan URL origin yang diketahui. Tidak ada alamat, telepon, profil sosial, rating, review, harga, atau statistik. Breadcrumb belum digunakan karena tidak ada kebutuhan struktur breadcrumb saat ini.
- **Mobile/performa:** halaman memakai viewport dan layout responsive, serta aset dibangun dengan Vite. Mobile friendliness, performa produksi, dan Core Web Vitals perlu pengukuran browser/hosting; belum diklaim lulus.
- **Crawl/index:** sitemap, internal link, status HTTP, canonical, robots, dan meta robots memberi sinyal kepada crawler; Google menentukan hasil indeksnya sendiri.
- **HTTP/HTTPS:** origin kanonis menggunakan HTTPS. Redirect HTTP→HTTPS, domain alternatif, dan konfigurasi proxy/TLS harus diperiksa di hosting produksi; belum diverifikasi.
- **Error:** fallback 404 merender status 404, metadata noindex, dan dikecualikan dari sitemap. Kesalahan server 5xx mengikuti penanganan Laravel/hosting dan belum diaudit.

## 5. International SEO

UI menyediakan locale `id`, `en`, dan `zh_CN`, tetapi pilihan bahasa mengubah teks melalui JavaScript dan menyimpan preferensi di localStorage. Saat ini tidak ada route URL terpisah untuk setiap bahasa. Karena itu, implementasi tidak memasang `hreflang` dan HTML awal tetap berbahasa Indonesia. Mesin pencari dapat mengindeks konten server-rendered awal, bukan semua variasi lokal browser.

Jika kelak tersedia URL bahasa terpisah, rencanakan URL stabil per locale, render bahasa di server, canonical per versi, `hreflang` timbal balik termasuk `x-default` bila sesuai, serta sitemap yang memetakan versi bahasa. Hal itu memerlukan keputusan routing dan locale persistence.

## 6. Structured Data

Schema `Organization` dan `WebSite` dasar diterapkan di homepage dalam JSON-LD. Data yang dimasukkan hanya nama `iToken` dan URL `https://itoken.id`. Tambahkan properti lain hanya setelah sumber resminya tersedia dan kontennya terlihat/benar pada situs. `BreadcrumbList` belum diperlukan. Jangan menambahkan Product/Offer, AggregateRating, Review, FAQPage, atau klaim bisnis berdasarkan data demo/placeholder.

## 7. SEO per jenis halaman

| Jenis | Strategi |
|---|---|
| Home, About, FAQ | `index, follow`; masuk sitemap selama kontennya bermanfaat dan faktual |
| Pricing, Models, Docs | `noindex, follow` selama angka/katalog/kontrak masih demo atau placeholder |
| Contact, Terms, Privacy, Status | `noindex, follow` sampai kanal, isi legal, atau sumber status nyata tersedia |
| Login, Register, Forgot Password, instruksi reset | `noindex, nofollow`; tidak masuk sitemap; crawler tetap dapat mengambil HTML agar membaca meta robots |
| Dashboard DEMO | `noindex, nofollow`; tidak masuk sitemap; crawler tetap dapat mengambil HTML agar membaca meta robots. Route masih dapat diakses publik dan belum aman untuk data privat |
| 404 / error | Noindex, tidak masuk sitemap. 404 mengembalikan status 404; halaman 5xx perlu pemeriksaan hosting |

Meta `noindex` tidak membatasi akses. Karena crawler tidak dapat membaca meta tag pada URL yang diblokir oleh robots.txt, route auth dan dashboard tidak diblokir di robots.txt. Perlindungan konten memerlukan autentikasi/otorisasi; noindex bukan penggantinya.

## 8. SEM — Search Engine Marketing

Belum ada Google Ads atau campaign. Persiapan yang disarankan setelah produk dan halaman siap:

1. Tentukan tujuan kampanye, wilayah/bahasa, anggaran, batas biaya akuisisi, dan definisi calon pengguna bersama pemilik bisnis.
2. Lakukan riset keyword dan intent dengan Keyword Planner serta data pencarian yang tersedia. Pisahkan intent informasi (panduan/model) dari intent komersial (platform/API); hindari klaim dukungan yang belum benar.
3. Rancang Search campaign, kelompokkan keyword berdasarkan intent, siapkan negative keywords, dan pastikan landing page menjawab janji iklan.
4. Gunakan CTA yang nyata. Funnel konsultasi/registrasi/pembayaran baru relevan setelah alur tersebut tersedia.
5. Gunakan UTM konsisten (`utm_source`, `utm_medium`, `utm_campaign`, opsional `utm_content`/`utm_term`) dan jangan memasukkan data pribadi atau rahasia ke URL.
6. Evaluasi impresi, klik, CTR, CPC, istilah pencarian, conversion rate, biaya per konversi, dan nilai/ROAS jika nilai konversi valid.

Dokumentasi ini tidak membuat akun, memasang iklan, atau membelanjakan anggaran.

## 9. Analytics dan Conversion Tracking

Event yang mungkin berguna setelah ada keputusan produk dan consent/privacy review:

- Klik CTA seperti katalog, dokumentasi, atau pricing.
- Registrasi selesai setelah autentikasi benar-benar aktif.
- Permintaan konsultasi setelah kanal/form resmi tersedia.
- Kunjungan/engagement pada halaman Pricing.
- Sumber campaign melalui UTM.

Belum ada event tracking yang diimplementasikan. Tidak ada Google Ads tag, GA4, GTM, pixel, atau layanan tracking pihak ketiga. Tetapkan data minimum, masa retensi, masking, pemberitahuan privasi, consent/cookie policy yang berlaku, dan kontrol opt-out sebelum integrasi. Hindari merekam prompt, completion, credential, atau data akun.

## 10. Checklist dan Roadmap

### Sudah diimplementasikan

- [x] Title dan description unik untuk halaman publik.
- [x] Canonical produksi mengikuti path halaman dan tidak memakai host lokal.
- [x] Meta robots sesuai status halaman, termasuk auth, dashboard DEMO, dan 404.
- [x] Open Graph dan Twitter Card dasar memakai ikon aplikasi PNG 512px.
- [x] Setiap halaman publik yang diperiksa memiliki satu H1 dan landmark utama; belum ada gambar konten di halaman publik yang memerlukan alt text.
- [x] Sitemap dinamis hanya berisi halaman publik terpilih, tanpa `lastmod` rekaan.
- [x] robots.txt mengizinkan crawler membaca meta robots pada route noindex dan memuat URL sitemap produksi.
- [x] JSON-LD Organization dan WebSite memakai fakta minimum.

### Belum diimplementasikan

- [ ] Halaman sosial `og:image` khusus.
- [ ] URL server-rendered per locale dan `hreflang`.
- [ ] Tracking analitik/konversi dan consent management.
- [ ] Campaign Google Ads.
- [ ] Redirect domain/HTTP dan security/header policy deployment.

### Perlu verifikasi manual

- [ ] Google Search Console: verifikasi properti, submit sitemap, URL inspection, dan laporan indeks.
- [ ] Validator Rich Results/Schema.org untuk JSON-LD setelah deployment.
- [ ] Uji status HTTP 200/404/redirect, HTTPS, canonical, robots, dan sitemap di domain produksi.
- [ ] Browser/mobile accessibility, performa, dan Core Web Vitals.
- [ ] Tinjau konten dan keputusan indexability saat placeholder diselesaikan.

### Menunggu keputusan atau integrasi

- [ ] Finalisasi Terms, Privacy, kanal Contact, sumber Status, katalog/kontrak API, serta harga sebelum index.
- [ ] Pilih platform analytics, basis consent, event/value konversi, retensi, dan kepemilikan data.
- [ ] Tetapkan target campaign, keyword, pasar, landing page, anggaran, dan batas biaya sebelum Ads.
- [ ] Sahkan strategi URL locale sebelum implementasi hreflang.

## 11. Referensi

- Google Search Central — [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro), dan [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals).
- Google Search Console — [Panduan memulai](https://support.google.com/webmasters/answer/10267942).
- Schema.org — [Organization](https://schema.org/Organization) dan [WebSite](https://schema.org/WebSite).
- Google Ads Help — [Keyword Planner](https://support.google.com/google-ads/answer/7337243) dan [Search campaign](https://support.google.com/google-ads/answer/9510373).
- Google Analytics — [Panduan GA4](https://support.google.com/analytics/answer/9304153) dan [koleksi event](https://developers.google.com/analytics/devguides/collection/ga4/events).
