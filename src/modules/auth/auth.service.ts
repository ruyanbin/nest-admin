/*
https://docs.nestjs.com/providers#services
*/

import { UserService } from '~/modules/sys/user/user.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { isEmpty } from 'lodash';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { md5 } from '~/utils';
import { genAuthPVKey, genAuthTokenKey } from '~/helper/getRedisKey';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private userService: UserService,
  ) {}

  async validateUser(credential: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(credential);

    if (isEmpty(user)) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);
    }

    const comparePassword = md5(`${password}${user.salt}`);
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
    ip: string,
    ua: string,
  ): Promise<string> {
    const user = await this.userService.findUserByUserName(username);
    if (isEmpty(user)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    const comparePassword = md5(`${password}${user.salt}`);
    if (user.password !== comparePassword) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);
    }

    return '登录成功';
  }

  /**
   * 校验账号密码
   * */
  async checkPassword(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(username);

    const comparePassword = md5(`${password}${user.salt}`);
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
    await this.userService.forbidden(user.uid, accessToken);
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
