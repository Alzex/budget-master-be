import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS } from './cache.injections';

@Injectable()
export class CacheService {
  private readonly logger: Logger = new Logger(CacheService.name);
  constructor(
    @Inject(REDIS)
    private readonly redisClient: Redis,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.redisClient.get(key);
      return JSON.parse(result) as T;
    } catch (error) {
      this.logger.error(`REDIS GET FAILED: ${error.message}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
        return;
      }
      await this.redisClient.set(key, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`REDIS SET FAILED: ${error.message}`);
    }
  }

  async wrap<T>(
    key: string,
    fn: Promise<T> | (() => T) | (() => Promise<T>),
    ttl: number,
  ): Promise<T> {
    const value = await this.get<T>(key);
    if (value) {
      return value;
    }
    const result = await (typeof fn === 'function' ? fn() : fn);
    await this.set(key, result, ttl);
    return result;
  }
}
