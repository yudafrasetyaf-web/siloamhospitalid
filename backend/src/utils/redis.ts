// NOTE: Install with: npm install ioredis @types/ioredis
// This import will fail until ioredis is installed
let Redis: any;
try {
  Redis = require('ioredis');
} catch {
  // Redis not installed - gracefully degrade
  Redis = null;
}

import logger from './logger';

/**
 * Redis Client Configuration
 * For caching and session management
 */

let redisClient: any = null;

export const connectRedis = (): any => {
  // Only connect if Redis module is installed and configuration is provided
  if (!Redis) {
    logger.warn('ioredis module not installed. Caching disabled. Install with: npm install ioredis');
    return null;
  }
  
  if (!process.env.REDIS_HOST) {
    logger.warn('Redis configuration not found. Caching disabled.');
    return null;
  }

  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis connected successfully');
    });

    redisClient.on('error', (error: Error) => {
      logger.error('❌ Redis connection error:', error);
    });

    redisClient.on('close', () => {
      logger.warn('⚠️  Redis connection closed');
    });

    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    return null;
  }
};

export const getRedisClient = (): any => {
  return redisClient;
};

/**
 * Cache wrapper functions
 */

export const cacheGet = async (key: string): Promise<string | null> => {
  if (!redisClient) return null;
  
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error(`Redis GET error for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: string,
  expirySeconds?: number
): Promise<boolean> => {
  if (!redisClient) return false;
  
  try {
    if (expirySeconds) {
      await redisClient.setex(key, expirySeconds, value);
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (error) {
    logger.error(`Redis SET error for key ${key}:`, error);
    return false;
  }
};

export const cacheDel = async (key: string): Promise<boolean> => {
  if (!redisClient) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Redis DEL error for key ${key}:`, error);
    return false;
  }
};

export const cacheExists = async (key: string): Promise<boolean> => {
  if (!redisClient) return false;
  
  try {
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error(`Redis EXISTS error for key ${key}:`, error);
    return false;
  }
};

/**
 * Cache with automatic JSON serialization
 */

export const cacheGetJSON = async <T>(key: string): Promise<T | null> => {
  const data = await cacheGet(key);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`JSON parse error for key ${key}:`, error);
    return null;
  }
};

export const cacheSetJSON = async <T>(
  key: string,
  value: T,
  expirySeconds?: number
): Promise<boolean> => {
  try {
    const serialized = JSON.stringify(value);
    return await cacheSet(key, serialized, expirySeconds);
  } catch (error) {
    logger.error(`JSON stringify error for key ${key}:`, error);
    return false;
  }
};

/**
 * Cache middleware for Express routes
 */

export const cacheMiddleware = (durationSeconds: number = 300) => {
  return async (req: any, res: any, next: any) => {
    if (!redisClient) return next();
    
    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cachedResponse = await cacheGet(key);
      
      if (cachedResponse) {
        logger.debug(`Cache HIT for ${key}`);
        return res.json(JSON.parse(cachedResponse));
      }
      
      logger.debug(`Cache MISS for ${key}`);
      
      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        cacheSet(key, JSON.stringify(body), durationSeconds);
        return originalJson(body);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Graceful shutdown
 */

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis disconnected');
  }
};

export default {
  connectRedis,
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheExists,
  cacheGetJSON,
  cacheSetJSON,
  cacheMiddleware,
  disconnectRedis,
};
