import { test, expect } from '@playwright/test';
import { LOCALES, getDisplayLocale, navigateAndWait, expectBasicPageStructure, expectCorrectUrl } from './utils/test-helpers';

test.describe('Contacts Page', () => {
  LOCALES.forEach(locale => {
    const displayLocale = getDisplayLocale(locale);

    test(`loads successfully (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/contacts`);
      await expectBasicPageStructure(page);
      await expectCorrectUrl(page, locale, '/contacts');
    });

    test(`displays contact information (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/contacts`);

      // Check that main content area exists
      const mainContent = page.locator('main');
      await expect(mainContent).toBeAttached();
    });
  });

  test('navigation between locales works', async ({ page }) => {
    // Test navigation between different locale versions of contacts
    for (const locale of LOCALES) {
      await navigateAndWait(page, `${locale}/contacts`);
      await expectBasicPageStructure(page);
    }
  });
});
