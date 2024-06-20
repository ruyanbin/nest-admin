import { HttpStatus, Type } from '@nestjs/common';
/**
 *生成返回结果装饰器
 */
export function ApiResult<TModel extends Type<any>>({ type, isPage, status }:{
	type?:TModel|TModel[],isPage?:boolean,status?:HttpStatus
}) {}
