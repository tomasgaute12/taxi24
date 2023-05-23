import { Trips } from '../models/trips';
import { ICRUD } from './interfaces/ICRUD';
import { ISearch } from './interfaces/ISearch';

export interface TripsRepository extends ICRUD<Trips>, ISearch<Trips> {
  findById(id: string): Promise<Trips | undefined>;
  getActiveTrips(): Promise<Trips[] | undefined>;
}
