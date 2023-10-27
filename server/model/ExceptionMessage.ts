export default class ExceptionMessage {

    message: string;
    errors: string[];

    constructor(message: string) {
        this.message = message;
        this.errors = [];
    }

}