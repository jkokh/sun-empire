import { Page, PageId } from '../types/common';

export const data: Page[] = [
    {
        id: 'cp',
        title: 'Control Panel',
        metaDescription: ''
    },
    {
        id: 'cp/categories',
        title: 'Categories / Control Panel',
        metaDescription: ''
    },
    {
        id: 'cp/products',
        title: 'Products / Control Panel',
        metaDescription: ''
    },
    {
        id: 'account/profile',
        title: 'Your Account Profile',
        metaDescription: 'Manage your account settings and personal information.'
    },
    {
        id: 'contacts',
        title: 'Our Contacts',
        metaDescription: 'How to reach us for support and questions.'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        metaDescription: 'View your dashboard to manage your activities.'
    },
    {
        id: 'forgot-password',
        title: 'Forgotten Password',
        metaDescription: 'Reset your password if you have forgotten it.'
    },
    {
        id: 'reset-password',
        title: 'Reset Password',
        metaDescription: 'Choose a new password.'
    },
    {
        id: 'home',
        title: 'Sun Empire The Band',
        metaDescription: 'Welcome to our website, explore our services.'
    },
    {
        id: 'login',
        title: 'Login',
        metaDescription: 'Login to access your account and start using our services.'
    },
    {
        id: 'privacy',
        title: 'Privacy Policy',
        metaDescription: 'Read our privacy policy to understand how we protect and use your data.'
    },
    {
        id: 'register',
        title: 'Register',
        metaDescription: 'Sign up to create an account and enjoy our services.'
    },
    {
        id: 'terms',
        title: 'Terms of Service',
        metaDescription: 'Understand the terms and conditions of using our website.'
    },
    {
        id: 'verify-email',
        title: 'Verify Your Email',
        metaDescription: 'Verify your email to complete your registration.'
    },
    {
        id: 'bad-reset-token',
        title: 'Reset Link Expired or Invalid',
        metaDescription: 'The link is invalid or expired.'
    }
];

export const getPage = (pageId: PageId): Page => data.find(page => page.id === pageId)!