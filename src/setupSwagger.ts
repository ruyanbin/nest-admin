import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonEntity } from './common/entity/common.entity';
import { ResOp, TreeResult } from './common/model/response.model';
import { Pagination } from './helper/paginate/pagination';
import { env, envBoolean, envString } from '~/global/env';
export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  const NAME = envString('NAME');
  const PATH = envString('PATH');
  const ENABLE = envBoolean('ENABLE');

  if (!ENABLE) return;
  const documentBuilder = new DocumentBuilder()
    .setTitle(NAME)
    .setDescription(`${NAME} API document`)
    .setVersion('1.0');
  // 安全认证

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
