import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { RoleQueryDto } from '~/modules/sys/roles/roles.dto';
import { RoleEntity } from '~/modules/sys/roles/role.entity';
import { RolesService } from '~/modules/sys/roles/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get('list')
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResult({ type: [RoleEntity], isPage: true })
  async list(@Query() dto: RoleQueryDto) {
    return this.rolesService.list(dto);
  }
}
