import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UserEntity } from '~/modules/sys/user/user.entity';
@ApiTags('System - 用户模块')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  @ApiOperation({ summary: '新增用户' })
  async create(@Body() data: UserDto): Promise<void> {
    console.log(data, '创建用户');
    await this.userService.create(data);
  }
}
