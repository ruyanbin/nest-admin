import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
const providers = [UserService];
@Module({
  imports: [],
  controllers: [UserController],
  providers: [...providers],
  exports: [...providers],
})
export class UserModule { }
