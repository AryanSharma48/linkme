import { createClient } from 'redis';
import { config } from '../utils/config';

const client = createClient({ url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}` });

client.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
});

export async function connectRedis() {
    await client.connect();
}

export default client;