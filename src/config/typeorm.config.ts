import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env, envBoolean, envNumber, envString } from '~/global/env';

export function typeormconfig() {
  // console.log(process.env, 'process --env')
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: () => ({
      type: 'mysql', // 数据库类型
      entities: [], // 数据表实体
      host: envString('host'), // 主机，默认为localhost
      port: envNumber('port'), // 端口号
      username: envString('username'), // 用户名
      password: envString('password'), // 密码
      database: envString('database'), //数据库名
      timezone: '+08:00', //服务器上配置的时区
      autoLoadEntities: envBoolean('autoLoadEntities'),
      synchronize: envBoolean('synchronize'), //根据实体自动创建数据库表， 生产环境建议关闭
    }),
  });
}
