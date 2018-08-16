import 'reflect-metadata';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as passportJwt from 'passport-jwt';
import * as passportLocal from 'passport-local';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

import { CONFIG } from './config';
import { connectDb } from './util/db';
// import { routes } from './routes/routes';
// import { UserService } from './services/user.service';
// import { AuthenticationService } from './services/authentication.service';
// import { RedisClient } from './util/redis';

const logger = require('./util/logger')(module);

export class Server {
  private readonly app: express.Application;
  private readonly server: http.Server | https.Server | undefined;

  constructor() {
    this.app = express();
    this.server = this.createServer();
  }

  private createServer(): http.Server | https.Server | undefined {
    if(CONFIG.production) {
      if(process.env.KEY_CERT) {
        try {
          const [key, cert, ca] = process.env.KEY_CERT.split('::').map((part) =>
            fs.readFileSync(part, 'utf8'),
          );
          return https.createServer({key, cert, ca}, this.app);
        } catch(error) {
          logger.error('Cannot load cert files!', error);
          return undefined;
        }
      } else {
        logger.error('Certificate environment variable not set!');
        return undefined;
      }
    } else {  
      return http.createServer(this.app); 
    }
  }

  private initExpressApp(): void {
    this.app.use(helmet());
    this.app.use(cors({
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    this.app.use(express.urlencoded({extended: false}));
    this.app.use(express.json());

    // this.initPassport();

    if(!CONFIG.production) {
      this.app.use(morgan('tiny'));

      this.app.get('/', (req, res) => {
        res.send('Api up and running!');
      });
    }
  }

  // private initPassport(): void {
  //   const LocalStrategy = passportLocal.Strategy;
  //   const JwtStrategy = passportJwt.Strategy;
  //   const ExtractJwt = passportJwt.ExtractJwt;

  //   passport.serializeUser<any, any>((user, done) => {
  //     done(undefined, user.id);
  //   });

  //   passport.deserializeUser(async (id: string, done) => {
  //     try {
  //       const user = await UserService.findById(id);
  //       done(undefined, user);        
  //     } catch(error){
  //       done(error);    
  //     }
  //   });

  //   //Login with email and password
  //   passport.use(new LocalStrategy({ usernameField: 'email', session: false }, async (email: string, password: string, done: any) => {
  //     try {
  //       const user = await AuthenticationService.authenticate(email, password);
  //       if(!user) {
  //         return done(undefined, false, { message: 'Invalid email or password.' });
  //       } else {
  //         return done(undefined, user);
  //       }        
  //     } catch(error) {
  //       return done(error);
  //     }
  //   }));

  //   //Jwt token handling
  //   const publicKey  = fs.readFileSync(`${__dirname}${CONFIG.jwtPublicKey}`, 'utf8');
  //   const jwtOptions: passportJwt.StrategyOptions = {
  //     algorithms: [CONFIG.jwtAlgorithm],
  //     audience: CONFIG.jwtAudience,
  //     issuer: CONFIG.jwtIssuer,
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  //     secretOrKey: publicKey
  //   };

  //   passport.use(new JwtStrategy(jwtOptions, async (jwtPayload: any, done: any) => {     
  //     try {
  //       const user = await UserService.findById(jwtPayload.userId);
  //       if (user) {
  //         done(null, user);
  //       } else {
  //         done(null, false);
  //       }
  //     } catch(error) {
  //       done(error, false);
  //     }
  //   }));

  //   this.app.use(passport.initialize());
  // }

   async start(): Promise<http.Server | https.Server | undefined> {
    try {
      await connectDb();
      logger.debug('Connected to DB...');

      // await RedisClient.init();

      this.initExpressApp();
      logger.debug('App initialized...');

      // for (const route of routes) {
      //   this.app.use(route.path, route.middleware, route.handler);
      // }
      // logger.debug('Loaded routes...');

      return this.server;
    } catch(error) {
      logger.error('Failed to start server...', error);
      return undefined;
    }
  }
}