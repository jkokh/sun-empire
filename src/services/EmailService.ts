import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-sesv2';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { UserModel } from '@tsed/prisma-models';

const readFile = util.promisify(fs.readFile);

const credentials = {
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
    }
};

const client = new SESv2Client(credentials);

export class EmailService {

    async sendVerificationEmail(user: UserModel, token: string) {
        const domain = process.env.DOMAIN;
        if (!domain) {
            throw new Error('process.env.DOMAIN is not specified');
        }

        const verificationUrl = `https://${domain}/verify-email?token=${token}`;
        const templatePath = path.join(__dirname, '../', 'templates', 'verificationEmail.html');

        try {
            const htmlContent = await readFile(templatePath, 'utf8');
            const emailBody = htmlContent.replace('{{verificationUrl}}', verificationUrl).replace('{{name}}', user.firstname);

            const params = {
                FromEmailAddress: 'no-reply@band.ink', // Ensure this email is verified in AWS SES
                Destination: {
                    ToAddresses: [user.email]
                },
                Content: {
                    Simple: {
                        Subject: {
                            Data: 'Email Confirmation for Band.ink',
                            Charset: 'UTF-8'
                        },
                        Body: {
                            Html: {
                                Data: emailBody,
                                Charset: 'UTF-8'
                            }
                        }
                    }
                }
            };

            return this.sendMail(params);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw error;
        }
    }

    async sendResetPassword(user: UserModel, token: string) {
        const domain = process.env.DOMAIN;
        if (!domain) {
            throw new Error('process.env.DOMAIN is not specified');
        }

        const resetPasswordUrl = `https://${domain}/reset-password?token=${token}`;
        const templatePath = path.join(__dirname, '../', 'templates', 'resetPasswordEmail.html');

        try {
            const htmlContent = await readFile(templatePath, 'utf8');
            const emailBody = htmlContent.replace('{{resetPasswordUrl}}', resetPasswordUrl).replace('{{name}}', user.firstname);
            const params = {
                FromEmailAddress: 'no-reply@band.ink',
                Destination: {
                    ToAddresses: [user.email]
                },
                Content: {
                    Simple: {
                        Subject: {
                            Data: 'Reset Password Instructions for Band.ink',
                            Charset: 'UTF-8'
                        },
                        Body: {
                            Html: {
                                Data: emailBody,
                                Charset: 'UTF-8'
                            }
                        }
                    }
                }
            };

            return this.sendMail(params);
        } catch (error) {
            console.error('Failed to send reset password email:', error);
            throw error;
        }
    }

    async sendMail(params: SendEmailCommandInput) {
        const command = new SendEmailCommand(params);
        try {
            const response = await client.send(command);
            console.log('Email sent:', response);
            return response;
        } catch (error) {
            console.error('Email sending error:', error);
            throw error;
        }
    }
}
