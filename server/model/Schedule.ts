export class Schedule {

    id: number;
    authorId: number;
    capacity: number;
    interval: number;

    constructor(id: number, authorId: number, capacity: number, interval: number) {
        this.id = id;
        this.authorId = authorId;
        this.capacity = capacity;
        this.interval = interval;
    }

}