import User from "./User";
import Schedule from "./Schedule";

export function user(hashpairs: Record<string, string>): User {
    let user = hashpairs as unknown as User;
    user.id = Number(user.id);
    return user;
}

export function schedule(json: string): Schedule {
    let schedule: Schedule = JSON.parse(json);
    schedule.authorId = Number(schedule.authorId);
    return schedule;
}