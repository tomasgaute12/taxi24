import { Invoices } from '../models/invoices';
import { ShowTrip, Trips, TripsState } from '../models/trips';
import { PassengersRepository } from '../repositories/passengers.repository';
import { TripsRepository } from '../repositories/trips.repository';
import { calculatePrice, calculateTimeArrival } from '../utils/calculateTrips';
import { DriversService } from './drivers.service';
import { InvoicesService } from './invoices.service';
export class TripsService {
  constructor(
    private repository: TripsRepository,
    private passengersRepository: PassengersRepository,
    private driversService : DriversService,
    private invoiceService : InvoicesService
  ) {}

  async read(id: string): Promise<Trips | undefined> {
    return await this.repository.read(id);
  }

  async create( passengerId: string,trip: Trips): Promise<ShowTrip | undefined> {
    
    const passenger = await this.passengersRepository.findById(passengerId);
    if (!passenger) {
      throw new Error('Passenger not found');
    }
    
    const nearbyDrivers = await this.driversService.nearbyDrivers(passenger.ubication.lat,passenger.ubication.long);

    if(nearbyDrivers === undefined || nearbyDrivers.length === 0){
      throw new Error('No hay conductores cercanos en tu zona');
    }
    
    const driver  =  nearbyDrivers[0]; //elegimos el más cercano
    trip.driver = driver 
    trip.passenger = passenger;
    trip.startTime = new Date().getTime();
    trip.state = TripsState.INITIATED;
    // Definimos el punto de partida. En este caso la ubicacion del pasajero (previamente definida para este caso)
    trip.startLocation = passenger.ubication
    
    // Calculamos hora estimada de llegada
    const estimatedTime = calculateTimeArrival(trip.startLocation,trip.endLocation);

    // Calculamos costo de viaje para la facturación
    trip.price = calculatePrice(trip.startLocation,trip.endLocation);

    const createTrip = await this.repository.create(trip);

    if(!createTrip){
      throw new Error('Error al crear el viaje');
    }
    // Cambiamos el estado del driver a inactivo 
    await this.driversService.disableDriver(trip.driver.id);
    
    const result: ShowTrip = {
      id : createTrip.id,
      estimatedTime: estimatedTime,
      price: createTrip.price,
      driver: driver,
      passenger: passenger
    }
    return result;
  }

  async completeTrip(id: string): Promise<Invoices | undefined> {
    let trip = await this.repository.findById(id)
    if (trip) {
      trip.state = TripsState.FINISHED;
      trip.endTime = new Date().getTime();
      await this.repository.update(id, trip);
      
      //cambiamos el estado de driver a activo
      const driverId = (trip.driver as any) as string;
      await this.driversService.activeDriver(driverId);

      // Creamos la factura
      const invoice: Partial<Invoices> ={
        passenger: trip.passenger,
        amount: trip.price,
        trip: trip
      }
      const result = await this.invoiceService.create(invoice as Invoices);
      
      return result;
    }
    throw new Error('Trip not found');
  }

  async getActiveTrips(): Promise<ShowTrip[] | undefined> {
    const activeTrips = await this.repository.getActiveTrips();

    if(activeTrips){
      const tripsDetails = await Promise.all(
        activeTrips.map(async (trip) => {
          const driverId = (trip.driver as any) as string;        
          const driver = await this.driversService.findById(driverId);
          const passengerId = (trip.passenger as any) as string;        
          const passenger = await this.passengersRepository.findById(passengerId)
          const { extras, ...tripWithoutExtras } = trip;
          const result: ShowTrip = {
            id: tripWithoutExtras.id,
            price: tripWithoutExtras.price,
            driver: driver,
            passenger: passenger
          };
  
          return result;
        })
      );
  
      return tripsDetails as ShowTrip[];
    }
  
  }
  

  async delete(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async search(query?: string): Promise<Trips[]> {
    return (await this.repository.search(query)).map((Trips) => {
      return Trips;
    });
  }

  async findById(id: string): Promise<Trips | undefined> {
    return await this.repository.findById(id);
  }
  

}
