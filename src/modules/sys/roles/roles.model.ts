import { RoleEntity } from '~/modules/sys/roles/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RoleInfo extends RoleEntity {
  @ApiProperty({ type: [Number] })
  menuIds: number[];
}
