import { test, expect } from '@playwright/test';
import {
  LOCALES,
  getDisplayLocale,
  navigateAndWait,
  expectBasicPageStructure,
  expectCorrectUrl,
  filterCommonErrors
} from './utils/test-helpers';

test.describe('Home Page', () => {
  LOCALES.forEach(locale => {
    const displayLocale = getDisplayLocale(locale);

    test(`loads successfully (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/`);
      await expectBasicPageStructure(page);
      await expect(page.locator('footer')).toBeAttached();
      await expect(page).toHaveTitle(/Home|Shop/i);
      await expectCorrectUrl(page, locale, '/');
    });

    test(`navigation works correctly (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/`);

      // Test navigation to contacts page
      const contactsLink = page.locator('a[href*="/contacts"]').first();
      if (await contactsLink.isVisible()) {
        await contactsLink.click();
        await page.waitForLoadState('networkidle');

        const expectedContactsUrl = locale ? `${locale}/contacts` : '/contacts';
        expect(page.url()).toContain(expectedContactsUrl);
      }
    });
  });

  test('language switching works', async ({ page }) => {
    // Start on English home page
    await navigateAndWait(page, '/');

    // Navigate through all locales
    for (const locale of ['/ru', '/es', '/']) {
      await navigateAndWait(page, locale);
      await expect(page.locator('main')).toBeAttached();
    }
  });

  test('no JavaScript errors on any locale', async ({ page }) => {
    for (const locale of LOCALES) {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await navigateAndWait(page, `${locale}/`);
      await page.waitForTimeout(2000);

      const realErrors = filterCommonErrors(errors);

      // Debug: Log what errors we're actually getting
      if (realErrors.length > 0) {
        console.log(`JavaScript errors found on ${locale || 'en'} locale:`, realErrors);
      }

      expect(realErrors.length).toBe(0);
    }
  });
});
