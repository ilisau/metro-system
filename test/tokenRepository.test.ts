import {afterAll, beforeAll, beforeEach, describe, expect, it} from "@jest/globals";
import RedisContainer from "./redisContainer";
import {tokenRepository} from "../server/repository/tokenRepository";
import LoginResponse from "../server/model/LoginResponse";
import tokenKey from "../server/config";

describe("Token repository tests", () => {

    let redisContainer = new RedisContainer();

    beforeEach(async () => {
        await redisContainer.flushAll();
    }, 60000);

    beforeAll(async () => {
        await redisContainer.init();
    }, 60000);

    afterAll(async () => {
        await redisContainer.stop();
    }, 60000);

    it("save", async () => {
        let userId = 1;
        let loginResponse = new LoginResponse(
            "firstToken",
            "secondToken"
        );
        process.env.ACCESS_TOKEN_EXPIRATION_TIME = "1";
        process.env.REFRESH_TOKEN_EXPIRATION_TIME = "2";
        await tokenRepository.save(
            userId,
            loginResponse
        );

        let accessTTL = await redisContainer.redis().ttl(`${tokenKey(userId)}:access`);
        let refreshTTL = await redisContainer.redis().ttl(`${tokenKey(userId)}:refresh`);
        expect(accessTTL)
            .toBeLessThanOrEqual(Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME) * 60);
        expect(refreshTTL)
            .toBeLessThanOrEqual(Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME) * 60);
    }, 60000);
});