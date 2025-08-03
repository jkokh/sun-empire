import { Middleware, Req, Res, Next } from '@tsed/common';
import i18n from 'i18n';
import { localizedUrl } from '../misc/serverUtils';

@Middleware()
export class SetLocaleMiddleware {
    use(@Req() req: Req, @Res() res: Res, @Next() next: Next): void {
        const lang = req.params.lang || 'en';
        res.locals.localizedUrl = (path: string) => localizedUrl(req, path);
        res.locals.currentLocale = lang;
        i18n.setLocale(req, lang);
        next();
    }
}