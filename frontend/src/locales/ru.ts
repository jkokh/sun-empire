import { Translations } from './types';

const ru: Translations = {
    translation: {
        welcome: 'Добро пожаловать',
        greeting: 'Привет, {{name}}!',
        login: {
            usernameOrEmailLabel: 'Имя пользователя или E-mail',
            usernameOrEmailRequired: 'Пожалуйста, введите ваше имя пользователя или E-mail!',
            usernameOrEmailPlaceholder: 'Введите ваше имя пользователя или E-mail',
            passwordLabel: 'Пароль',
            passwordRequired: 'Пожалуйста, введите ваш пароль!',
            passwordPlaceholder: 'Введите ваш пароль',
            forgotPassword: 'Забыли пароль?',
            signIn: 'Войти',
            keepSignedIn: 'Оставаться в системе',
            loginSucceededNoToken: 'Вход выполнен успешно, но токен не был возвращен.',
            unexpectedError: 'Произошла непредвиденная ошибка',
        },
        forgotPassword: {
            enterEmailOrUsername: 'Введите адрес электронной почты или имя пользователя, связанное с вашей учетной записью.',
            emailOrUsernameLabel: 'E-mail или Имя пользователя',
            emailOrUsernameRequired: 'Пожалуйста, введите ваш E-mail или имя пользователя!',
            emailOrUsernamePlaceholder: 'Введите ваш E-mail или имя пользователя',
            recaptchaRequired: 'Пожалуйста, пройдите проверку reCAPTCHA!',
            resetPassword: 'Сбросить пароль',
            backToSignIn: 'Вернуться ко входу',
            noAccountFound: 'Учетная запись с таким идентификатором не найдена.',
            unexpectedError: 'Произошла непредвиденная ошибка',
            requestReceived: 'Запрос получен',
            checkEmail: 'Если учетная запись связана с предоставленным вами E-mail или именем пользователя, вы получите письмо с ссылкой для сброса пароля. Пожалуйста, проверьте свою почту для получения дальнейших инструкций.',
        },
        userDropdownMenu: {
            userProfile: 'Профиль пользователя',
            settings: 'Настройки',
            signOut: 'Выйти',
        },
    },
};

export default ru;
