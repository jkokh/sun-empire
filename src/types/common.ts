export type ErrorMessage = { field: string; message: string; };

export type ValidationErrorResponse = {
    message?: string;
    errors?: ErrorMessage[];
};

export type Credentials = {
    usernameOrEmail?: string;
    password?: string;
}

export type LoginData = {
    usernameOrEmail: string;
    password: string;
    deviceId: string;
    keepSignedIn: boolean;
}

export type JWTPayload = {
    userId: number;
    email: string;
    deviceId: string;
    lifespan: string;
    iat: number;
    iss?: string | undefined;
    sub?: string | undefined;
    aud?: string | string[] | undefined;
    exp: number;
    nbf?: number | undefined;
    jti?: string | undefined;
}

export type UserDevice = {
    userId: number;
    email: string;
    deviceId: string;
}

export type VerificationResult = 'Verified' | 'Unchanged' | 'NotFound';

export type PageId = 'account/profile' | 'contacts' | 'dashboard' | 'forgot-password'
    | 'home' | 'login' | 'privacy' | 'register' | 'terms'
    | 'verify-email' | 'reset-password' | 'bad-reset-token' | 'cp' | 'cp/categories' | 'cp/products';

export type Page = {
    id: PageId;
    title: string;
    metaDescription: string;
}