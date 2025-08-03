import { FunctionComponent, useEffect } from 'react';
import { loadScript } from '../../../../src/misc/utils';

interface ReCAPTCHAProps {
    form: any; // Pass the form instance to manage form values from outside
}

const ReCAPTCHA: FunctionComponent<ReCAPTCHAProps> = ({ form }) => {
    useEffect(() => {
        loadScript('https://www.google.com/recaptcha/api.js', true, true);

        (window as any).recaptchaCallback = (recaptchaToken: string) => {
            form.setFieldsValue({ recaptcha: recaptchaToken });
        };

        (window as any).recaptchaExpiredCallback = () => {
            form.setFieldsValue({ recaptcha: '' });
            form.setFields([
                {
                    name: 'recaptcha',
                    errors: ['Please complete the reCAPTCHA!'],
                },
            ]);
        };

        return () => {
            delete (window as any).recaptchaCallback;
            delete (window as any).recaptchaExpiredCallback;
        };
    }, [form]);

    return (
        <div>
            <div
                className="g-recaptcha"
                data-sitekey="6LetFqspAAAAANt_yhUwXjgyKWsGiULCKXliWQxo"
                data-callback="recaptchaCallback"
                data-expired-callback="recaptchaExpiredCallback"
            />
            {form.getFieldError('recaptcha').length > 0 && (
                <div className="ant-form-item-explain ant-form-item-explain-error">
                    {form.getFieldError('recaptcha').join(', ')}
                </div>
            )}
        </div>
    );
};

export default ReCAPTCHA;
