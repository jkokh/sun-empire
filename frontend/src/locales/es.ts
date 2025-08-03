import { Translations } from './types';

const es: Translations = {
    translation: {
        welcome: 'Bienvenido',
        greeting: 'Hola, {{name}}!',
        login: {
            usernameOrEmailLabel: 'Nombre de usuario o correo electrónico',
            usernameOrEmailRequired: '¡Por favor, ingrese su nombre de usuario o correo electrónico!',
            usernameOrEmailPlaceholder: 'Ingrese su nombre de usuario o correo electrónico',
            passwordLabel: 'Contraseña',
            passwordRequired: '¡Por favor, ingrese su contraseña!',
            passwordPlaceholder: 'Ingrese su contraseña',
            forgotPassword: '¿Olvidaste tu contraseña?',
            signIn: 'Iniciar sesión',
            keepSignedIn: 'Mantenerme conectado',
            loginSucceededNoToken: 'Inicio de sesión exitoso, pero no se devolvió un token.',
            unexpectedError: 'Ocurrió un error inesperado',
        },
        forgotPassword: {
            enterEmailOrUsername: 'Ingrese la dirección de correo electrónico o el nombre de usuario asociado con su cuenta.',
            emailOrUsernameLabel: 'Correo electrónico o nombre de usuario',
            emailOrUsernameRequired: '¡Por favor, ingrese su correo electrónico o nombre de usuario!',
            emailOrUsernamePlaceholder: 'Ingrese su correo electrónico o nombre de usuario',
            recaptchaRequired: '¡Por favor, complete el reCAPTCHA!',
            resetPassword: 'Restablecer contraseña',
            backToSignIn: 'Volver a Iniciar sesión',
            noAccountFound: 'No se encontró ninguna cuenta con ese identificador.',
            unexpectedError: 'Ocurrió un error inesperado',
            requestReceived: 'Solicitud recibida',
            checkEmail: 'Si hay una cuenta asociada con el correo electrónico o nombre de usuario que proporcionó, recibirá un correo electrónico con un enlace para restablecer su contraseña. Por favor, revise su bandeja de entrada para obtener más instrucciones.',
        },
        userDropdownMenu: {
            userProfile: 'Perfil de Usuario',
            settings: 'Configuraciones',
            signOut: 'Cerrar Sesión',
        },
    },
};

export default es;
