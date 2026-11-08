# 06 — Authentication UI dan Clerk

## 1. Pemilikan identity

Clerk adalah identity provider yang dituju, tetapi belum ada integrasi SDK/verification/session pada aplikasi saat ini. Route auth merender UI native Laravel. Dashboard belum diproteksi. Laravel scaffold masih menyertakan model/migration `users` dan guard Eloquent default, tetapi belum digunakan oleh alur auth yang ada; status scaffold ini harus diputuskan sebelum integrasi Clerk. Jangan menyimpulkan status login dari browser.

Frontend mengatur branded entry points, form/embedded states bila integrasi mendukung, feedback/loading/error, navigasi aman, serta tampilan akun. Clerk tetap sumber identity; Laravel/backend tetap memvalidasi akses. Browser data saja tidak membuktikan identitas.

## 2. Layar dan state UI

| Layar | Konten/state | Status integrasi |
|---|---|---|
| Sign in | UI email/password, remember-me, password toggle, forgot/register links; Google dinonaktifkan | **Completed — UI**; submit auth belum tersedia |
| Sign up | UI nama, email, password/konfirmasi, terms consent, login link | **Completed — UI**; akun tidak dibuat |
| Email verification | Belum ada halaman/flow verifikasi operasional | **Pending**; status hanya boleh muncul dari Clerk response setelah integrasi |
| Forgot password | UI email dan halaman instruksi yang menyatakan email tidak dikirim | **Completed — UI**; request/reset belum tersedia |
| Reset password | Halaman instruksi reset tersedia; form set password baru belum ada | Instruksi **Completed — UI**; reset flow **Pending** |
| Auth errors/loading | Network/provider error, invalid state, retry/dismiss | Mapping error Clerk/Laravel **Pending** |
| Sign out | Route POST mengarahkan ke login dan memberi pesan bahwa tidak ada sesi yang diakhiri | **Partial**; bukan logout operasional |
| Profile/Security | Identity attributes/status yang disediakan Clerk/Backend API | Ownership per field dan mutasi **Pending** |

Seluruh halaman auth saat ini adalah **Completed — UI**, bukan autentikasi operasional. Tidak ada POST login/register/forgot-password; tombol submit dinonaktifkan dan Google dinonaktifkan. Tidak boleh menyatakan login, signup, email verification, password reset, OAuth, atau logout berhasil.

## 3. Konseptual flow

Flow operasional belum ada. Flow konseptual setelah integrasi: UI memulai Clerk flow yang disetujui; Clerk memvalidasi credential; Laravel memverifikasi session/token di server dan membuat session aman; Laravel memeriksa otorisasi/mapping dan meminta business data ke Backend API; logout mengakhiri Laravel session serta mengikuti revoke behavior Clerk yang disepakati.

Flow tersebut tidak memutuskan hosted vs embedded UI, callback route, JWT, cookie, session exchange, refresh, token storage, claim, revoke, atau provider configuration.

## 4. Keamanan UI dan data

- Jangan simpan password di Laravel frontend database.
- Jangan menganggap localStorage, query string, hidden input, atau state Livewire yang dikirim browser sebagai identity proof.
- Token/credential sensitif tidak boleh masuk localStorage, sessionStorage, IndexedDB, service worker cache, HTML/JS bundle, URL, analytics, atau logs.
- Session harus secure dan diverifikasi server-side; cookie flags, CSRF behavior, expiry dan rotation menunggu aplikasi/security contract.
- UI tidak menebak pemetaan Clerk User ID ke Backend User ID melalui email.
- Tampilkan pesan gagal yang aman; hindari user enumeration.
- Auth pages tidak disediakan sebagai offline private content.

## 5. Integrasi dan dependensi

Dependensi implementasi: kontrak resmi Clerk; Laravel verification mechanism; secure application session design; approved OAuth providers; identity mapping dengan Backend API; logout/revocation behavior; route/domain/TLS/cookie/CSRF/CSP policy.

Semuanya **Pending**. Tidak ada integrasi Clerk nyata, session verification, provider OAuth, reset, atau logout yang berfungsi. LiteLLM dan Redis bukan dependency auth UI.

## 6. Status pengujian

`tests/Feature/AuthPagesTest.php` memeriksa render UI/route dan perilaku placeholder logout; `tests/js/auth-pages.test.js` memeriksa localization auth. Pengguna mengonfirmasi pemeriksaan visual Login, Register, dan Forgot Password. Password Reset Instructions tidak termasuk dalam konfirmasi visual tersebut. Verifikasi flow Clerk, security/session, keyboard, screen reader, dan integrasi autentikasi tetap **Not Verified**; pemeriksaan visual tidak membuktikan fungsi auth.

Temuan QA-001 diperbaiki pada `resources/views/components/layouts/auth.blade.php`: satu H1 kini tetap tampil pada seluruh ukuran viewport; konten pendamping dan penanda status di panel samping tetap khusus desktop. `tests/Feature/AuthPagesTest.php` memastikan Login, Register, Forgot Password, dan Password Reset Instructions masing-masing merender tepat satu H1. Perilaku visual lintas breakpoint masih memerlukan browser testing manual.

## 6. Acceptance

- Setiap state menunjukkan hasil dari sumber nyata; mock tidak dianggap authenticated.
- Keyboard, screen reader, focus, labels, validation, dan reduced motion sesuai design system.
- Error tidak membocorkan credential atau keberadaan account.
- Laravel memverifikasi server-side sebelum mengeluarkan authenticated session.
- Tidak ada password lokal, business user table frontend, atau token sensitif di browser storage/cache.
- Pemetaan identity/backend account dilakukan sesuai kontrak, bukan asumsi UI.
