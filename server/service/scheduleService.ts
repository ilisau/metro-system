import {Schedule} from "../model/Schedule";
import {ScheduleRequest} from "../model/ScheduleRequest";

class ScheduleService {

    #schedules: Schedule[];

    constructor() {
        this.#schedules = [];
    }

    getAllByAuthorId(id: number): Schedule[] {
        return this.#schedules.filter(s => s.authorId === id);
    }

    create(scheduleRequest: ScheduleRequest): Schedule {
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