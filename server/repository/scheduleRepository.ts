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
            try {
                const json = await this.#client.get(scheduleKey(id));
                return JSON.parse(json!) as unknown as Schedule;
            } catch (e) {
                throw new Error("Schedule is corrupted.");
            }
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
        schedule.id = await this.#client.scard(schedulesKey()) + 1;
        await this.#client.sadd(schedulesKey(), schedule.id);
        await this.#client.set(scheduleKey(schedule.id), JSON.stringify(schedule));
        await this.#client.sadd(userSchedulesKey(schedule.authorId), schedule.id);
    }

}

export default new ScheduleRepository();