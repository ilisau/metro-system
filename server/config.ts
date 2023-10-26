import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export function getRedis(): Redis {
    return new Redis(
        Number(process.env.REDIS_PORT),
        String(process.env.REDIS_HOST),
        {}
    );
}

export function usersKey() {
    return "users";
}

export function userKey(key: number | string) {
    return `users:${key}`;
}

export function schedulesKey() {
    return "schedules";
}

export function scheduleKey(id: number) {
    return `schedules:${id}`;
}

export function userSchedulesKey(id: number) {
    return `users:${id}:schedules`;
}

export function tokenKey(id: number) {
    return `tokens:${id}`;
}