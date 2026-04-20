import { expect, test } from '@playwright/test';
import path from 'node:path';

test('happyPath_uploadsOntologies_andShowsSummary', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.setInputFiles('#originatingOntology', path.resolve('tests/fixtures/ontologies/originating.ttl'));
  await page.setInputFiles('#instantiatedOntology', path.resolve('tests/fixtures/ontologies/instantiated.ttl'));
  await page.getByRole('button', { name: 'Analyze coverage' }).click();

  await expect(page.getByText('Coverage analysis completed')).toBeVisible();
  await expect(page.getByRole('table').getByText('Provider information is documented')).toBeVisible();
  await expect(page.getByRole('table').getByText('Hardware requirements are documented')).toBeVisible();
});
