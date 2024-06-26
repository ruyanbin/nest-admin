import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { Type } from 'class-transformer';

export class UserDto {
  @ApiProperty({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '登录账号', example: 'admin' })
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/)
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({ description: '登录密码', example: 'Aa123456' })
  @IsOptional()
  @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
    message: '密码必须包含数字、字母，长度为6-16',
  })
  password: string;
  @ApiProperty({ description: '归属角色', type: [Number] })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  roleIds?: number[];

  @ApiProperty({ description: '归属大区', type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  deptId?: number;

  @ApiProperty({ description: '昵称', example: 'admin' })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '邮箱', example: '1@qq.com' })
  @IsEmail()
  @ValidateIf((O) => !isEmpty(O.email))
  email: string;

  @ApiProperty({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'QQ' })
  @IsOptional()
  @IsString()
  @Matches(/^[1-9][0-9]{4,10}$/, {
    message: 'qq账号格式错误',
  })
  @MinLength(5)
  @MaxLength(11)
  qq?: string;
  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  status: number;
}
export class UserUpdateDto extends PartialType(UserDto) {}
// 翻页
