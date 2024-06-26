import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto, UserQueryDto } from './dto/user.dto';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { UserEntity } from '~/modules/sys/user/user.entity';
@ApiTags('System - 用户模块')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResult({ type: [UserEntity], isPage: true })
  async list(@Query('page') dto: UserQueryDto) {
    return this.userService.list(dto);
  }

  @Post()
  @ApiOperation({ summary: '新增用户' })
  async create(@Body() data: UserDto): Promise<void> {
    console.log(data, '创建用户');
    await this.userService.create(data);
  }
}
