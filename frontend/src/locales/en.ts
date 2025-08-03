import { Translations } from './types';

const en: Translations = {
    translation: {
        welcome: 'Welcome',
        greeting: 'Hello, {{name}}!',
        login: {
            usernameOrEmailLabel: 'Username or E-mail',
            usernameOrEmailRequired: 'Please input your username or E-mail!',
            usernameOrEmailPlaceholder: 'Enter your username or email',
            passwordLabel: 'Password',
            passwordRequired: 'Please input your password!',
            passwordPlaceholder: 'Enter your password',
            forgotPassword: 'Forgot password?',
            signIn: 'Sign In',
            keepSignedIn: 'Keep me signed in',
            loginSucceededNoToken: 'Login succeeded but no token was returned.',
            unexpectedError: 'An unexpected error occurred',
        },
        forgotPassword: {
            enterEmailOrUsername: 'Enter the email address or username associated with your account.',
            emailOrUsernameLabel: 'E-mail or Username',
            emailOrUsernameRequired: 'Please enter your email or username!',
            emailOrUsernamePlaceholder: 'Enter your email or username',
            recaptchaRequired: 'Please complete the reCAPTCHA!',
            resetPassword: 'Reset Password',
            backToSignIn: 'Back to Sign In',
            noAccountFound: 'No account found with that identifier.',
            unexpectedError: 'An unexpected error occurred',
            requestReceived: 'Request Received',
            checkEmail: 'If there is an account associated with the email or username you provided, you will receive an email with a link to reset your password. Please check your email inbox for further instructions.',
        },
        userDropdownMenu: {
            userProfile: 'User Profile',
            settings: 'Settings',
            signOut: 'Sign Out',
        },
    },
};

export default en;
