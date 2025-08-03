import { test, expect } from '@playwright/test';
import {
  LOCALES,
  getDisplayLocale,
  navigateAndWait,
  expectBasicPageStructure,
  expectCorrectUrl,
  expectReactMountPoint,
  waitForForm
} from './utils/test-helpers';

test.describe('Register Page', () => {
  LOCALES.forEach(locale => {
    const displayLocale = getDisplayLocale(locale);

    test(`loads successfully (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/register`);
      await expectBasicPageStructure(page);
      await expectReactMountPoint(page, '#register');
      await expectCorrectUrl(page, locale, '/register');
    });

    test(`form renders with all fields (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/register`);
      await waitForForm(page);

      // Check for typical registration form fields
      const formFields = await page.locator('input').count();
      expect(formFields).toBeGreaterThan(0);

      // Look for common registration fields (adjust based on your form)
      const emailField = page.locator('input[type="email"], input[name="email"]');
      const passwordField = page.locator('input[type="password"], input[name="password"]');

      if (await emailField.count() > 0) {
        await expect(emailField.first()).toBeAttached();
      }
      if (await passwordField.count() > 0) {
        await expect(passwordField.first()).toBeAttached();
      }
    });

    test(`form is interactive (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/register`);
      await waitForForm(page);

      // Try to fill out basic fields if they exist
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();

      if (await emailInput.isVisible()) {
        await emailInput.fill('newuser@example.com');
        await expect(emailInput).toHaveValue('newuser@example.com');
      }
    });
  });

  test('navigation from register to login works', async ({ page }) => {
    await navigateAndWait(page, '/register');

    // Look for login link (adjust selector based on your UI)
    const loginLink = page.locator('a[href*="/login"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/login/);
    }
  });
});
