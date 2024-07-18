/**
 * 统一处理接口请求和响应
 * */

import {
  CallHandler,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { parse } from 'qs';
import { FastifyRequest } from 'fastify';
import { map } from 'rxjs/operators';
import { ResOp } from '~/common/model/response.model';
export const BYPASS_KEY = '__bypass_key__';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const bypass = this.reflector.get<boolean>(
      BYPASS_KEY,
      context.getHandler(),
    );
    if (bypass) {
      return next.handle();
    }
    const http = context.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const queryUrl = request.url.split('?').at(1);
    request.query = parse(queryUrl);
    return next.handle().pipe(
      map((data) => {
        return new ResOp(HttpStatus.OK, data ?? null);
      }),
    );
  }
}
