import { Required, Email, Pattern } from '@tsed/schema';
import { passwordPolicy } from '../constants/common';

export type UserDto = {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    username?: string;
    recaptcha: string;
};

export class User implements UserDto {

    @Required()
    @Email()
    email: string;

    @Required()
    @Pattern(passwordPolicy)
    password: string;

    @Required()
    firstname: string;

    @Required()
    lastname: string;

    @Required()
    recaptcha: string;

}
