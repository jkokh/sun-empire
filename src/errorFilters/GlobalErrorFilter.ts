import { Catch } from '@tsed/platform-exceptions';
import { ExceptionFilterMethods, PlatformContext } from '@tsed/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { ValidationErrorResponse } from '../types/common';

@Catch(Error)
export class GlobalErrorFilter implements ExceptionFilterMethods {
    catch(error: any, ctx: PlatformContext) {
        const { response } = ctx;

        if (error instanceof PrismaClientValidationError) {
            const res: ValidationErrorResponse = {
                message: 'DB related validation error'
            };
            response.status(400).body(res);
        } else {
            // Handle other errors
            response.status(500).body({
                message: 'An unexpected error occurred'
            });
        }
    }
}
