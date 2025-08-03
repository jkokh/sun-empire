import { FunctionComponent, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { requestResetPassword } from '../../services/api';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ReCAPTCHA from '../ReCAPTCHA/ReCAPTCHA';
import { localizedUrl } from '../../misc/utils';
import { useTranslation } from 'react-i18next';

export const ForgotPassword: FunctionComponent = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [success, setSuccess] = useState(false);

    const { t } = useTranslation();

    const onFinish = async () => {
        setLoading(true);
        setResetError('');
        setSuccess(false);
        const userIdentifier = form.getFieldValue('userIdentifier');
        const recaptcha = form.getFieldValue('recaptcha');
        try {
            const response = await requestResetPassword(userIdentifier, recaptcha);
            if (response.data && response.status === 200) {
                setSuccess(true);
            } else {
                setResetError(t('forgotPassword.noAccountFound'));
            }
        } catch (error: any) {
            const errMsg = error.response?.data?.message || t('forgotPassword.unexpectedError');
            setResetError(errMsg);
        } finally {
            setLoading(false);
            form.setFieldValue('recaptcha', null);
            (window as any).grecaptcha.reset();
        }
    };

    if (success) {
        return (
            <div className={'form-success-message'}>
                <CheckCircleOutlined className={'form-check-mark'} />
                <div>
                    <h2>{t('forgotPassword.requestReceived')}</h2>
                    <p>
                        {t('forgotPassword.checkEmail')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <p>{t('forgotPassword.enterEmailOrUsername')}</p>
            <Form
                form={form}
                layout={'vertical'}
                name="forgotPassword"
                onFinish={onFinish}
                scrollToFirstError
            >
                <div className="form-input-container">
                    <Form.Item
                        name="userIdentifier"
                        label={t('forgotPassword.emailOrUsernameLabel')}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: t('forgotPassword.emailOrUsernameRequired'),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('forgotPassword.emailOrUsernamePlaceholder')}
                            autoFocus={true}
                        />
                    </Form.Item>
                    {/* Hidden field to hold reCAPTCHA validation state */}
                    <Form.Item
                        name="recaptcha"
                        rules={[
                            {
                                required: true,
                                message: t('forgotPassword.recaptchaRequired'),
                            },
                        ]}
                        hidden
                    >
                        <Input type="hidden" />
                    </Form.Item>

                    {/* reCAPTCHA widget */}
                    <Form.Item shouldUpdate={true}>
                        {() => (
                            <ReCAPTCHA form={form} />
                        )}
                    </Form.Item>
                </div>
                <div className="form-action-button">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t('forgotPassword.resetPassword')}
                    </Button>
                    <a href={localizedUrl('/login')}>{t('forgotPassword.backToSignIn')}</a>
                </div>
                {resetError && (
                    <div className="form-general-error">
                        <ExclamationCircleOutlined className="form-error-icon" />
                        {resetError}
                    </div>
                )}
            </Form>
        </div>
    );
};
