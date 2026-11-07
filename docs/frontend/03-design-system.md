# 03 — Design System

## 1. Prinsip visual

Gaya iToken: modern, profesional, bersih, tenang, dan developer-friendly. Utamakan keterbacaan dan hierarki. Hindari dekorasi berlebihan, banyak aksen, data berulang, dan tabel padat tanpa filter.

**Theme:** Public Website menggunakan tampilan Light. Dashboard mendukung Light dan Dark melalui preferensi lokal; halaman auth membaca preferensi tema Dashboard. Dark theme belum memiliki browser contrast acceptance pada seluruh halaman. Public Website tidak ikut berubah ketika tema Dashboard diganti.

## 2. Design tokens

- **Canvas:** putih hangat/slate sangat muda.
- **Surface:** putih; border slate muda.
- **Text:** slate gelap untuk konten utama, slate sedang untuk bantuan.
- **Accent:** indigo sebagai aksen UI saat ini untuk CTA, link, dan focus. Pertahankan satu accent utama.
- **Status:** success, warning, danger, info dengan warna lembut dan label teks.
- **Spacing:** skala konsisten kelipatan 4 px.
- **Shape:** radius sedang pada tombol, input, card; border tipis; shadow hanya untuk hierarchy.
- **Typography:** sans-serif yang bersih; tabular numerals untuk harga/saldo; monospace untuk code.
- **Motion:** singkat dan fungsional. Sebagian transisi drawer menghormati `motion-reduce`; dukungan reduced-motion global belum diverifikasi/lengkap.

Nilai CSS token disimpan pada stylesheet frontend dan dapat disesuaikan visual tanpa mengubah makna status/ownership data.

## 3. Tipografi dan layout

- Gunakan heading semantik berurutan dan lebar teks yang nyaman.
- Gunakan satu primary action yang menonjol per area.
- Public header horizontal pada desktop; menu ringkas/drawer pada mobile.
- Dashboard memakai sidebar desktop, topbar kontekstual, dan drawer/navigasi ringkas di layar kecil.
- Mobile: satu kolom untuk konten utama; tabel dapat scroll horizontal terkontrol atau berubah menjadi list.
- Jangan mengandalkan warna sebagai satu-satunya cara membedakan status.

## 4. Komponen reusable

### Navigation

Public header/footer, dashboard sidebar/topbar, breadcrumb, mobile drawer, language switcher, active link state, skip link.

### Buttons and controls

Primary, secondary, ghost, destructive, disabled, loading; input, password visibility toggle, select, checkbox, radio, textarea, search, filter, date range. Label berada di atas field; helper/error dekat field terkait.

### Content/data display

Card, summary, badge, responsive table, pagination, tabs, accordion, chart, code block/copy, empty state, skeleton, error/retry state, inline alert, toast, tooltip.

### Dialog and feedback

Dialog mengelola focus masuk/keluar dan Escape jika aman. Tindakan destructive menyebut efeknya dengan jelas. Toast tidak menghalangi aksi dan diumumkan melalui live region.

### Auth/PWA components

Clerk flow state, verification notice, install prompt, offline notice, update available, reconnected state. Setiap state harus jujur pada sumbernya: mock diberi `DEMO`, status nyata menunggu integrasi.

Dashboard menggunakan sidebar desktop dan drawer mobile dengan backdrop, Escape, focus return, serta active route. Dashboard dialog menggunakan native `<dialog>` atau pola dialog custom sesuai modul; perilaku keyboard perlu dites di browser. PWA notices hanya muncul sesuai state browser; tombol Install disembunyikan ketika event install tidak tersedia atau app sudah standalone. Offline, install, update, dan koneksi kembali mengikuti palette status yang sama dan tersedia dalam tiga locale.

## 5. Visual status

| State | Arah visual | Aturan |
|---|---|---|
| Active/success | Hijau lembut | Tampilkan label; hanya dari sumber terkonfirmasi |
| Pending | Amber lembut | Label eksplisit “Menunggu/Pending” |
| Failed/expired | Merah lembut | Jelaskan state dan langkah selanjutnya jika diketahui |
| Revoked/inactive | Abu-abu | Jangan disamakan dengan error |
| Info/demo | Biru atau neutral | Gunakan teks `DEMO`/`PENDING` |

Jangan render `Paid`, `Success`, `Active`, saldo, atau live service status dari data mock tanpa penanda demo yang tampak.

## 6. Integrasi teknis komponen

- Blade components/layouts untuk markup konsisten.
- Vanilla JavaScript ES modules untuk interaksi yang berjalan saat ini. Livewire 4 tersedia, tetapi belum digunakan signifikan pada halaman yang diaudit.
- Tailwind CSS 4 untuk styling/responsive states.
- JavaScript untuk browser-only behavior: drawer, clipboard, local mock search/filter, locale switcher, dan PWA events.
- Vite membangun aset publik; tidak memuat secret atau business configuration privat.
- Model/usage UI tidak terhubung langsung ke LiteLLM atau Redis.

## 7. Localization dan accessibility

Default `id`; dukung `en` dan `zh_CN`. Terjemahkan semua label, state, errors, dialog, install/offline/update UI. Proper nouns/model/provider/identifier/code tidak diterjemahkan. Format angka, tanggal, mata uang mengikuti locale dan source value terkonfirmasi.

Target aksesibilitas: kontrol keyboard-operable, focus terlihat, icon bernama/berlabel, status memakai teks, tabel memiliki header/caption, dan chart memiliki ringkasan alternatif. Implementasi memiliki sebagian label, focus-visible, native dialogs/details, dan `aria-live`; keyboard, screen reader, kontras Light/Dark, serta dukungan reduced-motion belum diverifikasi menyeluruh. Tidak ada Livewire UI update yang digunakan sebagai pola utama saat ini.
