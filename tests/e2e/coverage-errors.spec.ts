import { expect, test } from '@playwright/test';
import path from 'node:path';

test('invalidUpload_showsActionableErrorFeedback', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.setInputFiles('#originatingOntology', path.resolve('tests/fixtures/queries/sample.rq'));
  await page.setInputFiles('#instantiatedOntology', path.resolve('tests/fixtures/ontologies/instantiated.ttl'));
  await page.getByRole('button', { name: 'Analyze coverage' }).click();

  await expect(page.getByText('Coverage analysis failed')).toBeVisible();
});
