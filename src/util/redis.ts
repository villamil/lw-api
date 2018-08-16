import * as redis from 'redis';
import { promisify } from 'util';
import { CONFIG } from '../config';
const logger = require('./logger')(module);

export class RedisClient {
  static client: redis.RedisClient;

  static async init(): Promise<void> {
    const options = {
      retry_strategy: (status: any): any => {
        if (status.error && status.error.code === 'ECONNREFUSED') {
          logger.error('Redis refused the connection', status.error);
          process.exit(1);
          return new Error('Redis refused the connection');
        }
        if (status.total_retry_time > 1000 * 60 * 60) {
          return new Error('Redis retry time exhausted');
        }
        if (status.attempt > 3) {
          return undefined;
        }
        // Reconnect after
        return Math.min(status.attempt * 500, 3000);
      },
      port: CONFIG.redisPort,
      host: CONFIG.redisHost
    };

    RedisClient.client = redis.createClient(options);

    RedisClient.client.on('error', error => {
      logger.error('Redis failed', error);
    });

    try{
      await RedisClient.get("testTheConnection");
      logger.debug('Connected to Redis...');
    } catch(error){
      logger.error('Failed to connect to Redis');
    }
  }

  static async get(key: string): Promise<string> {
    let value;
    try {
      const asyncGet = promisify(this.client.get).bind(this.client);
      value = await asyncGet(key);
    } catch(error){
      logger.error('Failed to perform Redis GET', error);
      throw error;
    }
    return value;
  }

  static async set(key: string, value: string): Promise<string> {
    return RedisClient.setEx(key, value, -1);
  }

  static async setEx(key: string, value: string, exp: number): Promise<string> {
    let res;
    try {
      const asyncSet = promisify(this.client.set).bind(this.client);
      if(exp > 0){
        res = await asyncSet(key, value, 'EX', exp);
      } else {
        res = await asyncSet(key, value);
      }
    } catch(error){
      logger.error('Failed to perform Redis SET', error);
      throw error;
    }
    return res;
  }
}