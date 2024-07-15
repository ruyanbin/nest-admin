import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorators';
import { AccountInfo } from '~/modules/sys/user/user.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard';
import { UserService } from '~/modules/sys/user/user.service';
import { AuthService } from '~/modules/auth/auth.service';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { AllowAnon } from '~/modules/auth/decorators/allow-anon.decorator';
import { FastifyRequest } from 'fastify';
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator';
@ApiTags('账户模块')
@ApiSecurityAuth()
@ApiExtraModels(AccountInfo)
@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Get('profile')
  @ApiOperation({summary:"获取账户资料"})
  @ApiResult({type:AccountInfo})
  @AllowAnon()
  async profile(@AuthUser() user:IAuthUser): Promise<AccountInfo> {
    return this.userService.getAccountInfo(user.uid)
  }
  @Get('logout')
  @ApiOperation({summary:"退出"})
  @AllowAnon()
  async logout(@AuthUser() user:IAuthUser,@Req()req:FastifyRequest): Promise<void> {
    await this.authService.clearLoginStatus(user, req.accessToken)
  }


}
