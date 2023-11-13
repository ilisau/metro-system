import {afterAll, beforeAll, describe, it} from "@jest/globals";
import supertest from 'supertest'
import {app} from "../app";
import RedisContainer from "./redisContainer";
import {userRepository} from "../server/repository/userRepository";
import User from "../server/model/User";
import JWT from "../server/security/JWT";

let server = app.listen();

describe("Refresh router tests", () => {

    let redisContainer = new RedisContainer();

    beforeAll(async () => {
        await redisContainer.init();
        await userRepository.save(
            new User(undefined,
                "bob",
                "bob@email.com",
                "$2a$10$kmk.45YORbtENZ4ebiwj4eWRLXqb7RUADw/zqqMLO.PJFsymGI.yq"
            )
        )
    }, 60000);

    afterAll(async () => {
        await redisContainer.stop();
        await redisContainer.flushAll();
        server.close();
    }, 60000);

    it('valid refresh request', async () => {
        const validRequest = {
            token: JWT.sign({type: "REFRESH", sub: 1}, 600)
        };

        let response = await supertest(server)
            .post('/api/v1/auth/refresh')
            .send(validRequest)
            .expect(200);

        expect(response.body.access).not.toBeNull();
        expect(response.body.access).not.toBeUndefined();
        expect(response.body.refresh).not.toBeNull();
        expect(response.body.refresh).not.toBeUndefined();
    }, 60000);

    it('not existing user refresh request', async () => {
        const validRequest = {
            token: JWT.sign({type: "REFRESH", sub: 2}, 600)
        };

        const response = await supertest(server)
            .post('/api/v1/auth/refresh')
            .send(validRequest)
            .expect(400);

        expect(response.body).toEqual({
            message: 'User not found.',
            errors: [],
        });
    }, 60000);

    it('invalid type refresh request', async () => {
        const invalidRequest = {
            token: JWT.sign({type: "ACCESS", sub: 1}, 600)
        };

        const response = await supertest(server)
            .post('/api/v1/auth/refresh')
            .send(invalidRequest)
            .expect(400);

        expect(response.body).toEqual({
            message: 'Invalid token.',
            errors: [],
        });
    }, 60000);
});