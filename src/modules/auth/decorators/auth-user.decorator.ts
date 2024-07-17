import { FastifyRequest } from 'fastify';

type Payload = keyof IAuthUser;
/*
 * @description 获取当前登录用户信息，并挂载到request 上
 * */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: Payload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const user = request.user as IAuthUser;
    return data ? user?.[data] : user;
  },
);
