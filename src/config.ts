export const CONFIG = {
  port: process.env.PORT || '3000',

  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: process.env.DB_NAME || 'lw-test',
  dbUser: process.env.DB_USER || 'root',
  dbPass: process.env.DB_PASS || 'pwd123',

  production: process.env.NODE_ENV === 'production',

  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisHost: process.env.REDIS_HOST || 'localhost',

};