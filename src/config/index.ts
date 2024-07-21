import { AppConfig } from './app.config';
import { SecurityConfig } from './security.config';
import { RedisConfig } from '~/config/redis.config';
export * from './security.config';
export * from './app.config';
export * from './redis.config';
export default {
  AppConfig,
  SecurityConfig,
  RedisConfig,
};
