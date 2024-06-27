import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';
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

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  async update(
    @Param('id') id: string,
    @Body() data: UserUpdateDto,
  ): Promise<{ message: string }> {
    await this.userService.update(Number(id), data);
    return {
      message: '修改成功',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({
    name: 'id',
    type: String,
    schema: { oneOf: [{ type: 'string' }, { type: 'number' }] },
  })
  async delete(
    @Param('id', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ) {
    return await this.userService.delete(ids);
  }
}
