/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from '~/modules/auth/guards/local.guard';
@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Controller()
export class AuthController {}
