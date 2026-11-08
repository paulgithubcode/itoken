<?php

namespace Tests\Feature;

use Tests\TestCase;

class DashboardFoundationTest extends TestCase
{
    public function test_dashboard_overview_is_a_demo_and_is_not_cached(): void
    {
        $response = $this->get('/dashboard');

        $response->assertOk()
            ->assertSee('Pratinjau dashboard')
            ->assertSee('DEMO')
            ->assertSee('Rp 420.000')
            ->assertSee('1.284')
            ->assertSee('128,4k')
            ->assertSee('Tidak ada key')
            ->assertDontSee('sk-live-');

        $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));
        $this->assertSame('no-cache', $response->headers->get('Pragma'));
    }

    public function test_dashboard_primary_navigation_contains_requested_sections(): void
    {
        $response = $this->get('/dashboard');

        foreach (['Overview', 'API Keys', 'Usage', 'Logs', 'Billing', 'Settings'] as $label) {
            $response->assertSee($label);
        }

        foreach (['overview', 'api-keys', 'usage', 'logs', 'billing', 'settings'] as $section) {
            $response->assertSee(route('dashboard.index', ['section' => $section]), false);
        }

        $response->assertSee('id="dashboard-content"', false)
            ->assertSee('id="dashboard-menu-close"', false)
            ->assertSee('data-i18n-aria-label="dashboard.nav.close"', false);
    }

    public function test_dashboard_settings_renders_and_legacy_sections_remain_explicit_placeholders(): void
    {
        $this->get('/dashboard/settings')
            ->assertOk()
            ->assertSee('settings-heading', false)
            ->assertSee('data-settings-active-locale', false)
            ->assertSee('data-settings-preference="theme"', false)
            ->assertSee('value="system"', false)
            ->assertSee('data-settings-preference="density"', false)
            ->assertSee('data-settings-preference="tableRows"', false)
            ->assertSee('data-settings-reset', false)
            ->assertSee('data-profile-edit', false)
            ->assertSee('data-profile-form', false)
            ->assertSee('name="displayName"', false)
            ->assertSee('name="fullName"', false)
            ->assertSee('name="whatsappCountryCode"', false)
            ->assertSee('name="whatsappLocal"', false)
            ->assertSee('data-profile-whatsapp-example', false)
            ->assertSee('readonly', false)
            ->assertSee('data-profile-reset', false)
            ->assertSee('settings.application.offline_body', false)
            ->assertSee('DEMO');

        foreach (['wallet', 'transactions', 'models', 'developer-docs'] as $section) {
            $this->get("/dashboard/{$section}")
                ->assertOk()
                ->assertSee('Halaman ini belum diimplementasikan')
                ->assertSee('DEMO');
        }
    }

    public function test_api_keys_page_renders_demo_management_controls_without_real_secrets(): void
    {
        $response = $this->get('/dashboard/api-keys');

        $response->assertOk()
            ->assertSee('API keys')
            ->assertSee('Create API key')
            ->assertSee('Total keys')
            ->assertSee('Active keys')
            ->assertSee('Revoked keys')
            ->assertSee('Key prefix')
            ->assertSee('Search by name')
            ->assertSee('data-key-dialog="create"', false)
            ->assertSee('data-key-dialog="detail"', false)
            ->assertSee('data-key-dialog="revoke"', false)
            ->assertSee('data-key-rows', false)
            ->assertDontSee('sk-live-');
    }

    public function test_usage_page_renders_demo_summaries_charts_and_table_controls(): void
    {
        $response = $this->get('/dashboard/usage');

        $response->assertOk()
            ->assertSee('Usage analytics · DEMO')
            ->assertSee('data-i18n="usage.summary.requests"', false)
            ->assertSee('data-i18n="usage.summary.tokens"', false)
            ->assertSee('data-i18n="usage.summary.input"', false)
            ->assertSee('data-i18n="usage.summary.output"', false)
            ->assertSee('value="24h"', false)
            ->assertSee('value="7d"', false)
            ->assertSee('value="30d"', false)
            ->assertSee('value="90d"', false)
            ->assertSee('data-usage-chart="requests"', false)
            ->assertSee('data-usage-chart="tokens"', false)
            ->assertSee('data-usage-search', false)
            ->assertSee('data-usage-model', false)
            ->assertSee('data-usage-status', false)
            ->assertSee('data-usage-next', false)
            ->assertDontSee('api/v1/usage');
    }

    public function test_logs_page_renders_demo_filters_table_and_detail_dialog(): void
    {
        $response = $this->get('/dashboard/logs');

        $response->assertOk()
            ->assertSee('Request activity · DEMO')
            ->assertSee('data-i18n="logs.summary.requests"', false)
            ->assertSee('data-i18n="logs.summary.success"', false)
            ->assertSee('data-i18n="logs.summary.errors"', false)
            ->assertSee('data-i18n="logs.summary.latency"', false)
            ->assertSee('data-logs-search', false)
            ->assertSee('data-logs-status', false)
            ->assertSee('data-logs-http', false)
            ->assertSee('data-logs-model', false)
            ->assertSee('value="400"', false)
            ->assertSee('value="401"', false)
            ->assertSee('value="429"', false)
            ->assertSee('value="500"', false)
            ->assertSee('data-logs-period', false)
            ->assertSee('data-logs-reset', false)
            ->assertSee('data-logs-next', false)
            ->assertSee('data-logs-dialog', false)
            ->assertDontSee('Bearer ')
            ->assertDontSee('sk-live-');
    }

    public function test_billing_page_renders_demo_transactions_and_simulation_dialogs(): void
    {
        $response = $this->get('/dashboard/billing');

        $response->assertOk()
            ->assertSee('Balance and transactions · DEMO')
            ->assertSee('data-i18n="billing.summary.balance"', false)
            ->assertSee('data-i18n="billing.summary.spend"', false)
            ->assertSee('data-i18n="billing.summary.transactions"', false)
            ->assertSee('data-i18n="billing.summary.credit"', false)
            ->assertSee('data-billing-period', false)
            ->assertSee('data-billing-type', false)
            ->assertSee('data-billing-status', false)
            ->assertSee('data-billing-search', false)
            ->assertSee('data-billing-reset', false)
            ->assertSee('data-billing-next', false)
            ->assertSee('data-billing-detail-dialog', false)
            ->assertSee('data-billing-topup-dialog', false)
            ->assertSee('data-billing-topup-open', false)
            ->assertSee('data-billing-topup-close', false)
            ->assertSee('data-billing-topup-form', false)
            ->assertSee('value="qris"', false)
            ->assertSee('value="bank"', false)
            ->assertSee('value="ewallet"', false)
            ->assertSee('value="virtual-account"', false)
            ->assertSee('data-topup-method-card', false)
            ->assertSee('data-topup-summary-amount', false)
            ->assertSee('data-topup-summary-method', false)
            ->assertSee('data-topup-summary-total', false)
            ->assertSee('data-topup-continue', false)
            ->assertSee('data-topup-back', false)
            ->assertSee('data-topup-instruction="qris"', false)
            ->assertSee('data-topup-instruction="bank"', false)
            ->assertSee('data-topup-instruction="ewallet"', false)
            ->assertSee('data-topup-instruction="virtual-account"', false)
            ->assertSee('name="amount"', false)
            ->assertDontSee('VA DEMO 1234567890')
            ->assertDontSee('/checkout');
    }

    public function test_unknown_dashboard_section_returns_not_found(): void
    {
        $this->get('/dashboard/not-a-section')->assertNotFound();
    }

    public function test_public_homepage_still_renders(): void
    {
        $this->get('/')->assertOk()->assertSee('Akses model AI pilihanmu');
    }
}
