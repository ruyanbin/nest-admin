import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { QueryFailedError } from 'typeorm';

import { BusinessException } from '../exceptions/biz.exception';
interface myError {
  readonly status: number;
  readonly statusCode?: number;

  readonly message?: string;
}
export interface IBaseResponse<T = any> {
  msg: string;
  code: number;
  data?: T;
}
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {
    this.registerCatchAllExceptionsHook();
  }
  /**
   * 捕获异常并处理。
   * @param exception 未知的异常对象，可能是任何类型。
   * @param host 用于获取HTTP上下文的ArgumentsHost对象。
   * 此函数旨在处理业务逻辑中抛出的异常，将异常信息转换为统一的响应格式返回给客户端。
   * 它首先从ArgumentsHost中切换到HTTP上下文，然后获取响应对象。
   * 根据异常类型的不同，确定响应的HTTP状态码和错误信息。
   * 最后，将处理后的响应对象发送给客户端。
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // 切换到HTTP上下文并获取响应对象
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    // 获取异常状态码
    const status = this.getStatus(exception);
    console.log(exception, 'exception');
    // 获取异常的错误信息
    const message = this.getErrorMessage(exception);
    // 根据异常类型决定返回的API错误码
    const apiErrorCode =
      exception instanceof BusinessException
        ? exception.getErrorCode()
        : status;

    // 构建统一的响应格式
    // 返回基础响应结果
    const resBody: IBaseResponse = {
      code: apiErrorCode,
      msg: message,
      data: null,
    };
    // 设置响应状态码并发送响应体
    response.status(status).send(resBody);
  }

  getStatus(exception) {
    let error = new ErrorHandler();
    return error.getStatus(exception);
  }
  getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message;
    } else if (exception instanceof QueryFailedError) {
      return exception.message;
    } else {
      console.log(3);
      return (
        (exception as any)?.response?.message ??
        (exception as myError)?.message ??
        `${exception}`
      );
    }
  }
  registerCatchAllExceptionsHook() {
    process.on('unhandledRejection', (reason) => {
      console.error('unhandledRejection', reason);
    });
    process.on('uncaughtException', (err) => {
      console.error('uncaughtException', err);
    });
  }
}
enum HttpStatusCode {
  INTERNAL_SERVER_ERROR = 500,
}

class ErrorHandler {
  private static readonly DEFAULT_STATUS_CODE =
    HttpStatusCode.INTERNAL_SERVER_ERROR;

  // 使用类型守卫来检查是否是myError类型
  private static isMyError(exception: unknown): exception is myError {
    if (typeof exception === 'object' && exception !== null) {
      return 'status' in exception || 'statusCode' in exception;
    }
    return false;
  }

  getStatus(exception: unknown): number {
    // 处理HttpException
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    // 处理QueryFailedError
    else if (exception instanceof QueryFailedError) {
      // 可以在这里增加日志记录等处理
      return HttpStatusCode.INTERNAL_SERVER_ERROR;
    }
    // 处理其他异常
    else {
      if (ErrorHandler.isMyError(exception)) {
        // 优先使用status，如果不存在再使用statusCode
        return (
          exception.status ??
          exception.statusCode ??
          ErrorHandler.DEFAULT_STATUS_CODE
        );
      } else {
        // 对于未知异常类型，可以在这里增加日志记录等处理
        return ErrorHandler.DEFAULT_STATUS_CODE;
      }
    }
  }
}
