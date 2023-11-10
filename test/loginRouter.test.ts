import {afterAll, beforeAll, describe, it} from "@jest/globals";
import supertest from 'supertest'
import {app} from "../app";
import RedisContainer from "./redisContainer";
import {userRepository} from "../server/repository/userRepository";
import User from "../server/model/User";

let server = app.listen();

describe("Login router tests", () => {

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

    it('valid login request', async () => {
        const validRequest = {
            username: 'bob@email.com',
            password: 'bob',
        };

        await supertest(server)
            .post('/api/v1/auth/login')
            .send(validRequest)
            .expect(200);
    });

    it('not existing user login request', async () => {
        const validRequest = {
            username: 'alice@email.com',
            password: 'alice',
        };

        const response = await supertest(server)
            .post('/api/v1/auth/login')
            .send(validRequest)
            .expect(404);

        expect(response.body).toEqual({
            message: 'Invalid credentials.',
            errors: [],
        });
    });

    it('invalid login request', async () => {
        const invalidRequest = {
            username: 'invalid_username',
            password: '',
        };

        const response = await supertest(server)
            .post('/api/v1/auth/login')
            .send(invalidRequest)
            .expect(400);

        expect(response.body).toEqual({
            message: 'Validation failed',
            errors: ['Incorrect username.', 'Password must be not empty.'],
        });
    });
});