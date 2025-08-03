import { CookieOptions } from 'express';
export const domain = 'sun-empire.com';
export const secretKey = 'ab63ff363714b2b474bba1a364d51ee613fc7f0a243a8d3a4f9ba4678768962c';
export const shortTokenLifespan = '300s';
export const longTokenLifespan = '365d';
export const tokenCookieName = 'token';
export const tokenExpCookieName = 'token-exp';
export const cookieOptions: Partial<CookieOptions> = {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict'
}
export const recaptchaKey = '6LetFqspAAAAAGfM6eILyQpo3s0qreRsB89aKrk6';
export const passwordPolicy = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export const TOKEN_VALIDITY_DURATION = 4 * 60 * 60 * 1000;