import { Invoices } from '../models/invoices';
import { ICRUD } from './interfaces/ICRUD';
import { ISearch } from './interfaces/ISearch';

export interface InvoicesRepository extends ICRUD<Invoices>, ISearch<Invoices> {
  findById(id: string): Promise<Invoices | undefined>;
}
