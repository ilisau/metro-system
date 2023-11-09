import ScheduleMeasurement from "./ScheduleMeasurement";

export default class Schedule {

    id: number;
    authorId: number;
    capacity: number;
    accuracy: number;
    averageInterval: number;
    intervals: ScheduleMeasurement[];

    constructor(authorId: number, capacity: number) {
        this.id = 0;
        this.authorId = authorId;
        this.capacity = capacity;
        this.accuracy = 0;
        this.averageInterval = 0;
        this.intervals = [];
    }

}