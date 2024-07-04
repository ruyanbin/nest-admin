import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '~/modules/sys/user/user.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { UserStatus } from './constant';
import { AccountInfo } from './user.model';
import { isEmpty } from 'lodash';
import { md5, randomValue } from '~/utils';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { AccountUpdateDto } from './dto/account.dto';
import { PasswordUpdateDto } from './dto/password.dto';
import { UserDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';
import { Pagination } from '~/helper/paginate/pagination';
import { paginate } from '~/helper/paginate';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { RegisterDto } from '~/modules/auth/dto/auth.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import {
  genAuthPermKey,
  genAuthPVKey,
  genAuthTokenKey,
} from '~/helper/getRedisKey';

@Injectable()
export class UserService {
  constructor(
    // @InjectRedis()
    // private readonly redis: Redis,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) { }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        id,
        status: UserStatus.Enabled,
      })
      .getOne();
  }

  async findUserByUserName(username: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        username: username,
        status: UserStatus.Enabled,
      })
      .getOne();
  }

  /**
   *获取用户信息
   * @param uid user id
   * */
  async getAccountInfo(uid: number): Promise<AccountInfo> {
    const user: UserEntity = await this.userRepository
      .createQueryBuilder('user')
      // .leftJoinAndSelect('user.roles', 'role')
      .where(`user.id = :uid`, { uid })
      .getOne();

    if (isEmpty(user)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }

    delete user?.salt;

    return user;
  }

  /** 更新个人信息*/
  async updateAccountInfo(uid: number, info: AccountUpdateDto) {
    const user = await this.userRepository.findOneBy({ id: uid });
    if (isEmpty(user)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    const data = {
      ...(info.nickname ? { nickname: info.nickname } : null),
      ...(info.avatar ? { avatar: info.avatar } : null),
      ...(info.email ? { email: info.email } : null),
      ...(info.phone ? { phone: info.phone } : null),
      ...(info.qq ? { qq: info.qq } : null),
      ...(info.remark ? { remark: info.remark } : null),
    };

    await this.userRepository.update(uid, data);
  }

  /**
   *更改密码
   */
  async updatePassword(uid: number, dto: PasswordUpdateDto): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: uid });
    if (isEmpty(user)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }

    const comparePassword = md5(`${dto.oldPassword}${user.salt}`);
    // 原密码不一致，不允许更改
    if (user.password !== comparePassword) {
      throw new BusinessException(ErrorEnum.PASSWORD_MISMATCH);
    }
    const password = md5(`${dto.newPassword}${user.salt}`);
    await this.userRepository.update({ id: uid }, { password });
  }

  // 更改密码
  async forceUpdatePassword(uid: number, password: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: uid });
    const newPassword = md5(`${password}${user.salt}`);
    await this.userRepository.update({ id: uid }, { password: newPassword });
  }

  // 新增用户
  async create({ username, password, roleIds, ...data }: UserDto) {
    const exists = await this.userRepository.findOneBy({ username });
    if (!isEmpty(exists)) {
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
    }
    await this.entityManager.transaction(async (manager) => {
      console.log(manager, 'manager');
      const salt = randomValue(32);
      if (!password) {
        password = md5(`Aa123456${salt}`);
      }
      const u = manager.create(UserEntity, {
        username,
        password,
        ...data,
        salt: salt,
        roles: roleIds,
      });
      return await manager.save(u);
    });
  }

  // 修改用户
  async update(
    id: number,
    { password, roleIds, status, ...data }: UserUpdateDto,
  ): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      if (password) {
        await this.forceUpdatePassword(id, password);
      }
      await manager.update(UserEntity, id, { id: undefined, ...data });

      return await this.userRepository
        .createQueryBuilder('user')
        // .leftJoinAndSelect('user.roles', 'roles')
        .where('user.id = :id', { id })
        .getOne();
    });
  }

  /**
   * 查询用户列表
   */
  async list({
    page,
    pageSize,
    username,
    nickname,
    email,
    status,
  }: UserQueryDto): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      // .leftJoinAndSelect('user.dept','dept')
      // .leftJoinAndSelect('user.roles', 'roles')
      .where({
        ...(username ? { username: Like(`%${username}%`) } : null),
        ...(nickname ? { nickname: Like(`%${nickname}%`) } : null),
        ...(email ? { email: Like(`%${email}%`) } : null),
        ...(!isNil(status) ? { status } : null),
      });
    return paginate<UserEntity>(queryBuilder, {
      page,
      pageSize,
    });
  }

  /**
   * 删除用户
   * */

  async delete(userIds: number[]) {
    const deleteResult = await this.userRepository.delete(userIds);
    if (deleteResult.affected) {
      return {
        message: '成功删除',
      };
    } else {
      return {
        message: '删除失败',
      };
    }
  }

  /***/
  async register({ username, ...data }: RegisterDto): Promise<void> {
    const exists = await this.userRepository.findOneBy({ username });
    if (!isEmpty(exists)) {
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
    }
    await this.entityManager.transaction(async (manager) => {
      const salt = randomValue(32);
      const password = md5(`${data.password ?? 'Aa123456'}${salt}`);
      const u = manager.create(UserEntity, {
        username,
        password,
        status: 1,
        salt: salt,
      });
      const user = await manager.save(u);
      return user;
    });
  }

  async forbidden(uid: number, accessToken: string) {
    // await this.redis.del(genAuthPVKey(uid));
    // await this.redis.del(genAuthTokenKey(uid));
    // await this.redis.del(genAuthPermKey(uid));
  }
}
