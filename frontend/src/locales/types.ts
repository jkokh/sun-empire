export interface Translations {
    translation: {
        welcome: string;
        greeting: string;
        login: {
            usernameOrEmailLabel: string;
            usernameOrEmailRequired: string;
            usernameOrEmailPlaceholder: string;
            passwordLabel: string;
            passwordRequired: string;
            passwordPlaceholder: string;
            forgotPassword: string;
            signIn: string;
            keepSignedIn: string;
            loginSucceededNoToken: string;
            unexpectedError: string;
        };
        forgotPassword: {
            enterEmailOrUsername: string;
            emailOrUsernameLabel: string;
            emailOrUsernameRequired: string;
            emailOrUsernamePlaceholder: string;
            recaptchaRequired: string;
            resetPassword: string;
            backToSignIn: string;
            noAccountFound: string;
            unexpectedError: string;
            requestReceived: string;
            checkEmail: string;
        };
        userDropdownMenu: {
            userProfile: string;
            settings: string;
            signOut: string;
        };
    };
}
