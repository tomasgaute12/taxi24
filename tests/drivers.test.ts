import { DriversService } from '../src/services/drivers.service';
import { DriversRepository } from '../src/repositories/drivers.repository';
import { UsersRepository } from '../src/repositories/users.repository';
import { UserDAO } from '../src/data-access/user.dao';
import { DriverDAO } from '../src/data-access/drivers.dao';
import { DriverMock, DriverMock2 } from './mocks/driversMock';
import { getConnection } from '../src/entities/connectionManager';
import { UserMock } from './mocks/usesMock';

describe('DriversService', () => {
    let driversService: DriversService;
    let driversRepository: DriversRepository;
    let usersRepository: UsersRepository;
  
    beforeAll(async () => {
      await getConnection();
    });

    beforeEach(() => {
      driversRepository = new DriverDAO()
      usersRepository = new UserDAO();
      driversService = new DriversService(driversRepository, usersRepository);
    });
    
    afterAll(async () => {
      (await getConnection()).destroy
    });
  
  
    describe('create', () => {
      it('should create a new driver', async () => {
        const userId = '1';
        const driver = DriverMock;

        jest.spyOn(usersRepository, 'findById').mockResolvedValue(UserMock);
        jest.spyOn(driversRepository, 'findByUserId').mockResolvedValue(undefined);
        jest.spyOn(driversRepository, 'create').mockResolvedValue(driver);

        const createdDriver = await driversService.create(userId, driver);
  
        expect(createdDriver).toBeDefined();  
        expect(usersRepository.findById).toHaveBeenCalledWith(userId);
        expect(driversRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(driversRepository.create).toHaveBeenCalledWith(driver);
      });
  
      it('should throw an error if user is not found', async () => {
        const userId = 'non-existent-user-id';
        const driver = DriverMock;
  
        jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined);
  
        await expect(driversService.create(userId, driver)).rejects.toThrow('User not found');
  
        expect(usersRepository.findById).toHaveBeenCalledWith(userId);
      });
  
      it('should throw an error if user is already registered as a driver', async () => {
        const userId = '1';
        const existingDriver = DriverMock;
        driversRepository.create(existingDriver); 
  
        const driver = DriverMock2;
  
        jest.spyOn(usersRepository, 'findById').mockResolvedValue(UserMock);
        jest.spyOn(driversRepository, 'findByUserId').mockResolvedValue(existingDriver);
  
        await expect(driversService.create(userId, driver)).rejects.toThrow(
          'The user is already registered as a driver'
        );
  
        expect(usersRepository.findById).toHaveBeenCalledWith(userId);
        expect(driversRepository.findByUserId).toHaveBeenCalledWith(userId);
      });
    });
  
  
  });