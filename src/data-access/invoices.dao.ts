import { DataSource } from 'typeorm';

import { getConnection } from '../entities/connectionManager';
import { Invoices } from '../models/invoices';
import { InvoicesEntity } from '../entities/invoices.entity';
import { InvoicesRepository } from '../repositories/invoices.repository';

export class InvoicesDAO implements InvoicesRepository {
  private connection: DataSource;

  constructor() {
    getConnection().then((connection) => { this.connection = connection; });
  }

  async findById(id: string): Promise<Invoices | undefined> {
    const result = await this.connection
      .getRepository(InvoicesEntity)
      .createQueryBuilder('invoice')
      .where('invoice.id = :id', { id })
      .loadAllRelationIds()
      .getOne();

    return result ? result as Invoices : undefined;
  }

  async create(item: Invoices): Promise<Invoices | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .insert()
      .into(InvoicesEntity)
      .values(item)
      .returning('*')
      .execute();

    return result.generatedMaps.length > 0 ? (result.generatedMaps[0] as Invoices) : undefined;
  }

  async read(id: string): Promise<Invoices | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('invoice')
      .from(InvoicesEntity, 'invoice')
      .where('invoice.id = :id', { id })
      .getOne();

    return result ? result as Invoices : undefined;
  }

  async update(id: string, item: Invoices): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .update(InvoicesEntity)
      .set(item)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .delete()
      .from(InvoicesEntity)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  //TODO: MODIFICAR QUERY
  async search(query?: string): Promise<Invoices[]> {
    let sql = `SELECT * 
                FROM invoices`;
    if (query) {
      sql += `WHERE name ILIKE '%${query}%' 
              OR lastname ILIKE '%${query}%' 
              OR email ILIKE '%${query}%'`;
    }
    const result = await this.connection.manager.query(sql);

    return result ? result as Invoices[] : [];
  }

}
