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
      host: envString('DB_HOST', 'localhost'), // 主机，默认为localhost
      port: envNumber('DB_PORT', 3306), // 端口号
      username: envString('DB_USERNAME'), // 用户名
      password: envString('DB_PASSWORD'), // 密码
      database: envString('DB_DATABASE'), //数据库名
      timezone: '+08:00', //服务器上配置的时区
      autoLoadEntities: envBoolean('DB_AUTO_LOAD_ENTITIES', true), //是否自动加载实体文件
      synchronize: envBoolean('DB_SYNCHRONIZE'), //根据实体自动创建数据库表， 生产环境建议关闭
    }),
  });
}
