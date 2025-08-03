import { FormInstance } from 'antd';
import { errorNotification } from '../services/notification';

interface ServerError {
    field: string;
    message: string;
}

export function handleFormServerError(
    error: any,
    form: FormInstance,
    defaultErrorMessage: string = 'An error occurred. Please try again.'
) {
    if (error.response && error.response.data) {
        const serverErrors = error.response.data.errors;
        if (serverErrors && Array.isArray(serverErrors)) {
            const fieldErrors = serverErrors.map((err: ServerError) => ({
                name: err.field,
                errors: [err.message],
            }));
            form.setFields(fieldErrors);
            errorNotification('Form Errors', 'Please review and correct the errors in the form.');
            return true;
        } else if (error.response.data.message) {
            errorNotification('Error', error.response.data.message);
        } else {
            errorNotification('Submission Error', defaultErrorMessage);
        }
    } else {
        errorNotification('Network Error', 'Please check your internet connection.');
    }
    return false;
}
