import { Module } from '@nestjs/common';
import configuration from './env/index';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/sys/user/user.module';
@Module({
  imports: [
    // 加载全局变量
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
