import { Controller, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorators';
import { AccountInfo } from '~/modules/sys/user/user.model';
import { JwtModule } from '@nestjs/jwt';
@ApiTags('账户模块')
@ApiSecurityAuth()
@ApiExtraModels(AccountInfo)
@UseGuards()
@Controller('account')
export class AccountController {}
