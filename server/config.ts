import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export let redis = new Redis(
    Number(process.env.REDIS_PORT),
    String(process.env.REDIS_HOST),
    {}
);

export function setRedis(client: Redis) {
    redis = client
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

export default function tokenKey(id: number) {
    return `tokens:${id}`;
}