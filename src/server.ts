import express, { NextFunction, Request, Response } from 'express';
import * as http from 'http';
import { getConnection } from './entities/connectionManager';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { BaseError } from './utils/error';
import { logger } from './logger';
import usersRouter from './routes/users.route';
import passengersRouter from './routes/passengers.route';
import driversRouter from './routes/drivers.route';
import tripsRouter from './routes/trips.route';
import { UserDAO } from './data-access/user.dao';
import { PassengerDAO } from './data-access/passenger.dao';
import { DriverDAO } from './data-access/drivers.dao';
import { TripsDAO } from './data-access/trips.dao';
import { UsersRepository } from './repositories/users.repository';
import { PassengersRepository } from './repositories/passengers.repository';
import { DriversRepository } from './repositories/drivers.repository';
import { TripsRepository } from './repositories/trips.repository';
import { UsersService } from './services/users.service';
import { PassengersService } from './services/passengers.service';
import { DriversService } from './services/drivers.service';
import { TripsService } from './services/trips.service';


export default async function Server() {
  const connection = await getConnection();
  // Repositories/DAOs
  const usersRepo: UsersRepository = new UserDAO();
  const passengersRepo: PassengersRepository = new PassengerDAO();
  const driversRepo: DriversRepository = new DriverDAO();
  const tripsRepo: TripsRepository = new TripsDAO();
  
  //Services
  const usersService: UsersService = new UsersService(usersRepo);
  const passengersService: PassengersService = new PassengersService(passengersRepo,usersRepo);
  const driversService: DriversService = new DriversService(driversRepo,usersRepo)
  const tripsService: TripsService = new TripsService(tripsRepo,passengersRepo,driversService);
  
  const port = process.env.PORT || 5050;
  const app = express()
    .use(express.json())
    .use(morgan('dev'))
    .use((_, res: Response, next: NextFunction) => {
      res
        .header('Access-Control-Allow-Origin', '*')
        .header(
          'Access-Control-Allow-Methods',
          'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        )
        .header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
        )
      next();
    })
    .use('/user', usersRouter(usersService))
    .use('/passenger', passengersRouter(passengersService))
    .use('/driver', driversRouter(driversService))
    .use('/trip', tripsRouter(tripsService))
    .get('/', (_, res: Response) => {
      res.send('Hello World!');
    })
    .get('/health', async (_, res: Response) => {
      const isDbConnected = connection.isInitialized;
      const health = {
        timestamp: new Date(),
        status: isDbConnected ? 'healthy' : 'warning',
        db: isDbConnected ? 'connected' : 'disconnected',
      };

      res.status(StatusCodes.OK).json(health);
    })
    .use(
      (error: BaseError, _req: Request, res: Response) => {
        res.status(error.code).send({ message: error.message });
      }
    );
  const server: http.Server = http.createServer(app);
  server
    .listen(port)
    .on('listening', () => {
      logger().info(`Listening on port ${port}`);
    })
    .on('error', (err) => {
      logger().error(err);
    });

  return server;
}
