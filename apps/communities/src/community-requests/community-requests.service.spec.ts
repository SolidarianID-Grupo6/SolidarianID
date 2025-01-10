import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommunityRequestsService } from './community-requests.service';
import { CommunityService } from '../community/community.service';
import { CommunityRequests } from './schemas/community-requests.schema';
import { CommunityRequestStatus } from './entities/CommunityRequest-status.enum';
import { CreateCommunityRequestsDto } from './dto/create-community-request.dto';

import { validate } from 'class-validator';
import { CreateCauseDto } from '../cause/dto/create-cause.dto';
import { plainToInstance } from 'class-transformer';

const mockRequestModel = {
  findOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
  create: jest.fn().mockReturnValue({ exec: jest.fn() }),
  find: jest.fn().mockReturnValue({ exec: jest.fn() }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
  findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
  exec: jest.fn().mockReturnValue({ exec: jest.fn() }),
};

const mockCommunityService = {
  create: jest.fn(),
};

const mockClientProxy = {
  emit: jest.fn(),
};

describe('CommunityRequestsService', () => {
  let service: CommunityRequestsService;
  let requestModel: typeof mockRequestModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityRequestsService,
        {
          provide: getModelToken(CommunityRequests.name),
          useValue: mockRequestModel,
        },
        {
          provide: 'NATS_SERVICE',
          useValue: mockClientProxy,
        },
        {
          provide: CommunityService,
          useValue: mockCommunityService,
        },
      ],
    }).compile();

    service = module.get<CommunityRequestsService>(CommunityRequestsService);
    requestModel = module.get(getModelToken(CommunityRequests.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRequest', () => {
    it('should throw BadRequestException if a pending or approved request with the same name exists', async () => {
      requestModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          name: 'Test Community',
          status: CommunityRequestStatus.Pending,
        }),
      });

      await expect(
        service.createRequest({
          name: 'Test Community',
          description: 'Description',
          creator: 1,
          causes: [
            {
              title: 'Cause Title',
              description: 'Cause Description',
              endDate: '2025-12-31',
              ods: ['Hambre cero'],
              actions: [],
              events: [],
              category: 'Education',
              keywords: ['keyword1', 'keyword2'],
              location: 'Some Location',
              community: 'CommunityID',
            },
          ],
        }),
      ).rejects.toThrow(new BadRequestException('A request with the community name Test Community already exists'));
    });

    it('should throw BadRequestException if a request with the same name and Pending or Approved status exists', async () => {
      requestModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'New Community',
          status: CommunityRequestStatus.Pending,
        }),
      }));
    
      const cause: CreateCauseDto = {
        title: 'Cause Title',
        description: 'Cause Description',
        endDate: '2025-12-31',
        ods: ['Hambre cero'],
        actions: [],
        events: [],
        category: 'Education',
        keywords: ['keyword1', 'keyword2'],
        location: 'Some Location',
        community: 'CommunityID',
      };
    
      const result: CreateCommunityRequestsDto = {
        name: 'New Community',
        description: 'Description',
        creator: 1,
        causes: [cause],
      };
    
      await expect(service.createRequest(result)).rejects.toThrow(
        new BadRequestException('A request with the community name New Community already exists'),
      );
    
      // Verifica que se haya llamado a `findOne` con los argumentos correctos
      expect(requestModel.findOne).toHaveBeenCalledWith({
        name: 'New Community',
        status: { $in: [CommunityRequestStatus.Pending, CommunityRequestStatus.Approved] },
      });
    });
    

    it('should create a new request if no conflicting request exists', async () => {
      requestModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));
      requestModel.create.mockResolvedValue({ _id: '12345' });

      const cause: CreateCauseDto = {
        title: 'Cause Title',
        description: 'Cause Description',
        endDate: '2025-12-31',
        ods: ['Hambre cero'],
        actions: [],
        events: [],
        category: 'Education',
        keywords: ['keyword1', 'keyword2'],
        location: 'Some Location',
        community: 'CommunityID',
      };

      const result = await service.createRequest({
        name: 'New Community',
        description: 'Description',
        creator: 1,
        causes: [cause],
      });

      expect(result).toBe('12345');
      expect(requestModel.create).toHaveBeenCalledWith({
        name: 'New Community',
        description: 'Description',
        creator: 1,
        causes: [cause],
      });
    });

    it('should validate CreateCommunityRequestsDto with valid data', async () => {
      const cause: CreateCauseDto = {
        title: 'Cause Title',
        description: 'Cause Description',
        endDate: '2025-12-31',
        ods: ['Hambre cero'],
        actions: [],
        events: [],
        category: 'Education',
        keywords: ['keyword1', 'keyword2'],
        location: 'Some Location',
        community: 'CommunityID',
      };

      const dto: CreateCommunityRequestsDto = {
        name: 'Valid Community',
        description: 'A valid description',
        creator: 1,
        causes: [cause],
      };

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate CreateCommunityRequestsDto with invalid data', async () => {
      const invalidDto: Partial<CreateCommunityRequestsDto> = {
        name: '',
        description: '',
        creator: null,
        causes: [],
      };
      const dtoInstance = plainToInstance(CreateCommunityRequestsDto, invalidDto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('findAllPending', () => {
    it('should return all pending requests', async () => {
      requestModel.find.mockReturnThis();
      requestModel.exec.mockResolvedValue([
        { _id: '1', name: 'Test 1', status: CommunityRequestStatus.Pending },
        { _id: '2', name: 'Test 2', status: CommunityRequestStatus.Pending },
      ]);

      const result = await service.findAllPending();

      expect(result.every(r => r.status === CommunityRequestStatus.Pending)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if request is not found', async () => {
      requestModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(new NotFoundException('Community with ID nonexistent-id not found'));
    });

    it('should return the request if found', async () => {
      const request = {
        _id: '1',
        name: 'Test Community',
        description: 'Some description',
        creator: 'creator-id',
        status: CommunityRequestStatus.Pending,
        causes: ['Cause1'],
        requestDate: '2025-01-09',
      };

      requestModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(request),
      }));

      const result = await service.findOne('1');
      expect(result.name).toEqual('Test Community');
    });
  });

  describe('approveRequest', () => {
    it('should throw NotFoundException if request does not exist', async () => {
      requestModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.approveRequest('invalid-id')).rejects.toThrow(new NotFoundException('Solicitud no encontrada'));
    });

    it('should call communityService.create and update request status to Approved', async () => {
      requestModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'Approved Community',
          description: 'Description',
          creator: 1,
          causes: ['Cause1'],
          status: CommunityRequestStatus.Pending,
        }),
      }));

      requestModel.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'Approved Community',
          description: 'Description',
          creator: 1,
          causes: ['Cause1'],
          status: CommunityRequestStatus.Approved,
        }),
      }));

      mockCommunityService.create.mockResolvedValue('new-community-id');

  // Ejecutamos la función
  const result = await service.approveRequest('1');

  // Validamos que communityService.create sea llamado con los datos correctos
  expect(mockCommunityService.create).toHaveBeenCalledWith({
    name: 'Approved Community',
    description: 'Description',
    admin: 1,
    causes: ['Cause1'],
  });

  // Validamos el resultado esperado
  expect(result).toBe('new-community-id');
    });

    it('should throw BadRequestException if request is already approved (Approve)', async () => {
      // Simulamos que la solicitud existe con estado 'Approved'
      const mockRequest = {
        _id: '12345',
        status: CommunityRequestStatus.Approved,
        name: 'Test Community',
        description: 'Test Description',
        creator: 'creator-id',
        causes: [],
      };

      // Configuramos el mock para que findById devuelva la solicitud aprobada
      requestModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockRequest),
      });

      // Llamamos a la función approveRequest y verificamos que lanza la excepción BadRequestException
      await expect(service.approveRequest('12345')).rejects.toThrowError(
        new BadRequestException('La solicitud no ha sido aprobada')
      );
    });

    it('should throw BadRequestException if request is already reject (Approve)', async () => {
      // Simulamos que la solicitud existe con estado 'Approved'
      const mockRequest = {
        _id: '12345',
        status: CommunityRequestStatus.Rejected,
        name: 'Test Community',
        description: 'Test Description',
        creator: 'creator-id',
        causes: [],
      };

      // Configuramos el mock para que findById devuelva la solicitud aprobada
      requestModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockRequest),
      });

      // Llamamos a la función approveRequest y verificamos que lanza la excepción BadRequestException
      await expect(service.approveRequest('12345')).rejects.toThrowError(
        new BadRequestException('La solicitud no ha sido aprobada')
      );
    });

  });

  describe('rejectRequest', () => {
    it('should throw NotFoundException if request does not exist', async () => {
      requestModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.rejectRequest('invalid-id')).rejects.toThrow(new NotFoundException('Solicitud no encontrada'));
    });

    it('should update request status to Rejected', async () => {
      requestModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'Approved Community',
          description: 'Description',
          creator: 1,
          causes: ['Cause1'],
          status: CommunityRequestStatus.Pending,
        }),
      }));
    
      // Configurar el mock para findByIdAndUpdate
      requestModel.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'Approved Community',
          description: 'Description',
          creator: 1,
          causes: ['Cause1'],
          status: CommunityRequestStatus.Rejected,
        }),
      }));
    
      // Ejecutar la función rejectRequest
      await service.rejectRequest('1');
    
      // Validar que findByIdAndUpdate haya sido llamado correctamente
      expect(requestModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { status: CommunityRequestStatus.Rejected },
        { new: true },
      );
    });

    it('should throw BadRequestException if request is already approved (Reject)', async () => {
      // Simulamos que la solicitud existe con estado 'Approved'
      const mockRequest = {
        _id: '12345',
        status: CommunityRequestStatus.Approved,
        name: 'Test Community',
        description: 'Test Description',
        creator: 'creator-id',
        causes: [],
      };

      // Configuramos el mock para que findById devuelva la solicitud aprobada
      requestModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockRequest),
      });

      // Llamamos a la función approveRequest y verificamos que lanza la excepción BadRequestException
      await expect(service.rejectRequest('12345')).rejects.toThrowError(
        new BadRequestException('La solicitud no ha sido rechazada')
      );
    });

    it('should throw BadRequestException if request is already reject (Reject)', async () => {
      // Simulamos que la solicitud existe con estado 'Approved'
      const mockRequest = {
        _id: '12345',
        status: CommunityRequestStatus.Rejected,
        name: 'Test Community',
        description: 'Test Description',
        creator: 'creator-id',
        causes: [],
      };

      // Configuramos el mock para que findById devuelva la solicitud aprobada
      requestModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockRequest),
      });

      // Llamamos a la función approveRequest y verificamos que lanza la excepción BadRequestException
      await expect(service.rejectRequest('12345')).rejects.toThrowError(
        new BadRequestException('La solicitud no ha sido rechazada')
      );
    });
  });
});
