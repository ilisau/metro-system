import LoginResponse from "../model/LoginResponse";
import tokenKey, {redis} from "../config";
import dotenv from "dotenv";

class TokenRepository {

    constructor() {
        dotenv.config();
    }

    async save(userId: number, tokens: LoginResponse) {
        await redis.set(`${tokenKey(userId)}:access`, tokens.access);
        await redis.expire(`${tokenKey(userId)}:access`, 60 * Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME));
        await redis.set(`${tokenKey(userId)}:refresh`, tokens.refresh);
        await redis.expire(`${tokenKey(userId)}:refresh`, 60 * Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME));
    }

}

export default new TokenRepository();