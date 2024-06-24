import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

export function typeormconfig() {
    // console.log(process.env, 'process --env')
    return TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            // console.log(configService.get('mysql'))
            const mysql= configService.get('mysql');
            // console.log(db,'db')
            // console.log(mysql,'sql')
            return {
                type: 'mysql', // 数据库类型
                entities: [], // 数据表实体
                host: mysql.host, // 主机，默认为localhost
                port:mysql.port, // 端口号
                username:mysql.username, // 用户名
                password: mysql.password, // 密码
                database: mysql.database, //数据库名
                timezone: '+08:00', //服务器上配置的时区
                autoLoadEntities: mysql.autoLoadEntities,
                synchronize: mysql.synchronize, //根据实体自动创建数据库表， 生产环境建议关闭
            };
        }
    })
}