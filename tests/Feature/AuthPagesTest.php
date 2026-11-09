<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthPagesTest extends TestCase
{
    public function test_login_redirects_to_the_demo_dashboard_without_authentication_checks(): void
    {
        $this->get('/login')->assertRedirect(route('dashboard.index'));
    }

    public function test_register_page_contains_required_profile_and_terms_fields(): void
    {
        $this->get('/register')
            ->assertOk()
            ->assertSee('name="name"', false)
            ->assertSee('name="email"', false)
            ->assertSee('name="password"', false)
            ->assertSee('name="password_confirmation"', false)
            ->assertSee('name="terms"', false)
            ->assertSee(route('terms'), false)
            ->assertSee('disabled', false);
    }

    public function test_forgot_password_and_instructions_never_claim_that_email_was_sent(): void
    {
        $this->get('/forgot-password')
            ->assertOk()
            ->assertSee('auth.forgot.privacy', false)
            ->assertSee(route('password.instructions'), false)
            ->assertSee('disabled', false);

        $this->get('/password-reset/instructions')
            ->assertOk()
            ->assertSee('auth.instructions.pending', false)
            ->assertSee('auth.instructions.not_sent', false);
    }

    public function test_authentication_pages_have_one_primary_heading_available_at_all_viewports(): void
    {
        foreach (['/register', '/forgot-password', '/password-reset/instructions'] as $path) {
            $response = $this->get($path)->assertOk();
            $html = $response->getContent();

            $this->assertSame(1, preg_match_all('/<h1\b/i', $html), "Expected exactly one H1 on {$path}.");
            $this->assertStringContainsString('lg:text-4xl', $html);
            $this->assertStringNotContainsString('hidden lg:block', $html);
        }
    }

    public function test_logout_is_post_only_and_reports_that_no_session_was_ended(): void
    {
        $this->get('/logout')->assertNotFound();

        $this->post('/logout')
            ->assertRedirect(route('login'))
            ->assertSessionHas('auth_notice', 'auth.logout.unavailable');
    }

    public function test_dashboard_remains_available_until_clerk_verification_is_ready(): void
    {
        $this->get('/dashboard')
            ->assertOk()
            ->assertSee('DEMO')
            ->assertSee('dashboard.logout', false)
            ->assertSee('href="'.route('home').'"', false);
    }
}
