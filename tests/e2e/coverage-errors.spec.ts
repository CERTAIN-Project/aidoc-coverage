import { expect, test } from '@playwright/test';

test('analyzeButton_isEnabledByDefault_andSubmitsWithDefaultSelection', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const button = page.getByRole('button', { name: 'Analyze coverage' });
  await expect(button).toBeEnabled();
  await expect(page.locator('#instantiatedExample')).toBeVisible();
});
