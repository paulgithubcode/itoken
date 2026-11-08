<?php

namespace Tests\Feature;

use Tests\TestCase;

class SeoMetadataTest extends TestCase
{
    public function test_public_pages_have_unique_metadata_and_production_canonicals(): void
    {
        $pages = [
            '/' => 'index, follow',
            '/pricing' => 'noindex, follow',
            '/models' => 'noindex, follow',
            '/docs' => 'noindex, follow',
            '/faq' => 'index, follow',
            '/about' => 'index, follow',
            '/contact' => 'noindex, follow',
            '/terms' => 'noindex, follow',
            '/privacy' => 'noindex, follow',
            '/status' => 'noindex, follow',
        ];
        $titles = [];
        $descriptions = [];

        foreach ($pages as $path => $robots) {
            $response = $this->get($path)->assertOk();
            $html = $response->getContent();

            preg_match('/<title[^>]*>(.*?)<\/title>/s', $html, $titleMatch);
            preg_match('/<meta name="description" content="([^"]*)">/', $html, $descriptionMatch);
            preg_match('/<link rel="canonical" href="([^"]*)">/', $html, $canonicalMatch);
            preg_match('/<meta name="robots" content="([^"]*)">/', $html, $robotsMatch);

            $this->assertNotEmpty($titleMatch[1] ?? null, "Title kosong untuk {$path}");
            $this->assertNotEmpty($descriptionMatch[1] ?? null, "Description kosong untuk {$path}");
            $this->assertSame('https://itoken.id'.($path === '/' ? '/' : $path), $canonicalMatch[1] ?? null);
            $this->assertSame($robots, $robotsMatch[1] ?? null);
            $this->assertSame(1, preg_match_all('/<title\b/', $html));
            $this->assertSame(1, preg_match_all('/<meta name="description"/', $html));
            $this->assertSame(1, preg_match_all('/<meta name="robots"/', $html));
            $this->assertSame(1, preg_match_all('/<link rel="canonical"/', $html));
            $this->assertSame(1, preg_match_all('/<h1\b/', $html));
            $this->assertStringContainsString('<main ', $html);
            $this->assertStringContainsString('<nav ', $html);
            $this->assertStringContainsString('property="og:title"', $html);
            $this->assertStringContainsString('property="og:description"', $html);
            $this->assertStringContainsString('property="og:url"', $html);
            $this->assertStringContainsString('property="og:image"', $html);
            $this->assertStringContainsString('name="twitter:card"', $html);
            $this->assertStringNotContainsString('localhost', $canonicalMatch[1] ?? '');

            if ($path === '/') {
                preg_match('/<script type="application\/ld\+json">\s*(.*?)\s*<\/script>/s', $html, $schemaMatch);
                $schema = json_decode($schemaMatch[1] ?? '', true);

                $this->assertSame(JSON_ERROR_NONE, json_last_error());
                $this->assertSame(['Organization', 'WebSite'], array_column($schema['@graph'] ?? [], '@type'));
                $this->assertSame('https://itoken.id', $schema['@graph'][0]['url'] ?? null);
            }

            $titles[] = $titleMatch[1];
            $descriptions[] = $descriptionMatch[1];
        }

        $this->assertCount(count($pages), array_unique($titles));
        $this->assertCount(count($pages), array_unique($descriptions));
    }

    public function test_sitemap_is_valid_and_contains_only_indexable_public_pages(): void
    {
        $response = $this->get('/sitemap.xml')->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $xml = simplexml_load_string($response->getContent());

        $this->assertNotFalse($xml);
        $locations = array_map('strval', $xml->xpath('//*[local-name()="loc"]'));
        $this->assertSame([
            'https://itoken.id/',
            'https://itoken.id/about',
            'https://itoken.id/faq',
        ], $locations);
        $this->assertStringNotContainsString('lastmod', $response->getContent());
    }

    public function test_non_public_and_error_pages_are_noindex_and_excluded_from_sitemap(): void
    {
        foreach (['/login', '/register', '/forgot-password', '/password-reset/instructions', '/dashboard'] as $path) {
            $html = $this->get($path)->assertOk()
                ->assertSee('name="robots" content="noindex, nofollow"', false)
                ->getContent();
            $this->assertSame(1, preg_match_all('/<meta name="description"/', $html));
            $this->assertSame(1, preg_match_all('/<meta name="robots"/', $html));
        }

        $this->get('/path-tidak-ada')->assertNotFound()
            ->assertSee('name="robots" content="noindex, nofollow"', false)
            ->assertDontSee('rel="canonical"', false);

        $robots = file_get_contents(public_path('robots.txt'));
        $this->assertStringContainsString('Allow: /', $robots);
        $this->assertStringNotContainsString('Disallow: /dashboard/', $robots);
        $this->assertStringNotContainsString('Disallow: /login', $robots);
        $this->assertStringNotContainsString('Disallow: /register', $robots);
        $this->assertStringNotContainsString('Disallow: /forgot-password', $robots);
        $this->assertStringNotContainsString('Disallow: /password-reset/', $robots);
        $this->assertStringContainsString('Sitemap: https://itoken.id/sitemap.xml', $robots);
    }
}
