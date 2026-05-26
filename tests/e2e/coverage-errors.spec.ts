import { expect, test } from '@playwright/test';

test('analyzeButton_isEnabledByDefault_andShowsApiError', async ({ page }) => {
  await page.route('**/api/coverage', async (route) => {
    await route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'A SPARQL endpoint URL must be configured before analysis can run.',
        issues: ['Set SPARQL_ENDPOINT_URL to a valid absolute URL (for example http://ontop:8080/sparql).']
      })
    });
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const button = page.getByRole('button', { name: 'Analyze coverage' });
  await expect(button).toBeEnabled();
  await button.click();
  await expect(page.getByText('A SPARQL endpoint URL must be configured before analysis can run.')).toBeVisible();
});
