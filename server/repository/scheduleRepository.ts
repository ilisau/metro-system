import {redis, scheduleKey, schedulesKey, userSchedulesKey} from "../config";
import Schedule from "../model/Schedule";
import {schedule} from "../model/factory";

class ScheduleRepository {

    async getById(id: number): Promise<Schedule> {
        if (await redis.sismember(schedulesKey(), id)) {
            try {
                const json = await redis.get(scheduleKey(id));
                return schedule(json!);
            } catch (e) {
                throw new Error("Schedule is corrupted.");
            }
        } else {
            throw new Error("Schedule not found.");
        }
    }

    async getAllByAuthorId(id: number): Promise<Schedule[]> {
        const ids = await redis.smembers(userSchedulesKey(id));
        return Promise.all(ids.map(async (id) => await this.getById(Number(id))));
    }

    async isAuthor(userId: number, scheduleId: number): Promise<boolean> {
        return !!(await redis.sismember(userSchedulesKey(userId), scheduleId));
    }

    async save(schedule: Schedule) {
        schedule.id = await redis.scard(schedulesKey()) + 1;
        await redis.sadd(schedulesKey(), schedule.id);
        await redis.set(scheduleKey(schedule.id), JSON.stringify(schedule));
        await redis.sadd(userSchedulesKey(schedule.authorId), schedule.id);
    }

}

export const scheduleRepository = new ScheduleRepository();