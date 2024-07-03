import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { getIp } from '~/utils/ip.util';
/**
 * 快速获取ip
 * */
export const Ip = createParamDecorator((_, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest<FastifyRequest>();
  return getIp(req);
});
/**
 * 获取 path
 * */
export const Uri = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<FastifyRequest>();
  return request.routerPath;
});
