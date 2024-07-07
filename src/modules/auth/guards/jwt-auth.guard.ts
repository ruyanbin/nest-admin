import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy, PUBLIC_KEY } from '~/modules/auth/auto.constant';
import { Reflector } from '@nestjs/core';
import { AuthService } from '~/modules/auth/auth.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ExtractJwt } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { genTokenBlacklistKey } from '~/helper/getRedisKey';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';

interface RequestType {
  Params: {
    uid?: string
  }
  Querystring: {
    token?: string
  }
}
@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken();
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    @InjectRedis() private readonly redis: RedisService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest<RequestType>>();
  // 获取token
    const token = this.jwtFromRequestFn(request);
    // 判断token 是否在黑名单中
    if(await this.redis.get(genTokenBlacklistKey(token)){
    throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    }
    request.accessToken = token
  }
}
