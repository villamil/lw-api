import * as cluster from 'cluster';
import { cpus } from 'os';

import { Server } from './server';
import { CONFIG } from './config';

const logger = require('./util/logger')(module);

//Run NodeJs in clustered mode for production
if(CONFIG.production && cluster.isMaster) {
  for (let i=0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.debug(`Worker ${worker.process.pid}  died, code: ${code}, signal: ${signal}`);
    cluster.fork();
  });
} else {
  new Server().start().then(server => {
    if(!server){
      process.exit(1);
    } else{
      server.listen(CONFIG.port);

      server.on('error', (error: any) => {
        if (error.syscall !== 'listen') {
          throw error;
        }

        switch (error.code) {
          case 'EACCES':
            logger.error('Permission denied for port (requires elevated privileges), exiting...');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            logger.error('Port is already in use, exiting...');
            process.exit(1);
            break;
          default:
            throw error;
        }
      });

      server.on('listening', () => {
        logger.info(`Server listening on port ${CONFIG.port}, pid: ${process.pid}`);
      });
    }
  });
}