import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '~/modules/sys/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenEntity } from '~/modules/auth/entities/access-token.entity';
import { RefreshTokenEntity } from '~/modules/auth/entities/refresh-token.entity';
import { CaptchaService } from '~/modules/auth/services/captcha.service';
const providers = [AuthService, CaptchaService];
@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const JwtSecret: string = configService.get('JWT_SECRET');
        const JwtExpire: string = configService.get('JWT_EXPIRE');

        return {
          secret: JwtSecret,
          signOptions: {
            expiresIn: `${JwtExpire}s`,
          },
          ignoreExpiration: false,
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [...providers],
  exports: [TypeOrmModule, JwtModule, ...providers],
})
export class AuthModule {}
