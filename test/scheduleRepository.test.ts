import {afterAll, beforeAll, beforeEach, describe, expect, it} from "@jest/globals";
import RedisContainer from "./redisContainer";
import scheduleRepository from "../server/repository/scheduleRepository";
import Schedule from "../server/model/Schedule";

describe("Schedule repository tests", () => {

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

    it("getNotExistingById", async () => {
        await expect(async () => {
            return await scheduleRepository.getById(1)
        })
            .rejects
            .toThrow("Schedule not found.")
    }, 60000);

    it("getExistingById", async () => {
        let schedule = new Schedule(1, 100);
        await scheduleRepository.save(schedule);

        let result = await scheduleRepository.getById(1);
        expect(result)
            .toEqual(schedule);
    }, 60000);

    it("getAllByAuthorId", async () => {
        let size = 5;
        for (let i = 0; i < size; i++) {
            let schedule = new Schedule(1, 100);
            await scheduleRepository.save(schedule);
        }

        let result = await scheduleRepository.getAllByAuthorId(1);
        expect(result)
            .toHaveLength(size);
    }, 60000);


    it("isAuthor", async () => {
        let schedule = new Schedule(1, 100);
        await scheduleRepository.save(schedule);

        let result = await scheduleRepository.isAuthor(schedule.authorId, schedule.id);
        expect(result)
            .toBeTruthy();
    }, 60000);

    it("isAuthor", async () => {
        let schedule = new Schedule(1, 100);
        await scheduleRepository.save(schedule);

        let result = await scheduleRepository.isAuthor(schedule.authorId + 2, schedule.id);
        expect(result)
            .toBeFalsy();
    }, 60000);

    it("save", async () => {
        let schedule = new Schedule(1, 100);
        await scheduleRepository.save(schedule);

        let result = await scheduleRepository.getById(schedule.id);
        expect(result)
            .toEqual(schedule);
    }, 60000);
});