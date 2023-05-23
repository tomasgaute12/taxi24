import { TripsService } from '../src/services/trips.service';
import { TripsRepository } from '../src/repositories/trips.repository';
import { DriversRepository } from '../src/repositories/drivers.repository';
import { UsersRepository } from '../src/repositories/users.repository';
import { InvoicesRepository } from '../src/repositories/invoices.repository';
import { PassengersRepository } from '../src/repositories/passengers.repository';
import { DriversService } from '../src/services/drivers.service';
import { InvoicesService } from '../src/services/invoices.service';
import { TripsDAO } from '../src/data-access/trips.dao';
import { UserDAO } from '../src/data-access/user.dao';
import { PassengerDAO } from '../src/data-access/passenger.dao';
import { DriverDAO } from '../src/data-access/drivers.dao';
import { getConnection } from '../src/entities/connectionManager';
import { DriverMock } from './mocks/driversMock';
import { TripsMock } from './mocks/tripsMock';
import { PassengerMock } from './mocks/passengerMock';
import { InvoicesMock } from './mocks/invoiceMock';

describe('TripsService', () => {
    let tripsService: TripsService;
    let tripsRepository: TripsRepository;
    let passengersRepository: PassengersRepository;
    let driversRepository: DriversRepository;
    let driversService: DriversService;
    let invoicesService: InvoicesService;
    let usersRepository: UsersRepository;
    let invoicesRepository: InvoicesRepository;
    
    beforeAll(async () => {
        await getConnection();
    });

    beforeEach(() => {
      tripsRepository = new TripsDAO();
      passengersRepository = new PassengerDAO();
      driversRepository = new DriverDAO();
      usersRepository = new UserDAO();
      driversService = new DriversService(driversRepository,usersRepository);
      invoicesService = new InvoicesService(invoicesRepository);
      tripsService = new TripsService(tripsRepository, passengersRepository, driversService, invoicesService);
    });

    afterAll(async () => {
        (await getConnection()).destroy
    });
  
    describe('create', () => {
      it('should create a new trip', async () => {
        const passengerId = 'passenger-id';
        const trip = TripsMock;
        const passenger = PassengerMock;
        const nearbyDrivers = [DriverMock]; // Supongamos que tenemos un conductor cercano
  
        jest.spyOn(passengersRepository, 'findById').mockResolvedValue(passenger);
        jest.spyOn(driversService, 'nearbyDrivers').mockResolvedValue(nearbyDrivers);
        jest.spyOn(tripsRepository, 'create').mockResolvedValue(trip);
        jest.spyOn(driversService, 'disableDriver').mockResolvedValue(true);
  
        const createdTrip = await tripsService.create(passengerId, trip);

        expect(createdTrip).toBeDefined();
        expect(passengersRepository.findById).toHaveBeenCalledWith(passengerId);
        expect(driversService.nearbyDrivers).toHaveBeenCalledWith(passenger.ubication.lat, passenger.ubication.long);
        expect(tripsRepository.create).toHaveBeenCalledWith(trip);
        expect(driversService.disableDriver).toHaveBeenCalledWith(trip.driver.id);
      });
  
      it('should throw an error if passenger is not found', async () => {
        const passengerId = 'non-existent-passenger-id';
        const trip = TripsMock;
  
        jest.spyOn(passengersRepository, 'findById').mockResolvedValue(undefined);
  
        await expect(tripsService.create(passengerId, trip)).rejects.toThrow('Passenger not found');
  
        expect(passengersRepository.findById).toHaveBeenCalledWith(passengerId);
      });
  
      it('should throw an error if there are no nearby drivers', async () => {
        const passengerId = '1';
        const trip = TripsMock;
        const passenger = PassengerMock;
  
        jest.spyOn(passengersRepository, 'findById').mockResolvedValue(passenger);
        jest.spyOn(driversService, 'nearbyDrivers').mockResolvedValue(undefined);
  
        await expect(tripsService.create(passengerId, trip)).rejects.toThrow('No hay conductores cercanos en tu zona');
  
        expect(passengersRepository.findById).toHaveBeenCalledWith(passengerId);
        expect(driversService.nearbyDrivers).toHaveBeenCalledWith(passenger.ubication.lat, passenger.ubication.long);
      });
    });
  
    it('should complete a trip', async () => {
      const tripId = '1';
      const trip = TripsMock;
  
      jest.spyOn(tripsRepository, 'findById').mockResolvedValue(trip);
      jest.spyOn(tripsRepository, 'update').mockResolvedValue(true);
      jest.spyOn(driversService, 'activeDriver').mockResolvedValue(true);
      jest.spyOn(invoicesService, 'create').mockResolvedValue(InvoicesMock);
  
      const result = await tripsService.completeTrip(tripId);
      const driverId = (trip.driver as any) as string;

      expect(result).toEqual(InvoicesMock);
      expect(tripsRepository.findById).toHaveBeenCalledWith(tripId);
      expect(tripsRepository.update).toHaveBeenCalledWith(tripId, trip);
      expect(driversService.activeDriver).toHaveBeenCalledWith(driverId);
      expect(invoicesService.create).toHaveBeenCalledWith(expect.objectContaining({
        passenger: trip.passenger,
        amount: trip.price,
        trip: trip,
      }));
    });
});