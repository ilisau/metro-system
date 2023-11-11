export default class LoginResponse {

    access: string;
    refresh: string;

    constructor(access: string, refresh: string) {
        this.access = access;
        this.refresh = refresh;
    }

}