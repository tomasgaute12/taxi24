import { Drivers } from '../models/drivers';
import { ICRUD } from './interfaces/ICRUD';
import { ISearch } from './interfaces/ISearch';

export interface DriversRepository extends ICRUD<Drivers>, ISearch<Drivers> {
  findById(id: string): Promise<Drivers | undefined>;
  findByUserId(id: string): Promise<Drivers | undefined>;
  getActiveDrivers(): Promise<Drivers[] | undefined>;

}
