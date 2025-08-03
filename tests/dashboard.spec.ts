import { test, expect } from '@playwright/test';
import { LOCALES, getDisplayLocale, navigateAndWait } from './utils/test-helpers';

test.describe('Dashboard Page (Protected Route)', () => {
  LOCALES.forEach(locale => {
    const displayLocale = getDisplayLocale(locale);

    test(`redirects unauthenticated users to login (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/dashboard`);

      // Should redirect to login page
      await expect(page).toHaveURL(/\/login/);
    });
  });

  // TODO: Add tests for authenticated users
  // test.describe('When authenticated', () => {
  //   test.beforeEach(async ({ page }) => {
  //     // Set up authentication cookies/tokens here
  //   });
  //
  //   LOCALES.forEach(locale => {
  //     test(`loads dashboard content (${displayLocale})`, async ({ page }) => {
  //       await navigateAndWait(page, `${locale}/dashboard`);
  //       await expect(page.locator('main')).toBeAttached();
  //     });
  //   });
  // });
});
