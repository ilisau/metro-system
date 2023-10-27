import {Schedule} from "../model/Schedule";
import {ScheduleRequest} from "../model/ScheduleRequest";
import scheduleRepository from "../repository/scheduleRepository";
import {generateSchedule, getAverageInterval} from "./scheduleCore";

class ScheduleService {

    async getById(id: number): Promise<Schedule> {
        return scheduleRepository.getById(id);
    }

    async getAllByAuthorId(id: number): Promise<Schedule[]> {
        return scheduleRepository.getAllByAuthorId(id);
    }

    async create(request: ScheduleRequest): Promise<Schedule> {
        const schedule = new Schedule(
            request.authorId,
            request.capacity * request.trains
        );
        const scheduleMeasurements = generateSchedule(
            request.flow,
            request.capacity * request.trains,
            request.accuracy,
            request.fullness
        );
        const averageInterval = getAverageInterval(scheduleMeasurements);
        schedule.intervals = scheduleMeasurements;
        schedule.averageInterval = averageInterval;
        schedule.accuracy = request.accuracy;
        await scheduleRepository.save(schedule);
        return schedule;
    }

    async isAuthor(userId: number, scheduleId: number): Promise<boolean> {
        return scheduleRepository.isAuthor(userId, scheduleId);
    }

}

export default new ScheduleService();