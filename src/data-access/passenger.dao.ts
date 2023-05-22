import { DataSource } from 'typeorm';

import { getConnection } from '../entities/connectionManager';
import { PassengersRepository } from '../repositories/passengers.repository';
import { Passengers } from '../models/passengers';
import { PassengersEntity } from '../entities/passenger.entity';


export class PassengerDAO implements PassengersRepository {
  private connection: DataSource;

  constructor() {
    getConnection().then((connection) => { this.connection = connection; });
  }

  async findById(id: string): Promise<Passengers | undefined> {
    const result = await this.connection
      .getRepository(PassengersEntity)
      .createQueryBuilder('passenger')
      .where('passenger.id = :id', { id })
      .loadAllRelationIds()
      .getOne();

    return result ? result as Passengers : undefined;
  }

  async create(item: Passengers): Promise<Passengers | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .insert()
      .into(PassengersEntity)
      .values(item)
      .returning('*')
      .execute();

    return result.generatedMaps.length > 0 ? (result.generatedMaps[0] as Passengers) : undefined;
  }

  async read(id: string): Promise<Passengers | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('passenger')
      .from(PassengersEntity, 'passenger')
      .where('passenger.id = :id', { id })
      .getOne();

    return result ? result as Passengers : undefined;
  }

  async update(id: string, item: Passengers): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .update(PassengersEntity)
      .set(item)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .delete()
      .from(PassengersEntity)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  //TODO: MODIFICAR QUERY
  async search(query?: string): Promise<Passengers[]> {
    let sql = `SELECT * 
                FROM passengers`;
    if (query) {
      sql += `WHERE name ILIKE '%${query}%' 
              OR lastname ILIKE '%${query}%' 
              OR email ILIKE '%${query}%'`;
    }
    const result = await this.connection.manager.query(sql);

    return result ? result as Passengers[] : [];
  }

}
