
import { Invoices } from '../models/invoices';
import { InvoicesRepository } from '../repositories/invoices.repository';

export class InvoicesService {
  constructor(
    private repository: InvoicesRepository,
  ) {}

  async read(id: string): Promise<Invoices | undefined> {
    return await  this.repository.read(id);
  }

  async create(invoice: Invoices): Promise<Invoices | undefined> {
    const result = await this.repository.create(invoice);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    return await  this.repository.delete(id);
  }

  async search(query?: string): Promise<Invoices[]> {
    return (await this.repository.search(query)).map((Invoices) => {
      return Invoices;
    });
  }

  async findById(id: string): Promise<Invoices | undefined> {
    return await  this.repository.findById(id);
  }

}
