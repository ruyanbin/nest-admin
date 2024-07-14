import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ISecurityConfig, securityConfig } from '~/config';
import { privateDecrypt } from 'crypto';
import { AccessTokenEntity } from '../entities/access-token.entity';
import dayjs from 'dayjs';
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
}
