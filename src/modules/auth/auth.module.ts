import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "~/modules/sys/user/user.module";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
      PassportModule,
      JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory:(configService: ConfigService) => ({
              const JwtSecret = configService.get('JWT_SECRET')
              const JwtExpire = configService.get('JWT_EXPIRE')

              return {
                  secret:JwtSecret,
                  signOptions:{
                      expiresIn: `${JwtExpire}s`,
                  },
                  ignoreExpiration:false,
              }
          })
      })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
