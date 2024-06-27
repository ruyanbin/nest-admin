import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import {TypeOrmModule} from "@nestjs/typeorm";
// @Module()装饰器中定义的基本模块元数据
@Module({})
//动态模块
export class LoggerModule {
  static forRoot(config: TypeOrmModule) {
    return {
      global:true, //
      providers: [LoggerService],
      exports: [LoggerService],
    }
  }
}
