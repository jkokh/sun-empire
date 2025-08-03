import { Middleware, Req, Res, Next } from '@tsed/common';
import { AuthService } from '../services/AuthService';
import { GetUserMiddleware } from './GetUserMiddleware';
import { localizedUrl } from '../misc/serverUtils';

@Middleware()
export class AuthenticationMiddleware extends GetUserMiddleware {
    constructor(authService: AuthService) {
        super(authService);
    }

    async use(@Req() request: Req, @Res() response: Res, @Next() next: Next) {
        await this.loadUserIfNeeded(request, response);

        if (!request.user) {
            return request.url.startsWith('/api/')
                ? response.status(401).send('Unauthorized')
                : response.redirect(localizedUrl(request, 'login'));
        }

        next();
    }
}
