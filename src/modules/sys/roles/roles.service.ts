import { Injectable } from '@nestjs/common';
import { RoleQueryDto } from '~/modules/sys/roles/roles.dto';
import { Pagination } from '~/helper/paginate/pagination';
import { RoleEntity } from '~/modules/sys/roles/role.entity';
import { paginate } from '~/helper/paginate';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
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
}
