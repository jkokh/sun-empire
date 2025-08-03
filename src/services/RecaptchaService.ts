import { Service } from '@tsed/common';
import { recaptchaKey } from '../constants/common';

@Service()
export class RecaptchaService {
    private readonly secretKey = recaptchaKey;
    private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    async validate(token: string): Promise<boolean> {
        const url = `${this.verifyUrl}?secret=${this.secretKey}&response=${token}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error validating reCAPTCHA:', error);
            return false;
        }
    }
}
