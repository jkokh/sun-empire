import { UserModel } from '@tsed/prisma';
import { VerificationResult } from './common';

declare module '@tsed/common' {
    export interface Req {
        user: UserModel | null;
    }

    export interface Res {
        locals: {
            user?: UserModel | null;
            data: any;
            localizedUrl?: (path: string) => string;
            currentLocale?: string;
            verificationResult?: VerificationResult;
        };
    }
}
