/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Ip, Post, UseGuards, Headers } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from '~/modules/auth/guards/local.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { UserService } from '../sys/user/user.service';
import { CaptchaService } from './services/captcha.service';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { LoginToken } from './models/auth.model';
import { LoginDto, RegisterDto } from './dto/auth.dto';
@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private captchaService: CaptchaService,
  ) {}
  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult({ type: LoginToken })
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ): Promise<LoginToken> {
    await this.captchaService.checkImgCaptcha(dto.captchaId, dto.verifyCode);
    const token = await this.authService.login(
      dto.username,
      dto.password,
      // ip,
      // ua,
    );
    return { token };
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() data: RegisterDto): Promise<void> {
    await this.userService.register(data);
  }
}
