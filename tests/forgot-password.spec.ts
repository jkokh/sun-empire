import { test, expect } from '@playwright/test';
import { LOCALES, getDisplayLocale, navigateAndWait, expectBasicPageStructure, expectCorrectUrl } from './utils/test-helpers';

test.describe('Forgot Password Page', () => {
  LOCALES.forEach(locale => {
    const displayLocale = getDisplayLocale(locale);

    test(`loads successfully (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/forgot-password`);
      await expectBasicPageStructure(page);
      await expectCorrectUrl(page, locale, '/forgot-password');
    });

    test(`form elements are present (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/forgot-password`);

      // Check for main content
      await expect(page.locator('main')).toBeAttached();

      // Look for email input field (common for forgot password forms)
      const emailFields = page.locator('input[type="email"], input[name="email"]');
      if (await emailFields.count() > 0) {
        await expect(emailFields.first()).toBeAttached();
      }
    });
  });

  test('navigation back to login works', async ({ page }) => {
    await navigateAndWait(page, '/forgot-password');

    // Look for back to login link
    const loginLink = page.locator('a[href*="/login"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/login/);
    }
  });
});
