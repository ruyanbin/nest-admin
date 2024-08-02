import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { OperatorDto } from '~/common/dto/operator.dto';
import { PagerDto } from '~/common/dto/pager.dto';


export class RoleDto extends OperatorDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  @MinLength(2, { message: '角色名称长度不能小于2' })
  name: string;

  @ApiProperty({ description: '角色备注' })
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  status: number;

  @ApiProperty({ description: '关联菜单、权限编号' })
  @IsOptional()
  @IsArray()
  menuIds?: number[];
}

export class RoleUpdateDto extends PartialType(RoleDto) {}

export class RoleQueryDto extends IntersectionType(
  PagerDto<RoleDto>,
  PartialType(RoleDto),
) {
  @ApiProperty({ description: '角色名称', required: false })
  @IsString()
  name?: string;
}
