import { Middleware, Req, Res, Next } from '@tsed/common';

@Middleware()
export class AdminAuthenticationMiddleware {

    constructor() {}

    async use(@Req() _request: Req, @Res() response: Res, @Next() next: Next) {
        if (response.locals.user && response.locals.user.role === 'SUPERADMIN') {
            next();
        } else {
            return response.redirect('/');
        }
    }


}
