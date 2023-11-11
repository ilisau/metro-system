import {afterAll, beforeAll, beforeEach, describe, expect, it} from "@jest/globals";
import {userRepository} from "../server/repository/userRepository";
import RedisContainer from "./redisContainer";
import User from "../server/model/User";
import userService from "../server/service/userService";

describe("User service tests", () => {

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
            return await userService.getById(1)
        })
            .rejects
            .toThrow("User not found.")
    }, 60000);

    it("getExistingById", async () => {
        let user = new User(1, "user", "username", "password");
        await userRepository.save(user);

        let result = await userService.getById(1);
        expect(result)
            .toEqual(user);
    }, 60000);

    it("getNotExistingByUsername", async () => {
        await expect(async () => {
            return await userService.getByUsername("username")
        })
            .rejects
            .toThrow("User not found.");
    }, 60000);

    it("getExistingByUsername", async () => {
        let user = new User(1, "user", "username", "password");
        await userRepository.save(user);

        let result = await userService.getByUsername(user.username);
        expect(result)
            .toEqual(user);
    }, 60000);

    it("existsNotExistingUsername", async () => {
        let result = await userService.exists("username");
        expect(result)
            .toBeFalsy();
    }, 60000);

    it("existsExistingUsername", async () => {
        let user = new User(1, "user", "username", "password");
        await userRepository.save(user);

        let result = await userService.exists(user.username);
        expect(result)
            .toBeTruthy();
    }, 60000);

    it("save", async () => {
        let user = new User(undefined, "user", "username", "password");
        await userService.save(user);

        let result = await userService.getByUsername(user.username);
        expect(result.username)
            .toBe(user.username);
        expect(result.password)
            .toEqual(user.password);
    }, 60000);
});