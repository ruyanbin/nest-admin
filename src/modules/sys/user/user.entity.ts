import { Column, Entity } from 'typeorm';
import { CommonEntity } from '~/common/entity/common.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'sys_user' })
export class User extends CommonEntity {
  @Column({ unique: true })
  username: string;
  @Exclude()
  @Column()
  password: string;
  @Column({ nullable: true })
  psalt: string;
  @Column({ name: 'avatar', nullable: true })
  nickname: string;
  @Column({ nullable: true })
  qq: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true })
  remrk: string;
  @Column({ type: 'int', nullable: true, default: 1 })
  status: number;
}
