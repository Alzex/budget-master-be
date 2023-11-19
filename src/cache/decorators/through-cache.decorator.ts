import * as md5 from 'md5';

// Method decorator that caches the result of the method in the cache service for the specified ttl.
// CacheService must be injected in the class constructor where decorator is used.
// The key is generated from the method name and the arguments passed to it (md5 hash of the stringified arguments)
export function ThroughCache(ttl?: number): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const key = `${propertyKey}:${md5(JSON.stringify(args)).slice(0, 8)}`;

      if (!this.cacheService) {
        throw new Error(
          'CacheService not found in context. It must be injected in the class constructor where decorator is used.',
        );
      }

      const value = await this.cacheService.get(key);

      if (value) {
        return value;
      }

      const result = await originalMethod.apply(this, args);
      await this.cacheService.set(key, result, ttl);
      return result;
    };
  };
}
