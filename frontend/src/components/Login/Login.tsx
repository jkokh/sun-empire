import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import styles from './Login.module.sass';
import { Credentials } from '../../../../src/types/common';
import { loginUser } from '../../services/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getDeviceId } from '../../../../src/misc/utils';
import { localizedUrl } from '../../misc/utils';
import { useTranslation } from 'react-i18next';

interface SignInProps {
    credentials?: Credentials;
}

export const Login: FunctionComponent<SignInProps> = ({ credentials }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const { t } = useTranslation();

    useEffect(() => {
        form.setFieldsValue({ ...credentials, keepSignedIn: true });
    }, [credentials, form]);

    const onFinish = async () => {
        setLoading(true);
        setLoginError('');
        try {
            const response = await loginUser({
                usernameOrEmail: form.getFieldValue('usernameOrEmail'),
                password: form.getFieldValue('password'),
                deviceId: getDeviceId(),
                keepSignedIn: form.getFieldValue('keepSignedIn'),
            });

            if (response.data && response.status === 200) {
                window.location.href = localizedUrl('/dashboard');
            } else {
                setLoginError(t('login.loginSucceededNoToken'));
            }
        } catch (error: any) {
            const errMsg = error.response?.data?.message || t('login.unexpectedError');
            setLoginError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <Form
                className={styles.form}
                form={form}
                layout="vertical"
                name="login"
                onFinish={onFinish}
                scrollToFirstError
            >
                <div className="form-input-container">
                    <Form.Item
                        name="usernameOrEmail"
                        label={t('login.usernameOrEmailLabel')}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: t('login.usernameOrEmailRequired'),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('login.usernameOrEmailPlaceholder')}
                            autoFocus={true}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={t('login.passwordLabel')}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: t('login.passwordRequired'),
                            },
                        ]}
                    >
                        <Input.Password placeholder={t('login.passwordPlaceholder')} />
                    </Form.Item>
                    <a href={localizedUrl('/forgot-password')}>
                        {t('login.forgotPassword')}
                    </a>
                </div>
                <div className="form-action-button">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t('login.signIn')}
                    </Button>
                    <Form.Item
                        name="keepSignedIn"
                        valuePropName="checked"
                        className={styles.keepSignedIn}
                    >
                        <Checkbox>{t('login.keepSignedIn')}</Checkbox>
                    </Form.Item>
                </div>
                {loginError && (
                    <div className="form-general-error">
                        <ExclamationCircleOutlined className="form-error-icon" />
                        {loginError}
                    </div>
                )}
            </Form>
        </div>
    );
};
