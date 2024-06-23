import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_SECURITY_AUTH } from './common/decorators/swagger.decorators';
import { CommonEntity } from './common/entity/common.entity';
import { ResOp, TreeResult } from './common/model/response.model';
import { Pagination } from './helper/paginate/pagination';
export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  const { NAME } = configService.get('app');
  const { ENABLE, PATH } = configService.get('swagger');

  if (!ENABLE) return;
  console.log(1);
  const documentBuilder = new DocumentBuilder()
    .setTitle(NAME)
    .setDescription(`${NAME} API document`)
    .setVersion('1.0');
  // 安全认证
  // documentBuilder.addSecurity(API_SECURITY_AUTH, {
  // 	description: '输入令牌',
  // 	type: 'http',
  // 	scheme: 'bearer',
  // 	bearerFormat: 'JWT',
  // });
  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
    extraModels: [CommonEntity, ResOp, Pagination, TreeResult],
  });
  SwaggerModule.setup(PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录
    },
  });
}
