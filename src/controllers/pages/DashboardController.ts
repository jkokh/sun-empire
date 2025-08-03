import { Controller } from '@tsed/di';
import { View } from '@tsed/platform-views';
import { Hidden, Get } from '@tsed/schema';
import { UseBefore } from '@tsed/platform-middlewares';
import { AuthenticationMiddleware } from '../../middleware/AuthenticationMiddleware';
import { SetLocaleMiddleware } from '../../middleware/SetLocaleMiddleware';
import { getPage } from '../../data/pages';

@Hidden()
@Controller('/:lang?/dashboard')
@UseBefore(AuthenticationMiddleware)
@UseBefore(SetLocaleMiddleware)
export class DashboardController {
    @Get('/')
    @View('dashboard')
    get() {
        return { page: getPage('dashboard') };
    }
}