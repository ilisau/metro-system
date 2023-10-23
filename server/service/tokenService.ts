import Claims from "../security/Claims";

class TokenService {

    #key: string;

    constructor() {
        this.#key = "custom jwt key";
    }

    accessToken(username: string): string {
        //TODO implement
        return "access" + username;
    }

    refreshToken(username: string): string {
        //TODO implement
        return "refresh" + username;
    }

    isValid(token: String): boolean {
        //TODO implement
        return true;
    }

    parseClaims(token: String): Claims {
        //TODO implement
        return new Claims();
    }

}

export default new TokenService();