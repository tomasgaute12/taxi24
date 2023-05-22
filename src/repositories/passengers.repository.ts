import { Passengers } from '../models/passengers';
import { ICRUD } from './interfaces/ICRUD';
import { ISearch } from './interfaces/ISearch';

export interface PassengersRepository extends ICRUD<Passengers>, ISearch<Passengers> {
  findById(id: string): Promise<Passengers | undefined>;
}
