import Redis from "ioredis";
import {getRedis, scheduleKey, schedulesKey, userSchedulesKey} from "../config";
import {Schedule} from "../model/Schedule";

class ScheduleRepository {

    #client: Redis;

    constructor() {
        this.#client = getRedis();
    }

    async getById(id: number): Promise<Schedule> {
        if (await this.#client.sismember(schedulesKey(), id)) {
            const hashPairs = await this.#client.hgetall(scheduleKey(id));
            return hashPairs as unknown as Schedule;
        } else {
            throw new Error("Schedule not found.");
        }
    }

    async getAllByAuthorId(id: number): Promise<Schedule[]> {
        const ids = await this.#client.smembers(userSchedulesKey(id));
        return Promise.all(ids.map(async (id) => await this.getById(Number(id))));
    }

    async isAuthor(userId: number, scheduleId: number): Promise<boolean> {
        return !!(await this.#client.sismember(userSchedulesKey(userId), scheduleId));
    }

    async save(schedule: Schedule) {
        //TODO set dynamic schedule id
        schedule.id = 1;
        await this.#client.sadd(schedulesKey(), schedule.id);
        await this.#client.hset(scheduleKey(schedule.id), schedule);
        await this.#client.sadd(userSchedulesKey(schedule.authorId), schedule.id);
    }

}

export default new ScheduleRepository();