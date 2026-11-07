-- ==============================================================================
-- POSTGRESQL PRODUCTION DDL & SECURITY ARCHITECTURE
-- Platform: AI API Aggregator (PecutOpus Clone)
-- Target: High-Concurrency Low-Latency Unified OpenAI Gateway Proxy
-- Fitur: Pemisahan Hak Akses (RBAC & RLS), Autentikasi Aman, Zero-Logging Privacy,
--        Billing Prabayar 30 Hari & Atomic Token Deduction
-- ==============================================================================

-- 1. EKSTENSI KRIPTOGRAFI & UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. MODUL IDENTITAS, ROLE & HAK AKSES (RBAC)
-- ==============================================================================

CREATE TABLE roles (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
('super_admin', 'Super Administrator', 'Akses penuh ke konfigurasi master provider, audit, dan keuangan'),
('admin', 'Operations Admin', 'Mengelola katalog model, multiplier rate, status server dan pengguna'),
('developer_user', 'Developer User', 'Pengguna layanan AI: mengelola API key, dompet token, dan analitik');

CREATE TABLE permissions (
    id VARCHAR(60) PRIMARY KEY,
    category VARCHAR(30) NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO permissions (id, category, description) VALUES
('api_keys:create', 'api_gateway', 'Membuat API Key gateway baru'),
('api_keys:revoke', 'api_gateway', 'Mencabut hak akses API Key'),
('wallet:read_self', 'billing', 'Melihat sisa saldo dan masa aktif dompet sendiri'),
('wallet:topup_self', 'billing', 'Membuat tagihan top-up QRIS/USDT'),
('wallet:adjust_any', 'billing', 'Penyesuaian saldo manual oleh Admin dengan jejak audit'),
('models:view_rates', 'models', 'Melihat katalog model dan multiplier rate'),
('models:edit_rates', 'models', 'Mengubah nilai tukar multiplier rate model AI'),
('providers:manage', 'models', 'Mengelola upstream URL dan kesehatan master provider'),
('logs:view_self', 'audit', 'Melihat metadata riwayat konsumsi token sendiri'),
('logs:view_global', 'audit', 'Melihat telemetri performa dan throughput server');

CREATE TABLE role_permissions (
    role_id VARCHAR(30) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(60) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Mapping Permission Developer
INSERT INTO role_permissions (role_id, permission_id) VALUES
('developer_user', 'api_keys:create'),
('developer_user', 'api_keys:revoke'),
('developer_user', 'wallet:read_self'),
('developer_user', 'wallet:topup_self'),
('developer_user', 'models:view_rates'),
('developer_user', 'logs:view_self');

-- Mapping Permission Admin (Semua Hak Akses Operasional)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'admin', id FROM permissions;

-- ==============================================================================
-- 3. ENTITAS PENGGUNA & AUTENTIKASI AMAN
-- ==============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    -- Password hash disimpan menggunakan Argon2id atau bcrypt dengan salt otomatis
    password_hash VARCHAR(255) NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT NULL,
    role_id VARCHAR(30) NOT NULL REFERENCES roles(id) DEFAULT 'developer_user',
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(128) NULL, -- Terenkripsi at-rest menggunakan master app key
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification', 'banned')),
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ NULL, -- Proteksi Brute Force Password Lockout
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email_lower ON users(LOWER(email));
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);

-- Social Login OAuth (Google / GitHub)
CREATE TABLE user_oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(30) NOT NULL CHECK (provider IN ('google', 'github')),
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_oauth_provider UNIQUE (provider, provider_user_id)
);

-- Manajemen Sesi & Revocation Cepat
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(64) NOT NULL, -- SHA-256 dari secure refresh token
    ip_address INET NULL,
    user_agent TEXT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_refresh_active ON user_sessions(refresh_token_hash) WHERE is_revoked = FALSE;

-- ==============================================================================
-- 4. MANAJEMEN DEVELOPER API KEY (GATEWAY ACCESS)
-- Aturan Keamanan: Plaintext secret key TIDAK PERNAH disimpan di database!
-- ==============================================================================

CREATE TABLE developer_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_prefix VARCHAR(24) NOT NULL, -- Contoh: "sk_live_a1b2c3d4" (Diindeks untuk pencarian super cepat)
    key_hash VARCHAR(64) NOT NULL,   -- SHA-256 dari seluruh string token rahasia
    display_suffix VARCHAR(8) NOT NULL, -- "...8f92" untuk verifikasi visual pengguna
    name VARCHAR(100) NOT NULL,     -- Contoh: "Cursor IDE - Macbook M3"
    rate_limit_rpm INT NOT NULL DEFAULT 60, -- Mencegah bot script abuse
    rate_limit_tpm INT NOT NULL DEFAULT 200000,
    ip_whitelist TEXT[] NULL,       -- Opsional CIDR whitelist
    allowed_models TEXT[] NULL,     -- Opsional model filter
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    expires_at TIMESTAMPTZ NULL,
    last_used_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_api_keys_prefix ON developer_api_keys(key_prefix);
CREATE INDEX idx_api_keys_hash ON developer_api_keys(key_hash);
CREATE INDEX idx_api_keys_user ON developer_api_keys(user_id);

-- ==============================================================================
-- 5. DOMPET PRABAYAR (TOKEN WALLET) & BILLING 30 HARI
-- Aturan PRD:
-- - Saldo berlaku 30 hari sejak pembelian terakhir.
-- - Top-up otomatis memperpanjang masa aktif seluruh saldo token.
-- - Optimistic version lock untuk mencegah race condition.
-- ==============================================================================

CREATE TABLE token_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance_base_tokens BIGINT NOT NULL DEFAULT 0 CHECK (balance_base_tokens >= 0),
    bonus_tokens BIGINT NOT NULL DEFAULT 0 CHECK (bonus_tokens >= 0),
    expires_at TIMESTAMPTZ NULL, -- Masa aktif 30 hari
    total_purchased_tokens BIGINT NOT NULL DEFAULT 0,
    total_consumed_tokens BIGINT NOT NULL DEFAULT 0,
    version INT NOT NULL DEFAULT 1, -- Optimistic concurrency control
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pricing_tiers (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    price_idr_approx INT NOT NULL,
    base_tokens BIGINT NOT NULL,
    bonus_tokens BIGINT NOT NULL,
    validity_days INT NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 1
);

INSERT INTO pricing_tiers (id, name, price_usd, price_idr_approx, base_tokens, bonus_tokens, sort_order) VALUES
('lite',  'Lite Plan',   1.18,  19000,   20000000,   5000000, 1),
('plus',  'Plus Plan',   2.89,  46000,   50000000,  15000000, 2),
('pro',   'Pro Plan',    5.71,  92000,  100000000,  35000000, 3),
('max',   'Max Plan',   11.12, 180000,  200000000,  70000000, 4),
('ultra', 'Ultra Plan', 16.42, 265000,  300000000, 105000000, 5),
('titan', 'Titan Plan', 22.89, 370000,  430000000, 150000000, 6);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id),
    tier_id VARCHAR(30) NOT NULL REFERENCES pricing_tiers(id),
    amount_usd DECIMAL(10,2) NOT NULL,
    amount_idr DECIMAL(12,2) NULL,
    payment_gateway VARCHAR(30) NOT NULL CHECK (payment_gateway IN ('qris_midtrans', 'qris_xendit', 'crypto_usdt')),
    gateway_reference_id VARCHAR(255) NULL,
    tokens_purchased BIGINT NOT NULL,
    tokens_bonus BIGINT NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired', 'failed')),
    paid_at TIMESTAMPTZ NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(payment_status);

-- Double-entry immutable ledger
CREATE TABLE token_ledger_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES token_wallets(id),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL CHECK (type IN ('topup_credit', 'api_usage_debit', 'admin_adjustment', 'expiration_breakage', 'bonus_credit')),
    amount BIGINT NOT NULL, -- Positif untuk penambahan, Negatif untuk konsumsi
    balance_before BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    reference_id VARCHAR(100) NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_user ON token_ledger_transactions(user_id, created_at DESC);

-- ==============================================================================
-- 6. PENYEDIA AI & MODEL REGISTRY (DYNAMIC MULTIPLIER RATE)
-- Aturan PRD:
-- - Nilai tukar (multiplier) dapat diubah admin kapan saja tanpa memutus layanan.
-- - Master Key provider TIDAK disimpan di database yang dapat dibaca user.
-- ==============================================================================

CREATE TABLE ai_providers (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    base_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'degraded', 'down')),
    master_key_env_ref VARCHAR(100) NOT NULL -- Disimpan di Environment/Vault Server Proxy
);

INSERT INTO ai_providers (id, name, base_url, master_key_env_ref) VALUES
('deepseek',  'DeepSeek AI',        'https://api.deepseek.com/v1',                   'DEEPSEEK_MASTER_KEY_VAULT'),
('openai',    'OpenAI Enterprise',  'https://api.openai.com/v1',                     'OPENAI_MASTER_KEY_VAULT'),
('anthropic', 'Anthropic Claude',   'https://api.anthropic.com/v1',                  'ANTHROPIC_MASTER_KEY_VAULT'),
('google',    'Google Gemini',      'https://generativelanguage.googleapis.com/v1',  'GOOGLE_GEMINI_MASTER_KEY_VAULT');

CREATE TABLE ai_models (
    id VARCHAR(100) PRIMARY KEY,
    provider_id VARCHAR(30) NOT NULL REFERENCES ai_providers(id),
    display_name VARCHAR(100) NOT NULL,
    multiplier_rate DECIMAL(5,2) NOT NULL DEFAULT 1.00 CHECK (multiplier_rate > 0),
    provider_cost_input_per_m DECIMAL(8,4) NOT NULL,
    provider_cost_output_per_m DECIMAL(8,4) NOT NULL,
    context_window INT NOT NULL DEFAULT 128000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    latency_avg_ms INT NOT NULL DEFAULT 350,
    fallback_model_id VARCHAR(100) NULL REFERENCES ai_models(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO ai_models (id, provider_id, display_name, multiplier_rate, provider_cost_input_per_m, provider_cost_output_per_m, context_window) VALUES
('deepseek-chat',     'deepseek',  'DeepSeek V3 (Coding/Chat)',  0.30,  0.14,  0.28,  64000),
('deepseek-reasoner', 'deepseek',  'DeepSeek R1 (Reasoning)',    0.55,  0.55,  2.19,  64000),
('gpt-4o',            'openai',    'OpenAI GPT-4o (Flagship)',  12.00,  2.50, 10.00, 128000),
('gpt-4o-mini',       'openai',    'OpenAI GPT-4o Mini',         1.00,  0.15,  0.60, 128000),
('claude-3-5-sonnet', 'anthropic', 'Claude 3.5 Sonnet',         15.00,  3.00, 15.00, 200000),
('gemini-1.5-flash',  'google',    'Gemini 1.5 Flash',           0.40,  0.075, 0.30, 1000000);

-- ==============================================================================
-- 7. ZERO-LOGGING USAGE METADATA & AUDIT
-- Aturan PRD Bagian 3.4:
-- "Platform TIDAK Boleh menyimpan prompt pengguna atau balasan dari AI.
--  Hanya menyimpan metadata (jumlah token yang dihabiskan, status, waktu)."
-- ==============================================================================

CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(64) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id),
    api_key_id UUID NOT NULL REFERENCES developer_api_keys(id),
    model_id VARCHAR(100) NOT NULL REFERENCES ai_models(id),
    prompt_tokens INT NOT NULL,
    completion_tokens INT NOT NULL,
    raw_total_tokens INT NOT NULL,
    multiplier_applied DECIMAL(5,2) NOT NULL,
    billed_platform_tokens BIGINT NOT NULL,
    duration_ms INT NOT NULL,
    status_code INT NOT NULL,
    is_cached BOOLEAN NOT NULL DEFAULT FALSE,
    ip_origin_masked VARCHAR(45) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- PERHATIKAN: Kolom 'prompt' dan 'response' SENGAJA DITIADAKAN!
);

CREATE INDEX idx_usage_user ON api_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_usage_key ON api_usage_logs(api_key_id);
CREATE INDEX idx_usage_model ON api_usage_logs(model_id);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(60) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    old_values JSONB NULL,
    new_values JSONB NULL,
    ip_address INET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_time ON audit_logs(created_at DESC);

-- ==============================================================================
-- 8. STORED PROCEDURES UNTUK TRANSAKSI ATOMIK (MENCEGAH RACE CONDITION)
-- ==============================================================================

-- A. Prosedur Pemotongan Saldo Token Atomik dengan Row Locking
CREATE OR REPLACE FUNCTION deduct_user_token_atomic(
    p_user_id UUID,
    p_api_key_id UUID,
    p_model_id VARCHAR(100),
    p_prompt_tokens INT,
    p_completion_tokens INT,
    p_multiplier DECIMAL(5,2),
    p_request_id VARCHAR(64),
    p_duration_ms INT,
    p_ip_origin VARCHAR(45)
) RETURNS JSONB AS $$
DECLARE
    v_raw_tokens INT;
    v_tokens_to_deduct BIGINT;
    v_current_balance BIGINT;
    v_bonus_balance BIGINT;
    v_expires_at TIMESTAMPTZ;
    v_wallet_id UUID;
    v_new_balance BIGINT;
    v_remaining_deduct BIGINT;
    v_bonus_deducted BIGINT := 0;
BEGIN
    v_raw_tokens := p_prompt_tokens + p_completion_tokens;
    v_tokens_to_deduct := CEIL(v_raw_tokens * p_multiplier)::BIGINT;

    -- Mengunci baris dompet (SELECT FOR UPDATE) untuk mencegah race condition
    SELECT id, balance_base_tokens, bonus_tokens, expires_at
    INTO v_wallet_id, v_current_balance, v_bonus_balance, v_expires_at
    FROM token_wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'DOMPET_TIDAK_DITEMUKAN';
    END IF;

    -- Validasi masa aktif 30 hari
    IF v_expires_at IS NOT NULL AND v_expires_at < NOW() THEN
        RAISE EXCEPTION 'SALDO_KEDALUWARSA: Masa aktif saldo 30 hari telah habis. Silakan top-up untuk reaktivasi.';
    END IF;

    -- Validasi kecukupan saldo
    IF (v_current_balance + v_bonus_balance) < v_tokens_to_deduct THEN
        RAISE EXCEPTION 'SALDO_TIDAK_CUKUP: Saldo tersedia % token, dibutuhkan % token.',
            (v_current_balance + v_bonus_balance), v_tokens_to_deduct;
    END IF;

    -- Potong dari bonus terlebih dahulu, lalu dari balance utama
    v_remaining_deduct := v_tokens_to_deduct;
    IF v_bonus_balance >= v_remaining_deduct THEN
        v_bonus_balance := v_bonus_balance - v_remaining_deduct;
        v_remaining_deduct := 0;
    ELSE
        v_remaining_deduct := v_remaining_deduct - v_bonus_balance;
        v_bonus_balance := 0;
    END IF;

    v_new_balance := v_current_balance - v_remaining_deduct;

    -- Update dompet
    UPDATE token_wallets
    SET balance_base_tokens = v_new_balance,
        bonus_tokens = v_bonus_balance,
        total_consumed_tokens = total_consumed_tokens + v_tokens_to_deduct,
        version = version + 1,
        updated_at = NOW()
    WHERE id = v_wallet_id;

    -- Catat log pemakaian (Zero-logging: hanya metadata!)
    INSERT INTO api_usage_logs (
        request_id, user_id, api_key_id, model_id,
        prompt_tokens, completion_tokens, raw_total_tokens,
        multiplier_applied, billed_platform_tokens,
        duration_ms, status_code, ip_origin_masked
    ) VALUES (
        p_request_id, p_user_id, p_api_key_id, p_model_id,
        p_prompt_tokens, p_completion_tokens, v_raw_tokens,
        p_multiplier, v_tokens_to_deduct,
        p_duration_ms, 200, p_ip_origin
    );

    -- Catat entri ledger akuntansi
    INSERT INTO token_ledger_transactions (
        wallet_id, user_id, type, amount,
        balance_before, balance_after, reference_id, description
    ) VALUES (
        v_wallet_id, p_user_id, 'api_usage_debit', -v_tokens_to_deduct,
        (v_current_balance + v_bonus_balance + v_tokens_to_deduct),
        (v_new_balance + v_bonus_balance),
        p_request_id,
        format('Konsumsi model %s (%s token x %s)', p_model_id, v_raw_tokens, p_multiplier)
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'billed_tokens', v_tokens_to_deduct,
        'remaining_balance', (v_new_balance + v_bonus_balance),
        'request_id', p_request_id
    );
END;
$$ LANGUAGE plpgsql;

-- B. Prosedur Top-Up Token & Perpanjangan Masa Aktif 30 Hari
CREATE OR REPLACE FUNCTION process_topup_success(
    p_invoice_id UUID,
    p_gateway_ref VARCHAR(255)
) RETURNS JSONB AS $$
DECLARE
    v_inv RECORD;
    v_wallet RECORD;
BEGIN
    SELECT * INTO v_inv FROM invoices WHERE id = p_invoice_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVOICE_TIDAK_DITEMUKAN';
    END IF;

    IF v_inv.payment_status = 'paid' THEN
        RETURN jsonb_build_object('success', TRUE, 'message', 'Invoice sudah pernah dibayar');
    END IF;

    -- Tandai invoice lunas
    UPDATE invoices
    SET payment_status = 'paid',
        paid_at = NOW(),
        gateway_reference_id = p_gateway_ref
    WHERE id = p_invoice_id;

    -- Ambil dompet pengguna dengan row locking
    SELECT * INTO v_wallet FROM token_wallets WHERE user_id = v_inv.user_id FOR UPDATE;

    -- PRD Section 3.2: Top-up otomatis memperpanjang masa aktif seluruh saldo selama 30 hari dari sekarang!
    UPDATE token_wallets
    SET balance_base_tokens = balance_base_tokens + v_inv.tokens_purchased,
        bonus_tokens = bonus_tokens + v_inv.tokens_bonus,
        total_purchased_tokens = total_purchased_tokens + (v_inv.tokens_purchased + v_inv.tokens_bonus),
        expires_at = NOW() + INTERVAL '30 days',
        version = version + 1,
        updated_at = NOW()
    WHERE user_id = v_inv.user_id;

    -- Catat ledger
    INSERT INTO token_ledger_transactions (
        wallet_id, user_id, type, amount,
        balance_before, balance_after, reference_id, description
    ) VALUES (
        v_wallet.id, v_inv.user_id, 'topup_credit', (v_inv.tokens_purchased + v_inv.tokens_bonus),
        (v_wallet.balance_base_tokens + v_wallet.bonus_tokens),
        (v_wallet.balance_base_tokens + v_wallet.bonus_tokens + v_inv.tokens_purchased + v_inv.tokens_bonus),
        v_inv.invoice_no,
        format('Top-up paket %s (%s M Token + %s M Bonus). Masa aktif diperpanjang 30 hari.',
            v_inv.tier_id, (v_inv.tokens_purchased / 1000000), (v_inv.tokens_bonus / 1000000))
    );

    RETURN jsonb_build_object('success', TRUE, 'new_expires_at', NOW() + INTERVAL '30 days');
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 9. KEBIJAKAN POSTGRESQL ROW LEVEL SECURITY (RLS)
-- Menjamin isolasi mutlak antara tampilan Pengguna Biasa vs Administrator
-- ==============================================================================

-- A. Aktifkan RLS di setiap tabel penting
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- B. Policy Tabel users
CREATE POLICY user_view_self ON users
    FOR SELECT TO authenticated
    USING (id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY admin_view_all_users ON users
    FOR ALL TO authenticated
    USING (current_setting('app.current_user_role', true) IN ('super_admin', 'admin'));

-- C. Policy Tabel developer_api_keys
CREATE POLICY dev_manage_own_keys ON developer_api_keys
    FOR ALL TO authenticated
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY admin_audit_keys ON developer_api_keys
    FOR SELECT TO authenticated
    USING (current_setting('app.current_user_role', true) IN ('super_admin', 'admin'));

-- D. Policy Tabel token_wallets
-- Regular user HANYA boleh membaca saldo, TIDAK BISA update langsung (hanya via stored proc)
CREATE POLICY user_read_own_wallet ON token_wallets
    FOR SELECT TO authenticated
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY admin_read_wallets ON token_wallets
    FOR SELECT TO authenticated
    USING (current_setting('app.current_user_role', true) IN ('super_admin', 'admin'));

-- E. Policy Tabel api_usage_logs
CREATE POLICY user_read_own_usage ON api_usage_logs
    FOR SELECT TO authenticated
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY admin_read_all_usage ON api_usage_logs
    FOR SELECT TO authenticated
    USING (current_setting('app.current_user_role', true) IN ('super_admin', 'admin'));

-- F. Policy Tabel ai_models
CREATE POLICY anyone_read_active_models ON ai_models
    FOR SELECT TO authenticated
    USING (is_active = TRUE);

CREATE POLICY admin_modify_models ON ai_models
    FOR ALL TO authenticated
    USING (current_setting('app.current_user_role', true) IN ('super_admin', 'admin'));

-- G. Policy Tabel audit_logs
CREATE POLICY admin_only_audit ON audit_logs
    FOR SELECT TO authenticated
    USING (current_setting('app.current_user_role', true) IN ('super_admin', 'admin'));

-- ==============================================================================
-- SELESAI: Skema Siap Dijalankan di PostgreSQL 14/15/16/Cloud SQL
-- ==============================================================================
