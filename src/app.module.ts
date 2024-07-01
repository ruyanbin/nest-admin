import { Module } from '@nestjs/common';
import configuration from './env/index';
import { typeormconfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/sys/user/user.module';
import { LoggerService } from '~/shared/logger/logger.service';

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
  ],
  controllers: [],
  providers: [LoggerService],
})
export class AppModule {}
