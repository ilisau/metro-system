import {afterAll, beforeAll, beforeEach, describe, expect, it} from "@jest/globals";
import {userRepository} from "../server/repository/userRepository";
import RedisContainer from "./redisContainer";
import User from "../server/model/User";

describe("User repository tests", () => {

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
            return await userRepository.getById(1)
        })
            .rejects
            .toThrow("User not found.")
    });

    it("getExistingById", async () => {
        let user = new User(1, "user", "username", "password");
        await userRepository.save(user);

        let result = await userRepository.getById(1);
        expect(result)
            .toEqual(user);
    });

    it("getNotExistingByUsername", async () => {
        await expect(async () => {
            return await userRepository.getByUsername("username")
        })
            .rejects
            .toThrow("User not found.");
    });

    it("getExistingByUsername", async () => {
        let user = new User(1, "user", "username", "password");
        await userRepository.save(user);

        let result = await userRepository.getByUsername(user.username);
        expect(result)
            .toEqual(user);
    });

    it("existsNotExistingUsername", async () => {
        let result = await userRepository.exists("username");
        expect(result)
            .toBeFalsy();
    });

    it("existsExistingUsername", async () => {
        let user = new User(1, "user", "username", "password");
        await userRepository.save(user);

        let result = await userRepository.exists(user.username);
        expect(result)
            .toBeTruthy();
    });

    it("existsNotExistingId", async () => {
        let result = await userRepository.exists(1);
        expect(result)
            .toBeFalsy();
    });

    it("existsExistingId", async () => {
        let user = new User(1, "user", "username", "password");
        await userRepository.save(user);

        let result = await userRepository.exists(user.id!);
        expect(result)
            .toBeTruthy();
    });

    it("save", async () => {
        let user = new User(undefined, "user", "username", "password");
        await userRepository.save(user);

        let result = await userRepository.getByUsername(user.username);
        expect(result.username)
            .toBe(user.username);
        expect(result.password)
            .toBe(user.password);
    });
});