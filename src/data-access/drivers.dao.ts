import { DataSource } from 'typeorm';

import { getConnection } from '../entities/connectionManager';
import { DriversRepository } from '../repositories/drivers.repository';
import { Drivers } from '../models/drivers';
import { DriversEntity } from '../entities/drivers.entity';


export class DriverDAO implements DriversRepository {
  private connection: DataSource;

  constructor() {
    getConnection().then((connection) => { this.connection = connection; });
  }

  async findById(id: string): Promise<Drivers | undefined> {
    const result = await this.connection
      .getRepository(DriversEntity)
      .createQueryBuilder('driver')
      .where('driver.id = :id', { id })
      .loadAllRelationIds()
      .getOne();

    return result ? result as Drivers : undefined;
  }

  async findByUserId(id: string): Promise<Drivers | undefined> {

    const result = await this.connection
      .getRepository(DriversEntity)
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.user', 'user')
      .where('user.id = :id', { id })
      .loadAllRelationIds()
      .getOne();
    
    return result ? result as Drivers : undefined;
  }

  async create(item: Drivers): Promise<Drivers | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .insert()
      .into(DriversEntity)
      .values(item)
      .returning('*')
      .execute();

    return result.generatedMaps.length > 0 ? (result.generatedMaps[0] as Drivers) : undefined;
  }

  async read(id: string): Promise<Drivers | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('driver')
      .from(DriversEntity, 'driver')
      .where('driver.id = :id', { id })
      .getOne();

    return result ? result as Drivers : undefined;
  }

  async update(id: string, item: Drivers): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .update(DriversEntity)
      .set(item)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .delete()
      .from(DriversEntity)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  async getActiveDrivers(): Promise<Drivers[] | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('driver')
      .from(DriversEntity, 'driver')
      .where('driver.isActive = :isActive', { isActive: true })
      .loadAllRelationIds()
      .getMany();

    return result ? result as Drivers[] : undefined;
  }
  //TODO: MODIFICAR QUERY
  async search(query?: string): Promise<Drivers[]> {
    let sql = `SELECT * 
                FROM drivers`;
    if (query) {
      sql += `WHERE isActive ILIKE '%${query}%'`;
    }
    const result = await this.connection.manager.query(sql);

    return result ? result as Drivers[] : [];
  }

}
