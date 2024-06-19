import { Module } from '@nestjs/common';
import configuration from './env/index';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/sys/user/user.module';
@Module({
  imports: [
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
