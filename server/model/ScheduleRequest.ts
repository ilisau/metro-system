import {FlowMeasurement} from "./FlowMeasurement";

export class ScheduleRequest {

    id: number;
    trains: number;
    capacity: number;
    flow: FlowMeasurement[];
    authorId: number = 0;

    constructor(id: number, trains: number, capacity: number, flow: FlowMeasurement[]) {
        this.id = id;
        this.trains = trains;
        this.capacity = capacity;
        this.flow = flow;
    }

}