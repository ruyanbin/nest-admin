import { ConfigType, registerAs } from '@nestjs/config';
import { env, envNumber } from '~/global/env';
export const securityRegToke = 'security';

export const securityConfig = registerAs(securityRegToke, () => ({
  jwtSecret: env('JWT_SECRET'),
  jwtExprire: envNumber('JWT_EXPRIRE'),
  refreshSecret: env('REFRESH_TOKEN_SECRET'),
  refreshExpire: envNumber('REFRESH_TOKEN_EXPIRE'),
}));
export type ISecurityConfig = ConfigType<typeof securityConfig>;
