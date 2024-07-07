import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet'
@Module({
  imports: [
    CacheModule.registerAsync(({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisOptions: RedisOptions = configService.get('redis')

        return {
          isGlobal: true,
          store: redisStore,
          isCacheableValue: () => true,
          ...redisOptions,
        }
      },
    }))
  ],
  providers: [CacheService],
})
export class RedisModule {}
