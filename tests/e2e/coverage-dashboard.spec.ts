import { expect, test } from '@playwright/test';

test('happyPath_runsAnalysis_andShowsSummary', async ({ page }) => {
  await page.route('**/api/coverage', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        runId: 'run-e2e',
        summary: {
          totalQueries: 2,
          coveredCount: 1,
          partialCount: 1,
          notCoveredCount: 0,
          errorCount: 0,
          coveragePercent: 50,
          overallStatus: 'yellow'
        },
        results: [
          {
            queryId: 'cq-provider',
            title: 'Provider information is documented',
            status: 'covered',
            explanation: 'Covered by endpoint evidence.',
            evidenceCount: 1,
            evidencePreview: ['?provider=<https://example.org/provider>'],
            sourcePath: 'query-set/assets/cq-provider.sparql'
          },
          {
            queryId: 'cq-hardware',
            title: 'Hardware requirements are documented',
            status: 'partially_covered',
            explanation: 'Partially covered by endpoint evidence.',
            evidenceCount: 1,
            evidencePreview: ['?hardware=<https://example.org/hardware>'],
            sourcePath: 'query-set/assets/cq-hardware.sparql'
          }
        ],
        warnings: []
      })
    });
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'Analyze coverage' }).click();

  await expect(page.getByRole('heading', { name: 'Coverage results' })).toBeVisible();
  await page.getByRole('tab', { name: 'Details' }).click();
  await expect(page.getByRole('table').getByText('Provider information is documented')).toBeVisible();
  await expect(page.getByRole('table').getByText('Hardware requirements are documented')).toBeVisible();
});
