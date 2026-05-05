import { expect, test } from '@playwright/test';

test('happyPath_selectsExample_andShowsSummary', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.selectOption('#instantiatedExample', 'hr-ai');
  await page.getByRole('button', { name: 'Analyze coverage' }).click();

  await expect(page.getByText('Coverage analysis completed')).toBeVisible();
  await expect(page.getByRole('table').getByText('Provider information is documented')).toBeVisible();
  await expect(page.getByRole('table').getByText('Hardware requirements are documented')).toBeVisible();
});
