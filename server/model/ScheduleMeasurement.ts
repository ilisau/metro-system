export class ScheduleMeasurement {

    time: string;
    took: number;
    left: number;

    constructor(time: string, took: number, left: number) {
        this.time = time;
        this.took = took;
        this.left = left;
    }

}