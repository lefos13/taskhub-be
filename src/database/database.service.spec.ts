import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockDataSource: jest.Mocked<Partial<DataSource>>;

  beforeEach(async () => {
    mockDataSource = {
      isInitialized: true,
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      options: {
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        type: 'postgres',
      },
    } as unknown as jest.Mocked<Partial<DataSource>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isConnected', () => {
    it('should return true when database is connected', () => {
      Object.defineProperty(mockDataSource, 'isInitialized', {
        value: true,
        writable: true,
        configurable: true,
      });
      const result = service.isConnected();
      expect(result).toBe(true);
    });

    it('should return false when database is not connected', () => {
      Object.defineProperty(mockDataSource, 'isInitialized', {
        value: false,
        writable: true,
        configurable: true,
      });
      const result = service.isConnected();
      expect(result).toBe(false);
    });

    it('should handle errors gracefully', () => {
      Object.defineProperty(mockDataSource, 'isInitialized', {
        get: jest.fn(() => {
          throw new Error('Connection error');
        }),
        configurable: true,
      });
      const result = service.isConnected();
      expect(result).toBe(false);
    });
  });

  describe('testConnection', () => {
    it('should return true when query succeeds', async () => {
      const result = await service.testConnection();
      expect(result).toBe(true);
      expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1');
    });

    it('should return false when query fails', async () => {
      mockDataSource.query = jest
        .fn()
        .mockRejectedValue(new Error('Query failed'));
      const result = await service.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('getConnectionInfo', () => {
    it('should return connection information', () => {
      const info = service.getConnectionInfo();
      expect(info).toEqual({
        isConnected: true,
        database: 'testdb',
        host: 'localhost',
        port: 5432,
        driver: 'postgres',
      });
    });
  });
});
