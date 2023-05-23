import { DataSource } from 'typeorm';

import { getConnection } from '../entities/connectionManager';
import { TripsRepository } from '../repositories/trips.repository';
import { Trips, TripsState } from '../models/trips';
import { TripsEntity } from '../entities/trips.entity';

export class TripsDAO implements TripsRepository {
  private connection: DataSource;

  constructor() {
    getConnection().then((connection) => { this.connection = connection; });
  }

  async findById(id: string): Promise<Trips | undefined> {
    const result = await this.connection
      .getRepository(TripsEntity)
      .createQueryBuilder('trip')
      .where('trip.id = :id', { id })
      .loadAllRelationIds()
      .getOne();

    return result ? result as Trips : undefined;
  }

  async getActiveTrips(): Promise<Trips[] | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('trip')
      .from(TripsEntity, 'trip')
      .where('trip.state = :state', { state: TripsState.INITIATED })
      .loadAllRelationIds()
      .getMany();

    return result ? result as Trips[] : undefined;
  }
  async create(item: Trips): Promise<Trips | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .insert()
      .into(TripsEntity)
      .values(item)
      .returning('*')
      .execute();

    return result.generatedMaps.length > 0 ? (result.generatedMaps[0] as Trips) : undefined;
  }

  async read(id: string): Promise<Trips | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('trip')
      .from(TripsEntity, 'trip')
      .where('trip.id = :id', { id })
      .getOne();

    return result ? result as Trips : undefined;
  }

  async update(id: string, item: Trips): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .update(TripsEntity)
      .set(item)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .delete()
      .from(TripsEntity)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  //TODO: MODIFICAR QUERY
  async search(query?: string): Promise<Trips[]> {
    let sql = `SELECT * 
                FROM trips`;
    if (query) {
      sql += `WHERE name ILIKE '%${query}%' 
              OR lastname ILIKE '%${query}%' 
              OR email ILIKE '%${query}%'`;
    }
    const result = await this.connection.manager.query(sql);

    return result ? result as Trips[] : [];
  }

}
