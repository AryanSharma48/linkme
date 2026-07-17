import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    REDIS_HOST: z.string().default('redis'),
    REDIS_PORT: z.string().regex(/^\d+$/).default('6379'),
    PORT: z.string().regex(/^\d+$/).default('3000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}

export const config = parsedEnv.data;
