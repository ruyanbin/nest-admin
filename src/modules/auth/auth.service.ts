/*
https://docs.nestjs.com/providers#services
*/

import { UserService } from '~/modules/sys/user/user.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { isEmpty } from 'lodash';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { md5 } from '~/utils';
import { genAuthPVKey, genAuthTokenKey } from '~/helper/getRedisKey';
import { TokenService } from '~/modules/auth/services/token.service';
import { ISecurityConfig, SecurityConfig } from '~/config';

@Injectable()
export class AuthService {
  constructor(
    // @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private tokenService: TokenService,

    @InjectRedis() private readonly redis: Redis,

    private userService: UserService,
  ) {}

  async validateUser(credential: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(credential);

    if (isEmpty(user)) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);
    }

    const comparePassword = md5(`${password}`);
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
  /**
   * 登录
   * */
  async login(
    username: string,
    password: string,
    // ip: string,
    // ua: string,
  ): Promise<string> {
    const user = await this.userService.findUserByUserName(username);

    if (isEmpty(user)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    if (user.password !== password) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);
    }
    // 获取token
    const token = await this.tokenService.generateAccessToken(user.id, ['1']);

    console.log('token', token);
    // await this.redis.set(
    //   genAuthTokenKey(user.id),
    //   token.accessToken,
    //   'EX',
    //   this.securityConfig.jwtExprire,
    // );
    return token.accessToken;
  }

  /**
   * 校验账号密码
   * */
  async checkPassword(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(username);

    const comparePassword = md5(`${password}`);
    if (user.password !== comparePassword) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);
    }
    return true;
  }
  /**
   * 重置密码
   * */
  async resetPassword(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(username);
    await this.userService.forceUpdatePassword(user.id, password);
  }

  /**
   * 清除登录状态
   */
  async clearLoginStatus(user: IAuthUser, accessToken: string): Promise<void> {
    // await this.userService.forbidden(user.uid, accessToken);
    await this.userService.forbidden(user.uid);
  }

  /**
   * 获取权限列表
   */
  async getPasswordVersionByUid(uid: number): Promise<string> {
    return this.redis.get(genAuthPVKey(uid));
  }
  async getTokenByUid(uid: number): Promise<string> {
    return this.redis.get(genAuthTokenKey(uid));
  }
}
