import { test, expect } from '@playwright/test';
import { LOCALES, getDisplayLocale, navigateAndWait, expectCorrectUrl } from './utils/test-helpers';

test.describe('Terms Page', () => {
  LOCALES.forEach(locale => {
    const displayLocale = getDisplayLocale(locale);

    test(`loads successfully (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/terms`);
      await expect(page.locator('main')).toBeAttached();
      await expectCorrectUrl(page, locale, '/terms');
    });

    test(`displays terms content (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/terms`);

      // Check that main content exists
      const mainContent = page.locator('main');
      await expect(mainContent).toBeAttached();

      // Terms pages typically have significant text content
      const textContent = await mainContent.textContent();
      expect(textContent?.length || 0).toBeGreaterThan(10);
    });
  });
});
