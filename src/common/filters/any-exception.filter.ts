import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {FastifyRequest,FastifyReply} from "fastify"
import { QueryFailedError } from 'typeorm'

import { BusinessException } from '../exceptions/biz.exception'
interface myError {
  readonly status: number
  readonly statusCode?: number

  readonly message?: string
}
  export interface IBaseResponse<T = any> {
    message: string
    code: number
    data?: T
  }
export class AllExceptionsFilter implements ExceptionFilter{
	constructor(){
		this.registerCatchAllExceptionsHook()
	}
	catch(exception:unknown,host:ArgumentsHost){
		const ctx = host.switchToHttp()
		const request = ctx.getRequest<FastifyRequest>()
		const response = ctx.getResponse<FastifyReply>()
		
		const url = request.raw.url!
		const status = this.getStatus(exception)
		 let message = this.getErrorMessage(exception)
		 const apiErrorCode = exception instanceof BusinessException ? exception.getErrorCode() : status
		 
		     // 返回基础响应结果
		     const resBody: IBaseResponse = {
		       code: apiErrorCode,
		       message,
		       data: null,
		     }
		 
		     response.status(status).send(resBody)
	}
	
	  getStatus(exception: unknown): number {
	    if (exception instanceof HttpException) {
	      return exception.getStatus()
	    }
	    else if (exception instanceof QueryFailedError) {
	      // console.log('driverError', exception.driverError.code)
	      return HttpStatus.INTERNAL_SERVER_ERROR
	    }
	    else {
	      return (exception as myError)?.status
	        ?? (exception as myError)?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR
	    }
	  }
	    getErrorMessage(exception: unknown): string {
	      if (exception instanceof HttpException) {
	        return exception.message
	      }
	      else if (exception instanceof QueryFailedError) {
	        return exception.message
	      }
	  
	      else {
	        return (exception as any)?.response?.message ?? (exception as myError)?.message ?? `${exception}`
	      }
	    }
	registerCatchAllExceptionsHook(){
		process.on('unhandledRejection',(reason)=>{
			console.error('unhandledRejection',reason)
		})
		process.on('uncaughtException',(err)=>{
			console.error('uncaughtException',err)
		})
	}
	}
