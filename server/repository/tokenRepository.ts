import {LoginResponse} from "../model/LoginResponse";
import Redis from "ioredis";
import dotenv from "dotenv";
import {getRedis, tokenKey} from "../config";

class TokenRepository {

    #client: Redis;
    #accessExpiration: number;
    #refreshExpiration: number;

    constructor() {
        dotenv.config();
        this.#client = getRedis();
        this.#accessExpiration = Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME);
        this.#refreshExpiration = Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME);
    }

    async save(userId: number, tokens: LoginResponse) {
        await this.#client.set(`${tokenKey(userId)}:access`, tokens.access);
        await this.#client.expire(`${tokenKey(userId)}:access`, 60 * this.#accessExpiration);
        await this.#client.set(`${tokenKey(userId)}:refresh`, tokens.refresh);
        await this.#client.expire(`${tokenKey(userId)}:refresh`, 60 * this.#refreshExpiration);
    }

}

export default new TokenRepository();