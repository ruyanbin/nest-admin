import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer'
import { BaseEntity,
 PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column
  } from 'typeorm';
export abstract class CommonEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@CreateDateColumn ({ name: 'created-at' })
	createdAt: Date;
	@UpdateDateColumn({ name: 'updated-at' })
	updatedAt: Date;
}


export abstract class CompleteEntity extends CommonEntity {
	@ApiHideProperty()
	@Exclude()
	@Column({ name:'create_by',update:false,comment:'创建者',nullable:true})
	createBy:number
	
	@ApiHideProperty()
	@Exclude()
	@Column({ name:'update_by',comment:'更新者',nullable:true})
	updateBy:number
}