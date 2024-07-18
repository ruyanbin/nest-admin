// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// /*
// https://docs.nestjs.com/modules
// */
//
// import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
// import { UserModule } from '~/modules/sys/user/user.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AccessTokenEntity } from '~/modules/auth/entities/access-token.entity';
// import { RefreshTokenEntity } from '~/modules/auth/entities/refresh-token.entity';
// import { CaptchaService } from '~/modules/auth/services/captcha.service';
// import { AccountController } from './controllers/account.controller';
// import { TokenService } from '~/modules/auth/services/token.service';
// import { CaptchaController } from '~/modules/auth/controllers/captcha.controller';
// const providers = [AuthService,TokenService, CaptchaService];
//
// const controllers = [
//   AuthController,
//   AccountController,
//   CaptchaController,
// ]
// @Module({
//   imports: [
//     TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
//     PassportModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         const JwtSecret: string = configService.get('JWT_SECRET');
//         const JwtExpire: string = configService.get('JWT_EXPIRE');
//
//         return {
//           secret: JwtSecret,
//           signOptions: {
//             expiresIn: `${JwtExpire}s`,
//           },
//           ignoreExpiration: false,
//         };
//       },
//     }),
//     UserModule,
//   ],
//   controllers: [...controllers],
//   providers: [...providers],
//   exports: [TypeOrmModule, JwtModule, ...providers],
// })
// export class AuthModule {}
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
        // const { jwtSecret, jwtExprire }
        //   = configService.get<ISecurityConfig>('security')

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
