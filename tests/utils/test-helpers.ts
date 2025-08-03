import { Page, expect } from '@playwright/test';

// Common constants
export const LOCALES = ['', '/ru', '/es']; // Empty string for default English

// Helper functions
export const getDisplayLocale = (locale: string): string => {
  if (locale === '/ru') return 'ru';
  if (locale === '/es') return 'es';
  return 'en'; // Default for empty string or anything else
};

export const getExpectedUrl = (locale: string, path: string): string => {
  return locale ? `${locale}${path}` : path;
};

// Common page actions
export const navigateAndWait = async (page: Page, url: string): Promise<void> => {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
};

// Common assertions
export const expectBasicPageStructure = async (page: Page): Promise<void> => {
  await expect(page.locator('nav#navbar')).toBeAttached();
  await expect(page.locator('main')).toBeAttached();
};

export const expectPageStructureWithFooter = async (page: Page): Promise<void> => {
  await expectBasicPageStructure(page);
  await expect(page.locator('footer')).toBeAttached();
};

export const expectCorrectUrl = async (page: Page, locale: string, path: string): Promise<void> => {
  const expectedUrl = getExpectedUrl(locale, path);
  expect(page.url()).toContain(expectedUrl);
};

// Form-specific helpers
export const waitForForm = async (page: Page, timeout: number = 10000): Promise<void> => {
  await page.waitForSelector('form', { timeout });
  await expect(page.locator('form')).toBeAttached();
};

export const expectReactMountPoint = async (page: Page, selector: string): Promise<void> => {
  await expect(page.locator(selector).first()).toBeAttached();
};

// Error handling
export const filterCommonErrors = (errors: string[]): string[] => {
  return errors.filter(log =>
    !log.includes('React') &&
    !log.includes('Warning') &&
    !log.includes('Download the React DevTools') &&
    !log.includes('No token expiration information available.')
  );
};

// Test generators for common patterns
export const createBasicLoadTest = (path: string, extraChecks?: (page: Page) => Promise<void>) => {
  return LOCALES.forEach(locale => {
    const displayLocale = getDisplayLocale(locale);

    return async ({ page }: { page: Page }) => {
      await navigateAndWait(page, `${locale}${path}`);
      await expectBasicPageStructure(page);
      await expectCorrectUrl(page, locale, path);

      if (extraChecks) {
        await extraChecks(page);
      }
    };
  });
};
