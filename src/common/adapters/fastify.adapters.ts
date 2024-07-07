import FastifyCookie from '@fastify/cookie'; // 用于各种需要处理用户会话或临时状态的应用场景
import FastifyMultipart from '@fastify/multipart'; // 得开发者可以优雅地处理HTTP请求中的multipart/form-data类型的数据

import { FastifyAdapter } from '@nestjs/platform-fastify';

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  logger: false,
});
export { app as fastifyApp };

// app.register(FastifyMultipart,
//   {
//     limits: {
//       fields: 10, // 最大文件数
//       fileSize: 1024 * 1024 * 6, // limit size 6M
//       files: 5, // Max number of file field
//     },
//   });
// app.register( FastifyCookie, {
//   secret: 'cookie-secret', // 这个 secret 不太重要，不存鉴权相关，无关紧要
// });
//
app.getInstance().addHook('onRequest', (request, reply, done) => {
  // set undefined origin
  const { origin } = request.headers;
  if (!origin) request.headers.origin = request.headers.host;

  // forbidden php

  const { url } = request;

  if (url.endsWith('.php')) {
    reply.raw.statusMessage =
      'Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.';

    return reply.code(418).send();
  }

  // skip favicon request
  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/))
    return reply.code(204).send();

  done();
});
