import {afterAll, beforeAll, describe, it} from "@jest/globals";
import supertest from 'supertest'
import RedisContainer from "./redisContainer";
import {userRepository} from "../server/repository/userRepository";
import User from "../server/model/User";
import {app} from "../app";

let server = app.listen();

describe("Register router tests", () => {

    let redisContainer = new RedisContainer();

    beforeAll(async () => {
        await redisContainer.init();
    }, 60000);

    afterAll(async () => {
        await redisContainer.stop();
        await redisContainer.flushAll();
        server.close();
    }, 60000);

    it('valid register request', async () => {
        const validRequest = {
            name: 'Bob',
            username: 'bob@email.com',
            password: 'bobbobbob',
        };

        await supertest(server)
            .post('/api/v1/auth/register')
            .send(validRequest)
            .expect(201);
    });

    it('already registered user request', async () => {
        await userRepository.save(
            new User(undefined,
                "bob",
                "bob@email.com",
                "$2a$10$kmk.45YORbtENZ4ebiwj4eWRLXqb7RUADw/zqqMLO.PJFsymGI.yq"
            )
        )
        const validRequest = {
            name: 'Bob',
            username: 'bob@email.com',
            password: 'bobbobbob',
        };

        const response = await supertest(server)
            .post('/api/v1/auth/register')
            .send(validRequest)
            .expect(400);

        expect(response.body).toEqual({
            message: "User already exists.",
            errors: []
        });
    });

    it('test invalid register request', async () => {
        const invalidUser = {
            name: '',
            username: 'invalid-username',
            password: 'short',
        };

        const response = await supertest(server)
            .post('/api/v1/auth/register')
            .send(invalidUser)
            .expect(400);

        expect(response.body).toEqual({
            message: 'Validation failed',
            errors: [
                'Name is required.',
                'Incorrect username.',
                'Password must be longer than 8 characters.',
            ],
        });
    });
});