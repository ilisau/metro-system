import Claims from "../security/Claims";
import dotenv from "dotenv";
import jwt from "../security/JWT"
import userService from "./userService";

class TokenService {

    private accessExpiration: number;
    private refreshExpiration: number;

    constructor() {
        dotenv.config();
        this.accessExpiration = Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME);
        this.refreshExpiration = Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME);
    }

    async accessToken(username: string): Promise<string> {
        const user = await userService.getByUsername(username);
        const payload = {type: "ACCESS", sub: user.id};
        return jwt.sign(payload, this.accessExpiration * 60);
    }

    async refreshToken(username: string): Promise<string> {
        const user = await userService.getByUsername(username);
        const payload = {type: "REFRESH", sub: user.id};
        return jwt.sign(payload, this.refreshExpiration * 60);
    }

    isValid(token: string): boolean {
        return jwt.isValid(token);
    }

    parseClaims(token: string): Claims {
        const claims = new Claims();
        const object = jwt.decode(token);
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const value = object[key as keyof typeof object];
                claims.put(key, value);
            }
        }
        return claims;
    }

}

export default new TokenService();