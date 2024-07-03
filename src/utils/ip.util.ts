import { FastifyRequest } from 'fastify';
import type { IncomingMessage } from 'node:http';
/**
 * 获取ip
 * */
export function getIp(request: FastifyRequest | IncomingMessage) {
  const req = request as any;
  let ip: string =
    req.headers['x-forwarded-for'] ||
    req.headers['X-Forwarded-For'] ||
    req.headers['X-Real-IP'] ||
    req.headers['x-Real-ip'] ||
    req?.ip ||
    req?.raw?.connection?.remoteAddress ||
    req?.raw?.socket?.remoteAddress;
  if (ip && ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip;
}
