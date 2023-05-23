import { UsersService } from '../src/services/users.service';
import { UsersRepository } from '../src/repositories/users.repository';
import { UserDAO } from '../src/data-access/user.dao';
import { UserMock, UserMock2 } from './mocks/usesMock';
import { getConnection } from '../src/entities/connectionManager';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    await getConnection();
  });

  beforeEach(() => {
    usersRepository = new UserDAO();
    usersService = new UsersService(usersRepository);
  });

  afterAll(async () => {
    (await getConnection()).destroy
  });

  describe('create', () => {
    it('should create a new user', async () => {
      await jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(undefined);
      await jest.spyOn(usersRepository, 'findByPhone').mockResolvedValue(undefined);
      await jest.spyOn(usersRepository, 'create').mockResolvedValue(UserMock);

      const userData = UserMock;

      const result = await usersService.create(userData);

      expect(result).toEqual(UserMock);
      await expect(usersRepository.findByEmail).toHaveBeenCalledWith(UserMock.email);
      await expect(usersRepository.findByPhone).toHaveBeenCalledWith(UserMock.email);
      await expect(usersRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw an error if email is already in use', async () => {
      jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(UserMock2);
      const userData = UserMock2;
      await expect(usersService.create(userData)).rejects.toThrowError('Email already in use');
    });

  });

});