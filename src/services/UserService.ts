import { Injectable } from '@tsed/di';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { UsersRepository, TokenValiditiesRepository, UserModel } from '@tsed/prisma-models';
import { UserDto } from '../models/User';
import crypto from 'crypto';

import { v4 as uuid } from 'uuid';
import { BadRequest, Unauthorized } from '@tsed/exceptions';
import { decodeToken, deleteCookie, getToken } from '../misc/serverUtils';
import { ValidationError } from '../misc/ValidationError';
import { generateUserName, validatePassword } from '../misc/utils';
import { Inject, Res } from '@tsed/common';
import { EmailService } from './EmailService';
import {
    longTokenLifespan,
    secretKey,
    shortTokenLifespan,
    TOKEN_VALIDITY_DURATION,
    tokenCookieName,
    tokenExpCookieName,
} from '../constants/common';
import { JWTPayload, VerificationResult } from '../types';
import * as jwt from 'jsonwebtoken';
import { RecaptchaService } from './RecaptchaService';


@Injectable()
export class UserService {

    @Inject()
    private emailService: EmailService;

    @Inject()
    private usersRepository: UsersRepository;

    @Inject()
    private tokenValiditiesRepository: TokenValiditiesRepository;

    @Inject()
    private recaptchaService: RecaptchaService;

    async register(userDetails: UserDto): Promise<{email: string; username: string; firstname: string; lastname: string;}> {
        const username = userDetails.username || generateUserName();
        await this.checkIfUserExists(userDetails.email, username);
        await this.validateRecaptcha(userDetails.recaptcha);
        const hashedPassword = await this.getHashedPassword(userDetails.password);
        const user = await this.usersRepository.create({
            data: {
                email: userDetails.email,
                username,
                password: hashedPassword,
                firstname: userDetails.firstname,
                lastname: userDetails.lastname,
                verifyToken: uuid(),
                tokenCreatedAt: new Date(),
                role: Role.USER,
            },
        });
        const { password, verifyToken, emailVerified, tokenCreatedAt, createdAt, id, role, ...userData } = user;
        try {
            await this.emailService.sendVerificationEmail(user, verifyToken!);
        } catch (error) {
            console.error('Failed to send verification email:', error);
        }
        return userData;
    }

    async validateUser(usernameOrEmail: string, password: string, deviceId: string, keepSignedIn: boolean): Promise<string> {
        const user = await this.usersRepository.findFirst({
            where: {
                OR: [
                    { email: usernameOrEmail },
                    { username: usernameOrEmail },
                ],
            },
        });
        const isValidUser = user && await bcrypt.compare(password, user.password);
        if (!isValidUser) {
            throw new BadRequest('Invalid email, username, or password.');
        }
        return getToken({ userId: user.id, email: user.email, deviceId }, keepSignedIn ? longTokenLifespan : shortTokenLifespan);
    }

    async verifyEmail(token: string): Promise<VerificationResult> {
        if (!token) {
            return 'NotFound';
        }
        try {
            const user = await this.usersRepository.findUnique({
                where: { verifyToken: token },
            });
            if (!user) {
                return 'NotFound';
            }
            if (user.emailVerified) {
                return 'Unchanged';
            }
            await this.usersRepository.update({
                where: { id: user.id },
                data: { emailVerified: true },
            });
            return 'Verified';
        } catch (error) {
            console.error('Error in verifyUser:', error);
            throw new Error('Verification process failed.');
        }
    }

    async requestPasswordReset(identifier: string, recaptcha: string): Promise<void> {
        await this.validateRecaptcha(recaptcha);  // Assume this function validates reCAPTCHA
        const user = await this.usersRepository.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });
        if (user) {
            const token = crypto.randomBytes(20).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            await this.usersRepository.update({
                where: { id: user.id },
                data: { resetToken: hashedToken, resetTokenCreatedAt: new Date() }
            });
            try {
                await this.emailService.sendResetPassword(user, token);
            } catch (error) {
                console.error('Failed to send reset password email:', error);
            }
        }
    }

    async resetPassword(password: string, token: string): Promise<void> {
        if (!validatePassword(password)) {
            throw new BadRequest('Invalid password. Password must meet the complexity requirements.');
        }
        const user = await this.validateResetToken(token);
        if (!user) {
            throw new BadRequest('Invalid or expired token.');
        }
        await this.usersRepository.update({
            where: { id: user.id },
            data: {
                password: await this.getHashedPassword(password),
                resetToken: null,
                resetTokenCreatedAt: null
            }
        });
    }

    async refreshToken(token: string): Promise<string> {
        if (!token) {
            throw new Unauthorized('No token provided');
        }
        const decoded = await this.isTokenValid(token);
        if (!decoded) {
            throw new Error('Token has been invalidated');
        }
        return getToken({ userId: decoded.userId, email: decoded.email, deviceId: decoded.deviceId }, shortTokenLifespan);
    }

    async invalidateToken(token: string): Promise<void> {
        const { userId, deviceId } = decodeToken(token);
        await this.tokenValiditiesRepository.upsert({
            where: {
                userId_deviceId: { userId, deviceId },
            },
            update: {
                validFrom: new Date(),
            },
            create: {
                userId,
                deviceId,
                validFrom: new Date(),
            },
        });
    }

    async isTokenValid(token: string): Promise<JWTPayload | false> {
        try {
            const decoded = jwt.verify(token, secretKey) as JWTPayload;
            const { userId, deviceId, iat } = decoded;
            const validity = await this.tokenValiditiesRepository.findUnique({
                where: {
                    userId_deviceId: { userId, deviceId },
                },
            });
            const issuedAt = new Date(iat * 1000);
            if (!validity) return decoded;
            // Check if the token's issued time is within the validity period
            return (!validity || issuedAt >= validity.validFrom) ? decoded : false;
        } catch (error) {
            console.error('Error validating token:', error);
            return false; // Assume the token is invalid if an error occurs
        }
    }

    public setAuthCookies(response: Res, token: string) {
        const decoded = decodeToken(token);
        const expires = new Date(decoded.exp * 1000);
        response.cookie(tokenExpCookieName, decoded.exp, { path: '/', sameSite: 'strict', expires });
        response.cookie(tokenCookieName, token, { httpOnly: true, secure: true, path: '/', sameSite: 'strict' , expires });
    }

    public deleteAuthCookies(response: Res) {
        deleteCookie(response, tokenCookieName);
        deleteCookie(response, tokenExpCookieName);
    }

    public async validateResetToken(token: string): Promise<UserModel> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await this.usersRepository.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenCreatedAt: {
                    gte: new Date(new Date().getTime() - TOKEN_VALIDITY_DURATION)
                }
            }
        });
        if (!user) {
            throw new BadRequest('Invalid or expired token.');
        }
        return user;
    }

    private async getHashedPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    private async validateRecaptcha(recaptchaToken: string): Promise<void> {
        const isValidRecaptcha = await this.recaptchaService.validate(recaptchaToken);
        if (!isValidRecaptcha) {
            throw new ValidationError('recaptcha', 'Invalid reCAPTCHA. Please try again');
        }
    }

    private async checkIfUserExists(email: string, username: string): Promise<void> {
        const existingUser = await this.usersRepository.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });
        if (existingUser) {
            const errorField = existingUser.email === email ? 'email' : 'username';
            throw new ValidationError(errorField, `This ${errorField} is already in use`);
        }
    }

}
