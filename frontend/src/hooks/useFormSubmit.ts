import { useState } from 'react';
import { FormInstance } from 'antd';
import { handleFormServerError } from '../misc/errorHandlers.ts';
import { successNotification } from '../services/notification.ts';

export function useFormSubmit<T>(
    form: FormInstance,
    submitFunction: (values: T) => Promise<any>,
    successMessage: {
        message: string;
        description: string;
    },
    defaultErrorMessage = 'An error occurred. Please try again.'
) {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: T) => {
        setLoading(true);
        try {
            await submitFunction(values);
            successNotification(successMessage.message, successMessage.description);
            form.resetFields();
        } catch (error: any) {
            const handled = handleFormServerError(error, form, defaultErrorMessage);
            if (!handled) {
                // Additional error handling if needed
            }
        } finally {
            setLoading(false);
        }
    };

    return { onSubmit, loading };
}
