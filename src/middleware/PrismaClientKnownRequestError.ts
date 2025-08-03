import { Catch, PlatformContext, ExceptionFilterMethods } from '@tsed/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ValidationErrorResponse } from '../types/common';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorFilter implements ExceptionFilterMethods {
    catch(exception: PrismaClientKnownRequestError, ctx: PlatformContext) {
        const { response } = ctx;
        if (exception.code === 'P2002') {
            const res: ValidationErrorResponse = {
                errors: [{
                    field: 'email',
                    message: 'A user with the given details already exists.'
                }]
            };
            response.status(400).body(res);
        } else {
            const res: ValidationErrorResponse = {
                message: 'An error occurred while processing your request.'
            };
            response.status(500).body(res);
        }
    }
}
