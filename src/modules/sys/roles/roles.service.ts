import { Injectable } from '@nestjs/common';
import { RoleDto, RoleQueryDto, RoleUpdateDto } from '~/modules/sys/roles/roles.dto';

import { Pagination } from '~/helper/paginate/pagination';
import { RoleEntity } from '~/modules/sys/roles/role.entity';
import { paginate } from '~/helper/paginate';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { UserEntity } from '~/modules/sys/user/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async list({
    page,
    pageSize,
    name,
    remark,
    status,
  }: RoleQueryDto): Promise<Pagination<RoleEntity>> {
    const queryBuilder = await this.roleRepository
      .createQueryBuilder('role')
      .where({
        ...(name ? { name } : null),
        ...(remark ? { remark } : null),
        ...(status ? { status } : null),
      });
    return paginate<RoleEntity>(queryBuilder, { page, pageSize });
  }

  /**
   * 添加角色
   * */
  async create({ name, ...data }: RoleDto) {
    // 查询是否有重复的角色
    const exists = await this.roleRepository.findOneBy({ name });
    if (!isEmpty(exists)) {
      throw new BusinessException(ErrorEnum.ROLE_EXISTS);
    }
    try {
      await this.entityManager.transaction(
        async (manager: EntityManager) => {
          // 你的事务逻辑
         const role=await manager.create(RoleEntity, {
            name,
            ...data,
          });
          await manager.save(role);

        },
      );
    } catch (error) {
      console.error('Failed to create role:', error);
      throw new BusinessException(ErrorEnum.GENERAL_ERROR);
    }
  }
/**
 * 获取角色信息
 * */
async info(id:number){
  const info = this.roleRepository.createQueryBuilder('role')
    .where({id}).getOne()

  return {
    ...info
  }
}
/**
 * 修改角色
 * */
async update(id,{menuIds,...data}:RoleUpdateDto):Promise<void>{
  await this.roleRepository.update(id,data)
  await this.entityManager.transaction(async(manager)=>{
    const role = await manager.findOne(RoleEntity,{where:{id}})
    role.menus=[]
    await manager.save(role)
  })

}
/**
 * 根据角色id 查用户
 * */
  /**
   * 根据角色ID查找是否有关联用户
   */
  async checkUserByRoleId(id: number): Promise<boolean> {
    return this.roleRepository.exist({
      where: {
        users: {
          'roles': { id },
        },
      },
    })
  }

  /**
   * 删除角色
   * */
  async delete(id:number[]):Promise<void>{
    await this.roleRepository.delete(id);
  }


}
