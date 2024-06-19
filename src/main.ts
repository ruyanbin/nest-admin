import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  // 使用fastify驱动
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      // 启用跨域访问
      cors: true,
      // 只使用error和warn这两种输出，避免在控制台冗余输出
      logger: ['error', 'warn'],
      bufferLogs: true,
      snapshot: true,
      // forceCloseConnections: true,
    },
  );
  const configService = app.get(ConfigService);
  const { PORT, PREFIX } = configService.get('app', { infer: true });

  app.enableCors({ origin: '*', credentials: true });
  app.setGlobalPrefix(PREFIX);
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
