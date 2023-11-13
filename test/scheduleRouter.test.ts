import {afterAll, beforeAll, describe, it} from "@jest/globals";
import supertest from 'supertest'
import {app} from "../app";
import RedisContainer from "./redisContainer";
import {userRepository} from "../server/repository/userRepository";
import User from "../server/model/User";
import JWT from "../server/security/JWT";

let server = app.listen();

describe("Create schedule router tests", () => {

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

    it('valid create request', async () => {
        const validRequest = {
            "trains": 6,
            "capacity": 60,
            "accuracy": 3,
            "fullness": 0.9,
            "flow": [
                {
                    "time": "9:15",
                    "amount": 300
                },
                {
                    "time": "9:25",
                    "amount": 280
                },
                {
                    "time": "9:35",
                    "amount": 240
                },
                {
                    "time": "9:40",
                    "amount": 100
                }
            ]
        };

        let response = await supertest(server)
            .post('/api/v1/schedules')
            .set('Authorization', `Bearer ${JWT.sign({type: "ACCESS", sub: 1}, 60)}`)
            .send(validRequest)
            .expect(201);

        expect(response.body.capacity).not.toBeUndefined();
        expect(response.body.accuracy).not.toBeUndefined();
        expect(response.body.averageInterval).not.toBeUndefined();
        expect(response.body.intervals).not.toBe([]);
    }, 60000);

    it('not authorized credentials request', async () => {
        const validRequest = {
            "trains": 6,
            "capacity": 60,
            "accuracy": 3,
            "fullness": 0.9,
            "flow": [
                {
                    "time": "9:15",
                    "amount": 300
                },
                {
                    "time": "9:25",
                    "amount": 280
                },
                {
                    "time": "9:35",
                    "amount": 240
                },
                {
                    "time": "9:40",
                    "amount": 100
                }
            ]
        };

        const response = await supertest(server)
            .post(`/api/v1/schedules`)
            .set('Authorization', ``)
            .send(validRequest)
            .expect(401);

        expect(response.body).toEqual({
            message: 'Not authorized.',
            errors: [],
        });
    }, 60000);

    it('invalid request', async () => {
        const invalidRequest = {
            "trains": 0,
            "capacity": 60,
            "accuracy": -2,
            "fullness": 1.9,
            "flow": [
                {
                    "time": "9:15",
                    "amount": 300
                },
                {
                    "time": "9:25",
                    "amount": 280
                },
                {
                    "time": "9:35",
                    "amount": 240
                },
                {
                    "time": "9:40",
                    "amount": 100
                }
            ]
        };

        const response = await supertest(server)
            .post(`/api/v1/schedules`)
            .set('Authorization', `Bearer ${JWT.sign({type: "ACCESS", sub: 1}, 60)}`)
            .send(invalidRequest)
            .expect(400);

        expect(response.body.message).toEqual('Validation failed');
    }, 60000);
});