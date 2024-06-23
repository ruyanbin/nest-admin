import {Entity}from 'typeorm';
import {CommonEntity} from '../../../common/entity/common.entity';
@Entity({name:'sys_user'})
export class UserEntity extends CommonEntity {
	@Column({unique:true}
	username:string
}