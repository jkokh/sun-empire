import * as jwt from 'jsonwebtoken';
import { JWTPayload, UserDevice } from '../types';
import { cookieOptions, secretKey } from '../constants/common';
import { Req, Res } from '@tsed/common';
import { Secret, SignOptions } from 'jsonwebtoken';

export const localizedUrl = (req: Req, path: string = ''): string => {
    let lang = req.params.lang || 'en';
    return lang === 'en' ? `/${path}` : `/${lang}/${path}`;
};

export const decodeToken = (token: string): JWTPayload => {
    const decoded = jwt.decode(token);
    if (!decoded) {
        throw new Error('Invalid token');
    }
    return decoded as JWTPayload;
};

export const getToken = ({ userId, email, deviceId }: UserDevice, lifespan: jwt.SignOptions['expiresIn']): string => {
    const options: SignOptions = { expiresIn: lifespan };
    return jwt.sign({ userId, email, deviceId }, secretKey as Secret, options);
}

export const deleteCookie = (response: Res, name: string, path: string = '/'): void => {
    response.cookie(name, '', {
        ...cookieOptions,
        path,
        expires: new Date(0), // Setting to epoch time to ensure immediate expiration
        maxAge: 0
    });
};

export const redirectIfAuthenticated = (req: Req, res: Res, redirectUrl: string = 'dashboard') => {
    if (req.user) {
        res.redirect(localizedUrl(req, redirectUrl));
        return true;
    }
    return false;
}