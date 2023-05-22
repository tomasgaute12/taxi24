import { Users } from '../models/users';
import { ICRUD } from './interfaces/ICRUD';
import { ISearch } from './interfaces/ISearch';

export interface UsersRepository extends ICRUD<Users>, ISearch<Users> {
  findByEmail(email: string): Promise<Users | undefined>;
  findById(id: string): Promise<Users | undefined>;
  findByRole(role: string): Promise<Users | undefined>;
  findByPhone(phone: string): Promise<Users | undefined>;
  
}
