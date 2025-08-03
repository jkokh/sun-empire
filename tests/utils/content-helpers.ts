import { Page, expect } from '@playwright/test';

// Content testing utilities for different locales
export const expectLocalizedContent = async (page: Page, locale: string, contentMap: Record<string, string[]>) => {
  const displayLocale = locale || 'en';
  const texts = contentMap[displayLocale] || contentMap['en'];

  for (const text of texts) {
    // Use first() to handle multiple elements with same text
    await expect(page.locator(`text=${text}`).first()).toBeVisible();
  }
};

// More specific content testing for unique elements
export const expectSpecificContent = async (page: Page, selector: string, expectedText: string) => {
  await expect(page.locator(selector)).toContainText(expectedText);
};

// Predefined content maps for common pages
export const LOGIN_CONTENT = {
  en: ['Sign in', 'Username or E-mail', 'Password', 'Forgot password?', 'Keep me signed in'],
  ru: ['Войти', 'Имя пользователя или E-mail', 'Пароль', 'Забыли пароль?', 'Оставаться в системе'],
  es: ['Iniciar sesión', 'Usuario o E-mail', 'Contraseña', '¿Olvidaste tu contraseña?', 'Mantenerme conectado']
};

export const REGISTER_CONTENT = {
  en: ['Create Account', 'First Name', 'Last Name', 'Email', 'Password', 'Register'],
  ru: ['Создать аккаунт', 'Имя', 'Фамилия', 'E-mail', 'Пароль', 'Регистрация'],
  es: ['Crear Cuenta', 'Nombre', 'Apellido', 'Email', 'Contraseña', 'Registrarse']
};

export const ERROR_MESSAGES = {
  en: ['This field is required', 'Invalid email format', 'Password too short'],
  ru: ['Это поле обязательно', 'Неверный формат email', 'Пароль слишком короткий'],
  es: ['Este campo es requerido', 'Formato de email inválido', 'Contraseña muy corta']
};

// Usage example:
// await expectLocalizedContent(page, locale, LOGIN_CONTENT);
