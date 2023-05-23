import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { logger } from '../logger';
import {UserRoleEntity} from './user-role.entity'
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
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Areloco',
  database: 'taxi24db',
  entities: [
    UserRoleEntity,
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
