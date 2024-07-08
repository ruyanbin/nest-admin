import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { isEmpty, isNil } from 'lodash'
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
    // if(await this.redis.get(genTokenBlacklistKey(token)){
    // throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    // }
    request.accessToken = token
   let result:any = false
    try{
      result = await super.canActivate(contetx)
    }catch(err){
      // 判断携带了token 的用户解析到request.user
      if(isPublic){
        return true
      }
      if(isEmpty(token)){
        throw new UnauthorizedException('未登录')
      }
      // 在 handleRequest 中 user 为 null 时会抛出 UnauthorizedException
      if (err instanceof UnauthorizedException){
        throw new BusinessException(ErrorEnum.INVALID_LOGIN)
      }
     //判断token 是否存在有效期
     //  const isValid= isNil(token)?undefined:await this.tokenService.checkAccessToken(token!)
     //  if (!isValid)
     //    throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    }

    // const pv = await this.authService.getPasswordVersionByUid(request.user.uid)
    // if (pv !== `${request.user.pv}`) {
    //   // 密码版本不一致，登录期间已更改过密码
    //   throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    // }

    // 不允许多端登录
    // if (!this.appConfig.multiDeviceLogin) {
    //   const cacheToken = await this.authService.getTokenByUid(request.user.uid)
    //
    //   if (token !== cacheToken) {
    //     // 与redis保存不一致 即二次登录
    //     throw new BusinessException(ErrorEnum.ACCOUNT_LOGGED_IN_ELSEWHERE)
    //   }
    // }

    return result
  }
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user)
      throw err || new UnauthorizedException()

    return user
  }
}
