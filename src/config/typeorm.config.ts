import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

export function typeormconfig() {
    console.log(process.env, 'process --env')
    return TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            // console.log(configService);
            return {
                type: 'mysql', // 数据库类型
                entities: [], // 数据表实体
                host: configService.get('DB_HOST'), // 主机，默认为localhost
                port: configService.get<number>('DB_PORT'), // 端口号
                username: configService.get('DB_USER'), // 用户名
                password: configService.get('DB_PASSWORD'), // 密码
                database: configService.get('DB_DATABASE'), //数据库名
                timezone: '+08:00', //服务器上配置的时区
                autoLoadEntities: true,
                synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
            };
        }
    })
}