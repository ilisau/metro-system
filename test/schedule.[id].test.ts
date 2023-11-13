import {afterAll, beforeAll, describe, it} from "@jest/globals";
import supertest from 'supertest'
import {app} from "../app";
import RedisContainer from "./redisContainer";
import {userRepository} from "../server/repository/userRepository";
import User from "../server/model/User";
import {scheduleRepository} from "../server/repository/scheduleRepository";
import Schedule from "../server/model/Schedule";
import JWT from "../server/security/JWT";

let server = app.listen();

describe("Get schedule router tests", () => {

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
        await userRepository.save(
            new User(undefined,
                "alica",
                "alice@email.com",
                "$2a$10$kmk.45YORbtENZ4ebiwj4eWRLXqb7RUADw/zqqMLO.PJFsymGI.yq"
            )
        )
        await scheduleRepository.save(
            new Schedule(1, 100)
        )
    }, 60000);

    afterAll(async () => {
        await redisContainer.stop();
        await redisContainer.flushAll();
        server.close();
    }, 60000);

    it('valid request', async () => {
        let id = 1;

        let response = await supertest(server)
            .get(`/api/v1/schedules/${id}`)
            .set('Authorization', `Bearer ${JWT.sign({type: "ACCESS", sub: 1}, 60)}`)
            .expect(200);

        expect(response.body.id).toEqual(1);
        expect(response.body.authorId).toEqual(1);
        expect(response.body.capacity).toEqual(100);
    }, 60000);

    it('not existing schedule request', async () => {
        let id = 2;

        const response = await supertest(server)
            .get(`/api/v1/schedules/${id}`)
            .set('Authorization', `Bearer ${JWT.sign({type: "ACCESS", sub: 1}, 60)}`)
            .expect(403);

        expect(response.body).toEqual({
            message: 'Access denied.',
            errors: [],
        });
    }, 60000);

    it('not authorized credentials request', async () => {
        let id = 1;

        const response = await supertest(server)
            .get(`/api/v1/schedules/${id}`)
            .set('Authorization', ``)
            .expect(401);

        expect(response.body).toEqual({
            message: 'Not authorized.',
            errors: [],
        });
    }, 60000);

    it('invalid credentials request', async () => {
        let id = 1;

        const response = await supertest(server)
            .get(`/api/v1/schedules/${id}`)
            .set('Authorization', `Bearer ${JWT.sign({type: "ACCESS", sub: 2}, 60)}`)
            .expect(403);

        expect(response.body).toEqual({
            message: 'Access denied.',
            errors: [],
        });
    }, 60000);
});