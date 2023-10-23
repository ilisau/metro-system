class TokenService {

    constructor() {

    }

    accessToken(username: string): string {
        return "access" + username;
    }

    refreshToken(username: string): string {
        return "refresh" + username;
    }

}

export default new TokenService();