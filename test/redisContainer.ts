import {GenericContainer} from "testcontainers";
import Redis from "ioredis";
import {setRedis} from "../server/config";

export default class RedisContainer {

    private container: any;
    private redisClient: any;

    async init() {
        this.container = await new GenericContainer("redis")
            .withExposedPorts(6379)
            .start();
        this.redisClient = new Redis(
            this.container.getFirstMappedPort(),
            this.container.getHost(),
        );
        setRedis(this.redisClient);
    }

    async stop() {
        await this.container.stop();
        this.redisClient.quit();
    }

    flushAll() {
        this.redisClient.flushall();
    }

    redis(): Redis {
        return this.redisClient;
    }

}