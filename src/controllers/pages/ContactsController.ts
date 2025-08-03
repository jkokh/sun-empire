import { Controller } from '@tsed/di';
import { View } from '@tsed/platform-views';
import { Hidden, Get } from '@tsed/schema';
import { UseBefore } from '@tsed/platform-middlewares';
import { getPage } from '../../data/pages';
import { GetUserMiddleware } from '../../middleware/GetUserMiddleware';
import { SetLocaleMiddleware } from '../../middleware/SetLocaleMiddleware';

@Hidden()
@Controller('/:lang?/contacts')
@UseBefore(GetUserMiddleware)
@UseBefore(SetLocaleMiddleware)
export class ContactsController {
    @Get('/')
    @View('contacts')
    get() {
        return { page: getPage('contacts') };
    }
}