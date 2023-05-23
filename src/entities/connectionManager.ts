import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { logger } from '../logger';
import { UsersEntity } from './users.entity';
import { PassengersEntity } from './passenger.entity';
import { DriversEntity } from './drivers.entity';
import { TripsEntity } from './trips.entity';
import { InvoicesEntity } from './invoices.entity';

dotenv.config();

const PostgresDataSource = new DataSource({
  type: 'postgres',
  synchronize: true,
  logging: true,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    UsersEntity,
    PassengersEntity,
    DriversEntity,
    TripsEntity,
    InvoicesEntity
  ],
});

export async function getConnection(): Promise<DataSource> {
  const { isInitialized } = PostgresDataSource;
  if (!isInitialized) {
    return PostgresDataSource.initialize()
      .then((connection) => {
        logger().info('Connected to Postgres');
        return connection;
      })
      .catch((err) => {
        logger().error(err);
        return err;
      });
  }
  return PostgresDataSource;
}
