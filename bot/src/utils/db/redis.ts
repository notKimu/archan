import { createClient } from "redis";

const redisClient = createClient({
	url: process.env.REDIS_URI,
	password: process.env.REDIS_PASSWORD,
});

export default redisClient;
