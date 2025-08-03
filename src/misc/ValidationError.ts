import { BadRequest } from '@tsed/exceptions';

export class ValidationError extends BadRequest {
    constructor(public fieldName: string, message: string) {
        super(message);
        this.fieldName = fieldName;
    }
}