import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {}
