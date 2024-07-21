import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { ISecurityConfig } from '~/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountController } from './controllers/account.controller';
import { CaptchaController } from './controllers/captcha.controller';
import { AccessTokenEntity } from './entities/access-token.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { CaptchaService } from './services/captcha.service';
import { TokenService } from './services/token.service';
import { UserModule } from '~/modules/sys/user/user.module';

const controllers = [AuthController, AccountController, CaptchaController];
const providers = [AuthService, TokenService, CaptchaService];

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwtExprire = configService.get('JWT_EXPIRE');
        const jwtSecret = configService.get('JWT_SECRET');
        console.log(jwtExprire, 'jwtExprire');
        console.log(jwtSecret, 'jwtSecret');
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExprire}s`,
          },
          ignoreExpiration: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [...controllers],
  providers: [...providers],
  exports: [TypeOrmModule, JwtModule, ...providers],
})
export class AuthModule {}
