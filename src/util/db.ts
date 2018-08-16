import { createConnection, Connection } from 'typeorm';

import { CONFIG } from '../config';

const logger = require('./logger')(module);

export async function connectDb(): Promise<Connection | undefined>{
  let connection;
  try{
    connection = await createConnection({
      type: 'mysql',
      host: CONFIG.dbHost,
      port: CONFIG.dbPort,
      username: CONFIG.dbUser,
      password: CONFIG.dbPass,
      database: CONFIG.dbName,
      entities: [__dirname + '/../models/**{.ts,.js}'],
      
      synchronize: !CONFIG.production,
      logging: false
    });
  } catch(error){
    logger.error('Failed to initialize DB', error); 
    throw new Error('Failed to initialize DB');       
  }
  return connection;
} 