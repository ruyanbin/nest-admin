import { registerAs } from '@nestjs/config';
import { env, envBoolean, envNumber } from '~/global/env';
export const RedisRegToken = 'redis';
export const RedisConfig = registerAs(RedisRegToken, () => ({
  host: env('REDIS_HOST', '127.0.0.1'),
  port: envNumber('REDIS_PORT', 6379),
  password: env('REDIS_PASSWORD'),
  db: envNumber('REDIS_DB'),
}));
export type IRedisConfig = ReturnType<typeof RedisConfig>;
