import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import type { Redis } from 'ioredis';
import { API_CACHE_PREFIX } from '~/constants/cache.constant'; // 缓存管理器

// 获取器
export type TCacheKey = string;
export type TCacheResult<T> = Promise<T | undefined>;
@Injectable()
export class CacheService {
  private cache!: Cache;
  private ioRedis!: Redis;
  constructor(@Inject(CACHE_MANAGER) cache: Cache) {
    this.cache = cache;
  }
  private get redisClient(): Redis {
    // @ts-expect-error
    return this.cache.store.client;
  }

  public get<T>(key: TCacheKey): TCacheResult<T> {
    return this.cache.get(key);
  }
  /**
   * 添加或更改缓存
   * key 属性
   * value 内容
   * milliseconds 有效时间
   * */
  public set(key: TCacheKey, value: any, milliseconds: number) {
    return this.cache.set(key, value, milliseconds);
  }

  public getClient() {
    return this.redisClient;
  }

  public async cleanCatch() {
    const redis = this.getClient();
    const keys: string[] = await redis.keys(`${API_CACHE_PREFIX}*`);
    await Promise.all(keys.map((key) => redis.del(key)));
  }

  public async cleanAllRedisKey() {
    const redis = this.getClient();
    const keys: string[] = await redis.keys('*');
    await Promise.all(keys.map((key) => redis.del(key)));
  }
}
