import { Middleware, Req, Res, Next } from '@tsed/common';
import { AuthService } from '../services/AuthService';

@Middleware()
export class GetUserMiddleware {
    constructor(private authService: AuthService) {}

    async use(@Req() request: Req, @Res() response: Res, @Next() next: Next): Promise<void | Res> {
        await this.loadUserIfNeeded(request, response);
        next();
    }

    protected async loadUserIfNeeded(request: Req, response: Res): Promise<void> {
        if (!request.user) {
            request.user = await this.authService.getUserFromToken(request);
            response.locals.user = request.user;
        }
    }
}
