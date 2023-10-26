import {Schedule} from "../model/Schedule";
import {ScheduleRequest} from "../model/ScheduleRequest";
import scheduleRepository from "../repository/scheduleRepository";

class ScheduleService {

    async getById(id: number): Promise<Schedule> {
        return scheduleRepository.getById(id);
    }

    async getAllByAuthorId(id: number): Promise<Schedule[]> {
        return scheduleRepository.getAllByAuthorId(id);
    }

    async create(scheduleRequest: ScheduleRequest): Promise<Schedule> {
        const schedule = new Schedule(
            0,
            scheduleRequest.authorId,
            scheduleRequest.capacity,
            1
        );
        //TODO implement logic
        await scheduleRepository.save(schedule);
        return schedule;
    }

    async isAuthor(userId: number, scheduleId: number): Promise<boolean> {
        return scheduleRepository.isAuthor(userId, scheduleId);
    }

}

export default new ScheduleService();