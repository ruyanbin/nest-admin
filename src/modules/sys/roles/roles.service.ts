import { Injectable } from '@nestjs/common';
import { RoleDto, RoleQueryDto } from '~/modules/sys/roles/roles.dto';

import { Pagination } from '~/helper/paginate/pagination';
import { RoleEntity } from '~/modules/sys/roles/role.entity';
import { paginate } from '~/helper/paginate';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';

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
    value,
    remark,
    status,
  }: RoleQueryDto): Promise<Pagination<RoleEntity>> {
    const queryBuilder = await this.roleRepository
      .createQueryBuilder('role')
      .where({
        ...(name ? { name } : null),
        ...(value ? { value } : null),
        ...(remark ? { remark } : null),
        ...(status ? { status } : null),
      });
    return paginate<RoleEntity>(queryBuilder, { page, pageSize });
  }

  //
  async create({ name, ...data }: RoleDto) {
    // 查询是否有重复的角色
    const exists = await this.roleRepository.findOneBy({ name });
    if (!isEmpty(exists)) {
      throw new BusinessException(ErrorEnum.ROLE_EXISTS);
    }

    await this.entityManager.transaction(async (manager) => {
      const r = manager.create(RoleEntity, { name, ...data });
      return await manager.save(r);
    });
  }
}
