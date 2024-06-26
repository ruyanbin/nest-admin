import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setupSwagger';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyApp } from './common/adapters/fastify.adapters';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 使用fastify驱动
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      // 启用跨域访问
      // cors: true,
      // 只使用error和warn这两种输出，避免在控制台冗余输出
      logger: ['error', 'warn'],
      // bufferLogs: true,
      // snapshot: true,
      // forceCloseConnections: true,
    },
  );
  const configService = app.get(ConfigService);
  const { PORT, PREFIX } = configService.get('app', { infer: true });
  // 启动跨域访问 与app 中的cores 不能共存
  app.enableCors({ origin: '*', credentials: true });
  app.setGlobalPrefix(PREFIX);
  // class-validator 的 DTO 类中注入 nest 容器的依赖 (用于自定义验证器)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // pipe
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false, // 设置为true后，错误信息就不会在响应正文中显示
      whitelist: true, // 只会验证dto 中存在的属性 对不再里的属性不进行处理
      // forbidNonWhitelisted:true, // 存在非白名单属性时停止处理请求，并返回对应的错误信息
      transform: true, // 可以自动将有效载荷转换为根据其 DTO 类型化的对象
      stopAtFirstError: true, //当设置为true时，在遇到第一个错误后，将停止对给定属性的验证。默认为false。
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, //个设置允许你指定在出现错误时将使用哪种异常类型 错误code
    }),
  );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true, // 可以自动将有效载荷转换为根据其 DTO 类型化的对象
  //     whitelist: true, // 剥离属性 不在白名单中的属性都会自动从帝乡中剥离
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //     errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, //个设置允许你指定在出现错误时将使用哪种异常类型 错误code
  //     stopAtFirstError: true, //当设置为true时，在遇到第一个错误后，将停止对给定属性的验证。默认为false。
  //     exceptionFactory: (errors) => {
  //         console.log(errors,'pipe-errors')
  //       new UnprocessableEntityException(
  //         errors.map((e) => {
  //           const rule = Object.keys(e.constraints!)[0];
  //           const msg = e.constraints![rule];
  //           return msg;
  //         })[0],
  //       );
  //     },
  //   }),
  // );
  console.log(PORT);
  setupSwagger(app, configService);
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
