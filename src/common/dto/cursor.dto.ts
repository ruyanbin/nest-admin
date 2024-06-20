import {ApiProoerty} from '@nestjs/swagger';
import {Expose,Transform} from 'class-transformer';//映射普通的 js对象 指向您所拥有的 类的实例。
import {IsInt,IsOptional,Max,Min} from 'class-validator';