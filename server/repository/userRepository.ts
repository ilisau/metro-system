import Redis from "ioredis";
import User from "../model/User";
import {getRedis, userKey, usersKey} from "../config"

class UserRepository {

    #client: Redis;

    constructor() {
        this.#client = getRedis();
    }

    async getById(id: number): Promise<User> {
        if (await this.#client.sismember(usersKey(), id)) {
            const hashPairs = await this.#client.hgetall(userKey(id));
            return hashPairs as unknown as User;
        } else {
            throw new Error("User not found.");
        }
    }

    async getByUsername(username: string): Promise<User> {
        if (await this.#client.sismember(usersKey(), username)) {
            const userId = await this.#client.get(userKey(username));
            const hashPairs = await this.#client.hgetall(userKey(userId!));
            return hashPairs as unknown as User;
        } else {
            throw new Error("User not found.");
        }
    }

    async exists(key: number | string): Promise<boolean> {
        const exists = await this.#client.sismember(usersKey(), key);
        return !!exists;
    }

    async save(user: User) {
        // user.id = this.#users.length + 1;
        //TODO set dynamic user id
        user.id = 1;
        await this.#client.sadd(usersKey(), user.id);
        await this.#client.sadd(usersKey(), user.username);
        await this.#client.set(userKey(user.username), user.id);
        await this.#client.hset(userKey(user.id), user);
    }

}

export default new UserRepository();