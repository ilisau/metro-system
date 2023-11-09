import User from "../model/User";
import {redis, userKey, usersKey} from "../config"
import {user} from "../model/factory";

class UserRepository {

    async getById(id: number): Promise<User> {
        if (await redis.sismember(usersKey(), id)) {
            const hashPairs = await redis.hgetall(userKey(id));
            return user(hashPairs);
        } else {
            throw new Error("User not found.");
        }
    }

    async getByUsername(username: string): Promise<User> {
        if (await redis.sismember(usersKey(), username)) {
            const userId = await redis.get(userKey(username));
            const hashPairs = await redis.hgetall(userKey(userId!));
            return user(hashPairs);
        } else {
            throw new Error("User not found.");
        }
    }

    async exists(key: number | string): Promise<boolean> {
        const exists = await redis.sismember(usersKey(), key);
        return !!exists;
    }

    async save(user: User) {
        user.id = await redis.scard(usersKey()) / 2 + 1;
        await redis.sadd(usersKey(), user.id);
        await redis.sadd(usersKey(), user.username);
        await redis.set(userKey(user.username), user.id);
        await redis.hset(userKey(user.id), user);
    }

}

export const userRepository = new UserRepository();