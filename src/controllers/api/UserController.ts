import { BodyParams, Controller, Post, Req, Res } from '@tsed/common';
import { User } from '../../models/User';
import { UserService } from '../../services/UserService';
import { Get } from '@tsed/schema';
import { tokenCookieName } from '../../constants/common';
import { UserModel } from '@tsed/prisma-models';
import { BadRequest } from '@tsed/exceptions';

@Controller('/users')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Post('/register')
    async register(@BodyParams() userDto: User): Promise<Partial<UserModel>> {
        return await this.userService.register(userDto);
    }

    @Post('/login')
    async login(
        @BodyParams() { usernameOrEmail, password, deviceId, keepSignedIn }: {
            usernameOrEmail: string,
            password: string,
            deviceId: string,
            keepSignedIn: boolean
        }, @Res() response: Res): Promise<any> {
        try {
            const token = await this.userService.validateUser(usernameOrEmail, password, deviceId, keepSignedIn);
            this.userService.setAuthCookies(response, token);
            return response.json({ status: 'ok' });
        } catch (error) {
            return response.status(401).json({ message: error.message });
        }
    }

    @Get('/keep-alive')
    async keepAlive(@Req() request: Req, @Res() response: Res): Promise<any> {
        try {
            const token = await this.userService.refreshToken(request.cookies[tokenCookieName]);
            this.userService.setAuthCookies(response, token);
            return 'ok';
        } catch (error) {
            return response.status(401).json({ message: error.message });
        }
    }

    @Get('/logout')
    async logout(@Req() request: Req, @Res() response: Res): Promise<any> {
        try {
            await this.userService.invalidateToken(request.cookies[tokenCookieName]);
            this.userService.deleteAuthCookies(response);
            return 'ok';
        } catch (error) {
            return response.status(401).json({ message: error.message });
        }
    }

    @Post('/request-reset-password')
    async requestResetPassword(
        @BodyParams('identifier') identifier: string,
        @BodyParams('recaptcha') recaptcha: string,
        @Res() response: Res
    ): Promise<any> {
        try {
            await this.userService.requestPasswordReset(identifier, recaptcha);
            return response.json({ status: 'ok' });
        } catch (error) {
            if (error instanceof BadRequest) {
                return response.status(400).json({ message: error.message });
            }
            return response.status(500).json({ message: 'Internal server error.' });
        }
    }

    @Post('/reset-password')
    async resetPassword(
        @BodyParams('password') password: string,
        @BodyParams('token') token: string,
        @Res() response: Res
    ): Promise<any> {
        await this.userService.resetPassword(password, token);
        return response.json({ status: 'ok' });
    }

}
