import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { RoleDto, RoleQueryDto } from '~/modules/sys/roles/roles.dto';
import { RoleEntity } from '~/modules/sys/roles/role.entity';
import { RolesService } from '~/modules/sys/roles/roles.service';
@ApiTags('角色管理')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get('list')
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResult({ type: [RoleEntity], isPage: true })
  async list(@Query() dto: RoleQueryDto) {
    return this.rolesService.list(dto);
  }

  @Post()
  @ApiOperation({ summary: '新增角色' })
  @ApiResult({ type: RoleEntity })
  async create(@Body() dto: RoleDto): Promise<void> {
    return this.rolesService.create(dto);
  }
}
