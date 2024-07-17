import { registerAs } from '@nestjs/config';
import { env, envBoolean, envNumber } from '~/global/env';

export const AppConfig = registerAs('app', () => ({
  name: env('app.NAME'),
  port: envNumber('app.PORT'),
  baseUrl: env('app.BASEURL'),
  globalPrefix: env('GLOBAL_PREFIX', 'API'),
  locale: env('app.LOCALE', 'zh-CN'),
  // 多端登录
  multiDeviceLogin: envBoolean('MULTI_DEVICE_LOGIN', true),

  logger: {
    level: env('LOGGER_LEVEL'),
    maxFiles: envNumber('LOGGER_MAX_FILES'),
  },
}));

export type IAppConfig = ReturnType<typeof AppConfig>;
