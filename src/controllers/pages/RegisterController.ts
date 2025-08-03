import { Controller, Get, Inject, QueryParams, Req, Res, UseBefore } from '@tsed/common';
import { View } from '@tsed/platform-views';
import { Hidden } from '@tsed/schema';
import { GetUserMiddleware } from '../../middleware/GetUserMiddleware';
import { SetLocaleMiddleware } from '../../middleware/SetLocaleMiddleware';
import { UserService } from '../../services/UserService';
import { localizedUrl, redirectIfAuthenticated } from '../../misc/serverUtils';
import { getPage } from '../../data/pages';

@Hidden()
@Controller('/:lang?')
@UseBefore(GetUserMiddleware)
@UseBefore(SetLocaleMiddleware)
export class RegisterController {

    @Inject()
    private userService: UserService;

    @Get('/register')
    @View('register')
    signUp(@Req() req: Req, @Res() res: Res) {
        if (redirectIfAuthenticated(req, res)) return;
        return { page: getPage('register') };
    }

    @Get('/login')
    @View('login')
    signIn(@Req() req: Req, @Res() res: Res) {
        if (req.user) return res.redirect(localizedUrl(req, 'dashboard'));
        return { page: getPage('login') };
    }

    @Get('/verify-email')
    @View('verify-email')
    async verify(@QueryParams('token') token: string, @Res() res: Res) {
        res.locals.verificationResult = await this.userService.verifyEmail(token);
        return { page: getPage('verify-email') };
    }

    @Get('/forgot-password')
    @View('forgot-password')
    forgotPassword(@Req() req: Req, @Res() res: Res) {
        if (req.user) return res.redirect(localizedUrl(req, 'dashboard'));
        return { page: getPage('forgot-password') };
    }

    @Get('/reset-password')
    @View('reset-password')
    async passwordReset(@Req() req: Req, @Res() res: Res, @QueryParams('token') token: string) {
        if (redirectIfAuthenticated(req, res)) return;
        try {
            await this.userService.validateResetToken(token);
            return { page: getPage('reset-password') };
        } catch (error) {
            return { page: getPage('bad-reset-token') };
        }
    }

    @Get('/terms')
    @View('terms')
    terms() {
        return { page: getPage('terms') };
    }

    @Get('/privacy-policy')
    @View('privacy')
    privacyPolicy() {
        return { page: getPage('privacy') };
    }
}
