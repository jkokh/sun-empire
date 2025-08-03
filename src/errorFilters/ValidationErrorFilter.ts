import { Catch, ExceptionFilterMethods, PlatformContext } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import { ErrorMessage } from '../types/common';

@Catch(BadRequest)
export class ValidationErrorFilter implements ExceptionFilterMethods {
    catch(error: BadRequest & { fieldName?: string }, ctx: PlatformContext) {
        const { response } = ctx;

        if (error.origin?.name === 'AJV_VALIDATION_ERROR') {
            const errors: ErrorMessage[] = error.origin.errors.map((err: any) => {
                const field = getField(err);
                const message = `The field '${field}' ${err.message}`;
                return { field, message };
            });
            response.status(400).body({ errors });
        } else {
            const fieldName = (error as any).fieldName;
            console.log(error)
            const errorMessage = error.message || 'An unexpected error occurred';
            if (fieldName) {
                const errors = [{ field: fieldName, message: errorMessage }];
                response.status(400).body({ errors });
            } else {
                response.status(400).body({ message: errorMessage });
            }
        }
    }
}

function getField(err: any): string {
    let field: string;
    if (err.instancePath) {
        // Splitting by '/' and filtering out empty strings to ensure we get a valid field name
        const parts = err.instancePath.split('/').filter(Boolean);
        field = parts.length > 0 ? parts[parts.length - 1] : 'unknown';
    } else if (err.params && err.params.missingProperty) {
        // Handling required fields missing
        field = err.params.missingProperty;
    } else {
        // Defaulting to 'unknown' if no specific field information is available
        field = 'unknown';
    }
    return field;
}