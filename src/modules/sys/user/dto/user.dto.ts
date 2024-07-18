import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
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
import { PagerDto } from '~/common/dto/pager.dto';

export class UserDto {
  @ApiProperty({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '登录账号' })
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: '账户只能由字母，数字组成',
  })
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({ description: '登录密码' })
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

  @ApiProperty({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '邮箱' })
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
  status: string;
}
export class UserUpdateDto extends PartialType(UserDto) {}
// 翻页
export class UserQueryDto extends IntersectionType(
  PagerDto<UserDto>,
  PartialType(UserDto),
) {
  @ApiProperty({ description: '状态', example: 0, required: false })
  @IsOptional()
  status?: string;
}
