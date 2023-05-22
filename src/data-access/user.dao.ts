import { DataSource } from 'typeorm';

import { getConnection } from '../entities/connectionManager';
import { UsersEntity } from '../entities/users.entity';
import { Users } from '../models/users';
import { UsersRepository } from '../repositories/users.repository';

export class UserDAO implements UsersRepository {
  private connection: DataSource;

  constructor() {
    getConnection().then((connection) => { this.connection = connection; });
  }

  async findByEmail(email: string): Promise<Users | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('user')
      .from(UsersEntity, 'user')
      .where('user.email = :email', { email })
      .loadAllRelationIds()
      .getOne();

    return result ? result as Users : undefined;
  }

  async findByPhone(phone: string): Promise<Users | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('user')
      .from(UsersEntity, 'user')
      .where('user.phone = :phone', { phone })
      .loadAllRelationIds()
      .getOne();

    return result ? result as Users : undefined;
  }

  async findByRole(role: string): Promise<Users | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('user')
      .from(UsersEntity, 'user')
      .where('user.role = :role', { role })
      .loadAllRelationIds()
      .getOne();

    return result ? result as Users : undefined;
  }

  async findById(id: string): Promise<Users | undefined> {
    const result = await this.connection
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .loadAllRelationIds()
      .getOne();

    return result ? result as Users : undefined;
  }

  async create(item: Users): Promise<Users | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .insert()
      .into(UsersEntity)
      .values(item)
      .returning('*')
      .execute();

    return result.generatedMaps.length > 0 ? (result.generatedMaps[0] as Users) : undefined;
  }

  async read(id: string): Promise<Users | undefined> {
    const result = await this.connection
      .createQueryBuilder()
      .select('user')
      .from(UsersEntity, 'user')
      .where('user.id = :id', { id })
      .getOne();

    return result ? result as Users : undefined;
  }

  async update(id: string, item: Users): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .update(UsersEntity)
      .set(item)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.connection
      .createQueryBuilder()
      .delete()
      .from(UsersEntity)
      .where('id = :id', { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  async search(query?: string): Promise<Users[]> {
    let sql = `SELECT * 
                FROM users`;
    if (query) {
      sql += `WHERE name ILIKE '%${query}%' 
              OR lastname ILIKE '%${query}%' 
              OR email ILIKE '%${query}%'`;
    }
    const result = await this.connection.manager.query(sql);

    return result ? result as Users[] : [];
  }

}
