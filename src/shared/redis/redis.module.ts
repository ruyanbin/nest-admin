import { Global, Module, Provider } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { RedisPubSubService } from './subpub.service';
import { REDIS_PUBSUB } from '~/shared/redis/redis.constant';
import { RedisSubPub } from '~/shared/redis/redis-subpub';

const providers: Provider[] = [
  CacheService,
  {
    provide: REDIS_PUBSUB,
    useFactory: (config: ConfigService) => {
      const redisOptions: RedisOptions = config.get('redis');
      return new RedisSubPub(redisOptions);
    },
    inject: [ConfigService],
  },
  RedisPubSubService,
];

@Global()
@Module({
  imports: [
    // cache
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisOptions: RedisOptions = configService.get('redis');
        return {
          isGlobal: true,
          store: redisStore,
          isCacheableValue: () => true,
          ...redisOptions,
        };
      },
    }),
    // redis
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        readyLog: true,
        config: configService.get('redis'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: [...providers, CacheModule],
})
export class RedisModule {}
