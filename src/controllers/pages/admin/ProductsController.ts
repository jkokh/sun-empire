import { Controller } from '@tsed/di';
import { View } from '@tsed/platform-views';
import { Hidden, Get } from '@tsed/schema';
import { UseBefore } from '@tsed/platform-middlewares';
import { AuthenticationMiddleware } from '../../../middleware/AuthenticationMiddleware';
import { AdminAuthenticationMiddleware } from '../../../middleware/AdminAuthenticationMiddleware';
import { SetLocaleMiddleware } from '../../../middleware/SetLocaleMiddleware';
import { getPage } from '../../../data/pages';

@Hidden()
@Controller('/:lang?/cp')
@UseBefore(AuthenticationMiddleware)
@UseBefore(AdminAuthenticationMiddleware)
@UseBefore(SetLocaleMiddleware)
export class ProductsController {

    @Get('/')
    @Get('/categories')
    @View('admin/categories')
    getCategories() {
        return { page: getPage('cp/categories') };
    }

    @Get('/products')
    @View('admin/products')
    getProducts() {
        return { page: getPage('cp/products') };
    }

}