import { Injectable } from '@tsed/di';
import { UserService } from './UserService';
import { UsersRepository } from '@tsed/prisma-models';
import { tokenCookieName } from '../constants/common';
import { Req } from '@tsed/common';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private usersRepository: UsersRepository) {}

    async getUserFromToken(req: Req) {
        const token = req.cookies[tokenCookieName];

        if (!token) {
            return null;
        }

        try {
            const decoded = await this.userService.isTokenValid(token);
            if (!decoded) {
                return null;
            }

            return await this.usersRepository.findFirst({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstname: true,
                    lastname: true,
                    role: true,
                    emailVerified: true,
                    createdAt: true,
                }
            }) || null;
        } catch (error) {
            console.error('Error in AuthService:', error);
            return null;
        }
    }
}
