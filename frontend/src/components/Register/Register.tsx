import { FunctionComponent, useState } from 'react';
import { Credentials } from '../../../../src/types';
import { SignUpForm } from './SignUpForm';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Login } from '../Login/Login';
import { UserModel } from '@tsed/prisma-models';
import styles from './RegisterForm.module.sass';

export const Register: FunctionComponent = () => {
    const [success, setSuccess] = useState(false);
    const [credentials, setCredentials] = useState<Credentials | null>(null);

    const handleRegistrationSuccess = (user: UserModel) => {
        setSuccess(true);
        setCredentials({
            usernameOrEmail: user.email,
            password: user.password,
        });
    };

    return (
        <div>
            <div style={{ display: success ? 'none' : 'block' }}>
                <SignUpForm onRegistrationSuccess={handleRegistrationSuccess} />
            </div>
            {success && (
                <>
                    <div className={`${styles.success} form-success-message`}>
                        <CheckCircleOutlined className={'form-check-mark'} />
                        <div>
                            <h2>Your account has been created successfully!</h2>
                            <p>
                                Please check your email inbox for further
                                instructions on how to verify your email address.
                                You can still <a href="/login">log in to your account</a>, but
                                certain features may be restricted until your email
                                is confirmed.
                            </p>
                        </div>
                    </div>
                    <div className={styles.loginForm}>
                        <Login credentials={credentials!} />
                    </div>
                </>
            )}
        </div>
    );
};
