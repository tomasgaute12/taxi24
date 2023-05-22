import { Passengers } from '../models/passengers';
import { UserRole, Users } from '../models/users';
import { PassengersRepository } from '../repositories/passengers.repository';
import { UsersRepository } from '../repositories/users.repository';
import bcrypt from 'bcrypt';

export class UsersService {
  constructor(
    private repository: UsersRepository,
  ) {}

  async read(id: string): Promise<Users | undefined> {
    return this.repository.read(id);
  }

  async create(user: Users): Promise<Users | undefined> {
    if (await this.repository.findByEmail(user.email)) {
      throw new Error(
        'Email already in use',
      );
    }
    if (await this.repository.findByPhone(user.email)) {
      throw new Error(
        'Phone already in use',
      );
    }
    user.password = bcrypt.hashSync(user.password!, 10);
    user.email = user.email.toLowerCase();
    const result = await this.repository.create(user);
    if (result) {
      delete result.password;
    }
    return result;
  }

  async update(id: string, item: Users): Promise<boolean> {
    if (await this.repository.findById(id)) {
      return this.repository.update(id, item);
    }
    throw new Error('Users not found');
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async findByRole(role: string): Promise<boolean> {
    return this.repository.delete(role.toUpperCase());
  }

  async search(query?: string): Promise<Users[]> {
    return (await this.repository.search(query)).map((Users) => {
      delete Users.password;
      return Users;
    });
  }

  async findById(id: string): Promise<Users | undefined> {
    return this.repository.findById(id);
  }
  

}
