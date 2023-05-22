import { Trips, TripsState } from '../models/trips';
import { PassengersRepository } from '../repositories/passengers.repository';
import { TripsRepository } from '../repositories/trips.repository';
import { calculateEstimatedArrivalTime } from '../utils/calculateTrips';
import { DriversService } from './drivers.service';

export class TripsService {
  constructor(
    private repository: TripsRepository,
    private passengersRepository: PassengersRepository,
    private driversService : DriversService
  ) {}

  async read(id: string): Promise<Trips | undefined> {
    return this.repository.read(id);
  }

  async create( passengerId: string,trip: Trips): Promise<Trips | undefined> {
    
    const passenger = await this.passengersRepository.findById(passengerId);
    if (!passenger) {
      throw new Error('Passenger not found');
    }
    
    const nearbyDrivers = await this.driversService.nearbyDrivers(passenger.ubication.lat,passenger.ubication.long)
    
    if(!nearbyDrivers){
      throw new Error('No hay conductores cercanos en tu zona');
    }

    trip.driver = nearbyDrivers[0]; //elegimos el más cercano
    trip.passenger = passenger;
    trip.startTime = new Date().getTime();
    trip.state = TripsState.INITIATED;
    //Definimos el punto de partida. En este caso la ubicacion del pasajero (previamente predefinida para este caso)
    trip.startLocation = passenger.ubication
    
    //Calculamos la hora estimada para brindarsela al usuario
    // const estimatedTime = calculateEstimatedArrivalTime(trip.startLocation, trip.endLocation);
    
    const result = await this.repository.create(trip);
    return result;
  }

  async update(id: string, item: Trips): Promise<boolean> {
    if (await this.repository.findById(id)) {
      return this.repository.update(id, item);
    }
    throw new Error('Passenger not found');
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async search(query?: string): Promise<Trips[]> {
    return (await this.repository.search(query)).map((Trips) => {
      return Trips;
    });
  }

  async findById(id: string): Promise<Trips | undefined> {
    return this.repository.findById(id);
  }
  

}
