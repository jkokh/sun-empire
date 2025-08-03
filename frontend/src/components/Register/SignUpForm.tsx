import { FunctionComponent, useState } from 'react';
import styles from './RegisterForm.module.sass';
import { Button, Checkbox, Form, Input } from 'antd';
import { UserModel } from '@tsed/prisma-models';
import { registerUser } from '@/services/api.ts';
import { errorNotification } from '@/services/notification.ts';
import ReCAPTCHA from '../ReCAPTCHA/ReCAPTCHA';

interface FormProps {
    onRegistrationSuccess: (user: UserModel) => void;
}

export const SignUpForm: FunctionComponent<FormProps> = ({
    onRegistrationSuccess,
}) => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const recaptchaErrorText = 'Please complete the reCAPTCHA!';

    const onFinish = async (user: UserModel) => {
        setLoading(true);
        try {
            await registerUser(user);
            onRegistrationSuccess(user);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.errors) {
                // Handle field-specific errors
                const fieldErrors: { name: string; errors: string[] }[] = error.response.data.errors.map((err: any) => ({
                    name: err.field,
                    errors: [err.message],
                }));
                // (window as any).grecaptcha.reset();
                form.setFields(fieldErrors);
                errorNotification('Form Errors', 'Please review and correct the errors in the form.');
            } else {
                // Generic error handling
                errorNotification('Submission Error', 'Failed to submit form, please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Form
                className={styles.form}
                form={form}
                layout={'vertical'}
                name="register"
                onFinish={onFinish}
                onFinishFailed={(errorInfo: any) => {
                        console.log('Failed:', errorInfo);
                        form.setFieldValue('recaptcha', null);
                        (window as any).grecaptcha.reset();
                        errorNotification('Form Errors', 'Please review and correct the errors in the form.');
                    }
                }
                scrollToFirstError
            >
                <div className={styles.inputsContainer}>
                    <div className={styles.groupLeft}>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            hasFeedback
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter your email"
                                autoFocus={false}
                            />
                        </Form.Item>
                        <Form.Item
                            name="firstname"
                            label="First Name"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your first name!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input placeholder="Enter your first name" />
                        </Form.Item>

                        <Form.Item
                            name="lastname"
                            label="Last Name"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your last name!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input placeholder="Enter your last name" />
                        </Form.Item>
                    </div>
                    <div className={styles.groupRight}>

                        <Form.Item
                            name="password"
                            label="Password"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    pattern:
                                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                                    message:
                                        'Password must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long.',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>
                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue('password') === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                'The two passwords that you entered do not match!'
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm your password" />
                        </Form.Item>                                {/* reCAPTCHA widget */}
                        <Form.Item shouldUpdate={true}>
                            {() => (
                                <ReCAPTCHA form={form} />
                            )}
                        </Form.Item>

                    </div>
                    <div className={styles.checkboxContainer}>
                        <div className={styles.inputsContainer}>
                            <div className={styles.groupLeft}>
                                {/* Hidden field to hold reCAPTCHA validation state */}
                                <Form.Item
                                    name="recaptcha"
                                    rules={[
                                        {
                                            required: true,
                                            message: recaptchaErrorText,
                                        },
                                    ]}
                                    hidden
                                >
                                    <Input type="hidden" />
                                </Form.Item>

                            </div>
                            <div className={styles.groupRight} />
                        </div>
                    </div>
                </div>
                <Form.Item>
                    <div className={styles.regButtonLine}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Register
                        </Button>
                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            className={styles.regCheckbox}
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                new Error(
                                                    'You must accept the terms and conditions.'
                                                )
                                            ),
                                },
                            ]}
                        >
                            <Checkbox>
                                I accept the{' '}
                                <a href="/terms">Terms of Service</a>{' '}
                                and{' '}
                                <a href="/privacy-policy">
                                    Privacy Policy
                                </a>
                                .
                            </Checkbox>
                        </Form.Item>
                    </div>
                </Form.Item>

            </Form>
        </div>
    );
};
