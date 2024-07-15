
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ISecurityConfig, securityConfig } from '~/config';
import { privateDecrypt } from 'crypto';
import { AccessTokenEntity } from '../entities/access-token.entity';
import dayjs from 'dayjs';
import { UserEntity } from '~/modules/sys/user/user.entity';
import { generateUUID } from '~/utils';
import { RefreshTokenEntity } from '~/modules/auth/entities/refresh-token.entity';
import { genOnlineUserVKey } from '~/helper/getRedisKey';



/**
 * 令牌服务
*/
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private redis: Redis,
    @Inject(securityConfig.KEY) private securityConfig:ISecurityConfig
  ) {}
  /**
   *根据accessToken 刷新
*/

  async refreshToken(accessToken:AccessTokenEntity){
	  const {user,refreshToken} = accessToken
	  if(refreshToken){
		  const now = dayjs()
		  // 判断是否过期
		  if(now.isAfter(refreshToken.expired_at)){
			  return null
		  }

		  // 没有过期生成新的token
		  // const token = await this.gener
	  }
  }
	generateJwtSign(payload:any){
		const jwtSign = this.jwtService.sign(payload);
		return jwtSign;
	}
// 生成新的token
	async generateAccessToken(uid:number,roles:string[]=[]){
		const payload:IAuthUser = {uid,pv:1,roles:roles}
		const jwtSign = this.jwtService.signAsync(payload);
		 // 生成accessToken
		let accessToken = new AccessTokenEntity();
		accessToken.value = await jwtSign
		accessToken.user = {id:uid} as UserEntity
		accessToken.expired_at = dayjs()
			.add(this.securityConfig.jwtExprire,'second')
			.toDate()
		await accessToken.save()
		// 生成refreshToken
		const refreshToken = await this.generateRefreshToken(accessToken,dayjs())
		return {
			accessToken:jwtSign,
			refreshToken:refreshToken,
		}
	}
	/**
	 * 生成新的refreshToken 并存入数据库
	 * **/
	async generateRefreshToken(accessToken: AccessTokenEntity, now: dayjs.Dayjs):Promise<string>{
	const refreshTokenPayload = {
		uuid:generateUUID()
	}
	const refreshTokenSign = await this.jwtService.signAsync(refreshTokenPayload,{
		secret:this.securityConfig.refreshSecret
	});
	const refreshToken = new RefreshTokenEntity()
		refreshToken.value = refreshTokenSign
		refreshToken.expired_at = now .add(this.securityConfig.refreshExpire,'second').toDate()
		refreshToken.accessToken = accessToken
		await refreshToken.save()
		return refreshTokenSign
	}
	/**
	 * 检查accessToken 是否存在 并且处于有效期
	 * @param value
	 * */
	async checkAccessToken(value:string){
		let isValid = false
		try{
		await this.verifyAccessToken(value)
			const res  = await AccessTokenEntity.findOne({
				where:{value },
				relations:['user',"refreshToken"],
				cache:true,
			})
			isValid = Boolean(res)

		} catch(err){}
		return isValid
	}
	/**
	 * 验证Token是否正确,如果正确则返回所属用户对象
	 * @param token
	 */
	async verifyAccessToken (token:string):Promise<IAuthUser>{
		return this.jwtService.verifyAsync(token)
	}
  /*
   * 移除accessToken 且自动移除关联的refreshToken
   * @param value
   */
	async removeAccessToken(value:string){
		const accessToken = await AccessTokenEntity.findOne({
			where:{value}
		})
		if(accessToken){
			this.redis.del(genOnlineUserVKey(accessToken.id))
			await accessToken.remove()
		}
	}
	/**
	 * 移除RefreshToken
	 * @param valuss
	 */
	async removeRefreshToken(value: string) {
		const refreshToken = await RefreshTokenEntity.findOne({
			where: { value },
			relations: ['accessToken'],
		})
		if (refreshToken) {
			if (refreshToken.accessToken)
				this.redis.del(genOnlineUserVKey(refreshToken.accessToken.id))
			await refreshToken.accessToken.remove()
			await refreshToken.remove()
		}
	}
}

