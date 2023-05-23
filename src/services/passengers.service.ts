import { Passengers } from '../models/passengers';
import { PassengersRepository } from '../repositories/passengers.repository';
import { UsersRepository } from '../repositories/users.repository';

export class PassengersService {
  constructor(
    private repository: PassengersRepository,
    private userRepository: UsersRepository
  ) {}

  async read(id: string): Promise<Passengers | undefined> {
    return await  this.repository.read(id);
  }

  async create(userId: string,passenger: Passengers): Promise<Passengers | undefined> {
    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    passenger.user = user;
    const result = await this.repository.create(passenger);
    return result;
  }

  async update(id: string, item: Passengers): Promise<boolean> {
    if (await this.repository.findById(id)) {
      return await this.repository.update(id, item);
    }
    throw new Error('Passenger not found');
  }

  async delete(id: string): Promise<boolean> {
    return await  this.repository.delete(id);
  }

  async search(query?: string): Promise<object[]> {
    const passengers = await this.repository.search(query);
    
    const passengerDetails = await Promise.all(
      passengers.map(async (passenger) => {
        const userId = (passenger.user as any) as string;        
        const user = await this.userRepository.findById(userId);
        const { extras, ...passengerWithoutExtras } = passenger;
        return { ...passengerWithoutExtras, user };
      })
    );
    return passengerDetails;
  }

  async findById(id: string): Promise<Passengers | undefined> {
    const passenger = await this.repository.findById(id);
    console.log("Im here: ", id);
    
    if (!passenger) {
      return undefined;
    }

    const userId = (passenger.user as any) as string;
    const user = await this.userRepository.findById(userId);
    
    if (user) {
      const passengerWithUser: Passengers = { ...passenger, user };
      return passengerWithUser;
    }
    
    return passenger;
  }

}
