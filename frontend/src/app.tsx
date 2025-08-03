import { ComponentType } from 'react';
import ReactDOM from 'react-dom/client';
import '../sass/index.sass';
import { Banner } from './components/Banner/Banner';
import { Register } from './components/Register/Register';
import { ConfigProvider } from 'antd';
import { Login } from './components/Login/Login';
import { monitorTokenExpiration } from './misc/monitorTokenExpiration';
import UserDropdownMenu from './components/UserDropdownMenu/UserDropdownMenu';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { navbar } from './misc/navbar';
import { ForgotPassword } from './components/ForgotPassword/ForgotPassword';
import { ResetPassword } from './components/PasswordReset/ResetPassword';


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';

const resources: any = {
    en,
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

i18n.changeLanguage(window.appConfig.currentLocale);

function safeRender(Component: ComponentType, elementId: string, props: any = {}): void {
    const element = document.getElementById(elementId);
    if (element) {
        ReactDOM.createRoot(element).render(
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#ff8a0c',
                        fontFamily: 'PT Sans',
                        fontSize: 17,
                        borderRadius: 3,
                        controlHeight: 45,
                    },
                }}
            >
                <Component {...props} />
            </ConfigProvider>
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    navbar();
    monitorTokenExpiration();
    safeRender(Banner, 'banner');
    safeRender(UserDropdownMenu, 'userDropdownMenu');
    safeRender(Register, 'register');
    safeRender(ForgotPassword, 'forgotPassword');
    safeRender(Login, 'login');
    safeRender(ResetPassword, 'resetPassword');
    AOS.init({
        duration: 1000,
        once: true,
    });
});
