import { ConfigType, registerAs, ConfigService } from '@nestjs/config';
import { env, envNumber } from '~/global/env';
import * as process from 'node:process';
export const securityRegToke = 'security';

export const SecurityConfig = registerAs(securityRegToke, () => ({
  jwtSecret: env('JWT_SECRET'),
  jwtExpire: envNumber('JWT_EXPIRE'),
  refreshSecret: env('REFRESH_TOKEN_SECRET'),
  refreshExpire: envNumber('REFRESH_TOKEN_EXPIRE'),
}));

export type ISecurityConfig = ConfigType<typeof SecurityConfig>;
