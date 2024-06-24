import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
const providers = [UserService]
@Module({
  imports: [],
  controllers: [UserController],
  providers: [...providers],
  exports: [...providers],
})
export class UserModule { }
