
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ISecurityConfig, securityConfig } from '~/config';
import { privateDecrypt } from 'crypto';
import { AccessTokenEntity } from '../entities/access-token.entity';
import dayjs from 'dayjs';
import { UserEntity } from '~/modules/sys/user/user.entity';
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

	async generateRefreshToken(accessToken: AccessTokenEntity, now: dayjs.Dayjs){}
}
