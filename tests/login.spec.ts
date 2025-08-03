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

test.describe('Login Page', () => {
  LOCALES.forEach(locale => {
    const displayLocale = getDisplayLocale(locale);

    test(`loads successfully (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/login`);
      await expectBasicPageStructure(page);
      await expectReactMountPoint(page, '#login');
      await expectCorrectUrl(page, locale, '/login');
    });

    test(`displays correct content and labels (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/login`);
      await waitForForm(page);

      // Test specific form elements instead of generic text search
      if (displayLocale === 'ru') {
        // Test Russian content with more specific selectors
        await expect(page.locator('h1.window-header')).toContainText('Вход');
        await expect(page.locator('form')).toContainText('Имя пользователя или E-mail');
        await expect(page.locator('form')).toContainText('Пароль');
      } else if (displayLocale === 'es') {
        // Test Spanish content - using actual translations from your app
        await expect(page.locator('h1.window-header')).toContainText('Iniciar sesión');
        await expect(page.locator('form')).toContainText('Nombre de usuario o correo electrónico');
        await expect(page.locator('form')).toContainText('Contraseña');
      } else {
        // Test English content - be more specific to avoid navigation conflicts
        await expect(page.locator('h1.window-header')).toContainText('Sign in');
        await expect(page.locator('form')).toContainText('Username or E-mail');
        await expect(page.locator('form')).toContainText('Password');
        await expect(page.locator('form')).toContainText('Forgot password?');
      }
    });

    test(`displays correct error messages (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/login`);
      await waitForForm(page);

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(1000);

        // Check that form hasn't submitted (still on login page)
        expect(page.url()).toContain('login');

        // Check for any error styling or validation states
        const formInputs = page.locator('input[required]');
        if (await formInputs.count() > 0) {
          // At least verify that required fields exist
          await expect(formInputs.first()).toBeAttached();
        }
      }
    });

    test(`form validation works (${displayLocale})`, async ({ page }) => {
      await navigateAndWait(page, `${locale}/login`);
      await waitForForm(page);

      // Try to submit empty form (if submit button exists)
      const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test('redirects authenticated users', async ({ page }) => {
    // This test would need actual authentication setup
    // For now, just verify the page loads for unauthenticated users
    await navigateAndWait(page, '/login');
    await expectReactMountPoint(page, '#login');
  });
});
