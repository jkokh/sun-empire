import { FunctionComponent, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { resetPassword } from '../../services/api';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export const ResetPassword: FunctionComponent = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [success, setSuccess] = useState(false);
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    const onFinish = async (values: any) => {
        setLoading(true);
        setResetError('');
        setSuccess(false);
        try {
            await resetPassword(values.password, token!);
            setSuccess(true);
        } catch (error) {
            const errMsg = (error as any).response.data.message || 'An unexpected error occurred';
            setResetError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="form-success-message">
                <CheckCircleOutlined className="form-check-mark" />
                <div>
                    <h2>Password Successfully Reset</h2>
                    <p>Please <a href="/login">sign in</a> with your new password.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <p>Enter a new password for your account.</p>
            <Form
                form={form}
                layout="vertical"
                name="resetPassword"
                onFinish={onFinish}  // Corrected to use the onFinish function
                scrollToFirstError
            >
                <div className="form-input-container">
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new password!',
                            },
                            {
                                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                                message: 'Password must include 8 characters, an uppercase, a lowercase, and a number.',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter your new password" />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm New Password"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your new password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm your new password" />
                    </Form.Item>
                </div>
                <div className="form-action-button">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Set New Password
                    </Button>
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
