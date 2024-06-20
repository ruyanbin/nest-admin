import { BaseEntity,
 PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
  } from 'typeorm';
export abstract class CommonEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@CreateDateColumn ({ name: 'created-at' })
	createdAt: Date;
	@UpdateDateColumn({ name: 'updated-at' })
	updatedAt: Date;
}
