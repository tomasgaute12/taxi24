import { Drivers } from '../models/drivers';
import { DriversRepository } from '../repositories/drivers.repository';
import { UsersRepository } from '../repositories/users.repository';
import { calculateDistanceInKm } from '../utils/calculateTrips';

export class DriversService {
  constructor(
    private repository: DriversRepository,
    private userRepository: UsersRepository
  ) {}

  async read(id: string): Promise<Drivers | undefined> {
    return this.repository.read(id);
  }

  async create(userId: string,driver: Drivers): Promise<Drivers | undefined> {
    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const existDriver = await this.findByUserId(user.id);
    if (existDriver) {
      throw new Error('The user is already registered as a driver');
    }
    
    driver.user = user;
    driver.isActive = true;
    const result = await this.repository.create(driver);
    return result;
  }

  async update(id: string, item: Drivers): Promise<boolean> {
    if (await this.repository.findById(id)) {
      return this.repository.update(id, item);
    }
    throw new Error('Driver not found');
  }

  async disableDriver(id: string): Promise<boolean> {
    let driver = await this.repository.findById(id)
    if (driver) {
      driver.isActive = false
      return this.repository.update(id, driver);
    }
    throw new Error('Driver not found');
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async getActiveDrivers(): Promise<Drivers[] | undefined> {
    const activeDrivers = await this.repository.getActiveDrivers();

    if(activeDrivers){
      const driverDetails = await Promise.all(
        activeDrivers.map(async (driver) => {
          const userId = (driver.user as any) as string;        
          const user = await this.userRepository.findById(userId);
          const { extras, ...driverWithoutExtras } = driver;
          return { ...driverWithoutExtras, user };
        })
      );

      return driverDetails as Drivers[];
    }
  }

  async search(query?: string): Promise<object[]> {
    const drivers = await this.repository.search(query);
    
    const driverDetails = await Promise.all(
      drivers.map(async (driver) => {
        const userId = (driver.user as any) as string;        
        const user = await this.userRepository.findById(userId);
        const { extras, ...driverWithoutExtras } = driver;
        return { ...driverWithoutExtras, user };
      })
    );
    return driverDetails;
  }

  async findById(id: string): Promise<Drivers | undefined> {
    const driver = await this.repository.findById(id);

    if (!driver) {
      return undefined;
    }

    const userId = (driver.user as any) as string;
    const user = await this.userRepository.findById(userId);
    
    if (user) {
      const driverWithUser: Drivers = { ...driver, user };
      return driverWithUser;
    }
    
    return driver;
  }

  async findByUserId(id: string): Promise<Drivers | undefined> {
    const driver = await this.repository.findByUserId(id);
  
    if (!driver) {
      return undefined;
    }
    return driver;
  }

  async nearbyDrivers(lat:number,long:number): Promise<Drivers [] | undefined> {
  
    const ubicacionPasajero = {
      lat,
      long
    };
    //Obtenemos los drivers activos 
    const activeDrivers  = await this.getActiveDrivers();
    if(!activeDrivers){
      return undefined;
    }    
    const nearbyDrivers = activeDrivers.filter(driver => {
      const distancia = calculateDistanceInKm(
        ubicacionPasajero.lat,
        ubicacionPasajero.long,
        driver.ubication.lat,
        driver.ubication.long
      );
  
      return distancia <= 3; // Filtrar los conductores dentro del radio de 3 km
    });
  
      // Ordenar los conductores cercanos por distancia de menor a mayor
    nearbyDrivers.sort((driverA, driverB) => {
      const distanciaA = calculateDistanceInKm(
        ubicacionPasajero.lat,
        ubicacionPasajero.long,
        driverA.ubication.lat,
        driverA.ubication.long
      );
      const distanciaB = calculateDistanceInKm(
        ubicacionPasajero.lat,
        ubicacionPasajero.long,
        driverB.ubication.lat,
        driverB.ubication.long
      );
  
      return distanciaA - distanciaB;
    });

  return nearbyDrivers;
}

}
