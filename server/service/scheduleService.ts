import {Schedule} from "../model/Schedule";
import {ScheduleRequest} from "../model/ScheduleRequest";

class ScheduleService {

    #schedules: Schedule[];

    constructor() {
        this.#schedules = [];
    }

    async getAllByAuthorId(id: number): Promise<Schedule[]> {
        return this.#schedules.filter(s => s.authorId === id);
    }

    async create(scheduleRequest: ScheduleRequest): Promise<Schedule> {
        const schedule = new Schedule(
            this.#schedules.length + 1,
            scheduleRequest.authorId,
            scheduleRequest.capacity,
            1
        );
        //TODO implement logic
        this.#schedules.push(schedule);
        return schedule;
    }
}

export default new ScheduleService();