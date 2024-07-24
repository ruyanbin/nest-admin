import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '~/modules/sys/roles/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  exports: [TypeOrmModule, RolesService],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
