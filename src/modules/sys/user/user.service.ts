import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '~/modules/sys/user/user.entity';
import { Repository, EntityManager } from 'typeorm';
import { UserStatus } from './constant';
import { AccountInfo } from './user.model';
import { isEmpty } from 'lodash';
import { md5, randomValue } from '~/utils';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { AccountUpdateDto } from './dto/account.dto';
import { PasswordUpdateDto } from './dto/password.dto';
import { UserDto, UserUpdateDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

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
    if (!info.avatar && info.qq) {
      // 如果qq 不相登则更新qq头像
      // data.avater = await this.qqService.getAvater(info.qq)
    }
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
  //
  async create({ username, password, roleIds, deptId, ...data }: UserDto) {
    console.log(111111);
    const exists = await this.userRepository.findOneBy({ username });
    console.log(exists,'exsisits',isEmpty(exists))
    if (!isEmpty(exists)) {
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
    }
    await this.entityManager.transaction(async (manager) => {
      const salt = randomValue(32);
      if (!password) {
        password = md5(`Aa123456${salt}`);
      }

      // @ts-ignore
      const u = manager.create(UserEntity, {
        username,
        password,
        ...data,
        salt: salt,
        roles: roleIds,
        dept: deptId,
      });
      const result = await manager.save(u);
      return result;
    });
  }
  // 更新菜单
  async update(
    id: number,
    { password, deptId, roleIds, status, ...data }: UserUpdateDto,
  ): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      if (password) {
        await this.forceUpdatePassword(id, password);
      }
      // @ts-ignore
      await manager.update(UserEntity, id, { ...data, status });

      const user = await this.userRepository
        .createQueryBuilder('user')
        // .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('user.dept', 'dept')
        .where('user.id = :id', { id })
        .getOne();
    });
  }
}
