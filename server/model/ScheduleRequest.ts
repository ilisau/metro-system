import {FlowMeasurement} from "./FlowMeasurement";

export class ScheduleRequest {

    id: number;
    trains: number;
    capacity: number;
    accuracy: number;
    fullness: number;
    flow: FlowMeasurement[];
    authorId: number;

    constructor(id: number, trains: number, capacity: number, flow: FlowMeasurement[]) {
        this.id = id;
        this.trains = trains;
        this.capacity = capacity;
        this.flow = flow;
        this.authorId = 0;
        this.accuracy = 3;
        this.fullness = 0.9;
    }

}