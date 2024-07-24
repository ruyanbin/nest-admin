import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import config from './config/index';

import { typeormconfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/sys/user/user.module';
import { LoggerService } from '~/shared/logger/logger.service';
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '~/common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from '~/common/interceptors/timeout.interceptor';
import { RedisModule } from './shared/redis/redis.module';
import { RolesModule } from './modules/sys/roles/roles.module';
@Module({
  imports: [
    AuthModule,
    // 加载全局变量
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    // 数据库
    typeormconfig(),
    UserModule,
    RedisModule,
    RolesModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new TimeoutInterceptor(15 * 1000),
    },
    LoggerService,
  ],
})
export class AppModule {}
