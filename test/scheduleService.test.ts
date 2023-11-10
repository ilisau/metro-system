import {afterAll, beforeAll, beforeEach, describe, expect, it} from "@jest/globals";
import RedisContainer from "./redisContainer";
import scheduleRepository from "../server/repository/scheduleRepository";
import Schedule from "../server/model/Schedule";
import scheduleService from "../server/service/scheduleService";

describe("Schedule service tests", () => {

    let redisContainer = new RedisContainer();

    beforeEach(async () => {
        await redisContainer.flushAll();
    });

    beforeAll(async () => {
        await redisContainer.init();
    }, 60000);

    afterAll(async () => {
        await redisContainer.stop();
    }, 60000);

    it("getNotExistingById", async () => {
        await expect(async () => {
            return await scheduleService.getById(1)
        })
            .rejects
            .toThrow("Schedule not found.")
    });

    it("getExistingById", async () => {
        let schedule = new Schedule(1, 100);
        await scheduleRepository.save(schedule);

        let result = await scheduleService.getById(1);
        expect(result)
            .toEqual(schedule);
    });

    it("getAllByAuthorId", async () => {
        let size = 5;
        for (let i = 0; i < size; i++) {
            let schedule = new Schedule(1, 100);
            await scheduleRepository.save(schedule);
        }

        let result = await scheduleService.getAllByAuthorId(1);
        expect(result)
            .toHaveLength(size);
    });


    it("isAuthor", async () => {
        let schedule = new Schedule(1, 100);
        await scheduleRepository.save(schedule);

        let result = await scheduleService.isAuthor(schedule.authorId, schedule.id);
        expect(result)
            .toBeTruthy();
    });

    it("isAuthor", async () => {
        let schedule = new Schedule(1, 100);
        await scheduleRepository.save(schedule);

        let result = await scheduleService.isAuthor(schedule.authorId + 2, schedule.id);
        expect(result)
            .toBeFalsy();
    });

});