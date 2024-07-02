import { Module } from '@nestjs/common';
import configuration from './env/index';
import { typeormconfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/sys/user/user.module';
import { LoggerService } from '~/shared/logger/logger.service';
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '~/common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from "~/common/interceptors/timeout.interceptor";
import { RedisCacheModule } from './shared/redis/redis.module';
@Module({
  imports: [
    // 加载全局变量
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      isGlobal: true,
      load: [configuration],
    }),
    // 数据库
    typeormconfig(),
    UserModule,
    RedisCacheModule,
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
