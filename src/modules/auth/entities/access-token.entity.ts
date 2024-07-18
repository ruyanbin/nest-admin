import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshTokenEntity } from '~/modules/auth/entities/refresh-token.entity';
import { UserEntity } from '~/modules/sys/user/user.entity';

@Entity('user_access_token')
export class AccessTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ length: 500 })
  value!: string;
  @Column({ comment: '令牌过期时间' })
  expired_at!: Date;

  @CreateDateColumn({ comment: '令牌创建时间' })
  created_at!: Date;

  @OneToOne(
    () => RefreshTokenEntity,
    (refreshToken) => refreshToken.accessToken,
    {
      cascade: true,
    },
  )
  refreshToken!: RefreshTokenEntity;

  @ManyToOne(() => UserEntity, (user) => user.accessTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
