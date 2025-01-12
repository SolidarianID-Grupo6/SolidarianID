import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { expect } from '@jest/globals';

describe('UsersService', () => {
    let usersService: UsersService;

    const mockUsersService = {
        register: jest.fn().mockImplementation((dto) => {
            return {
                id: '1234',
                ...dto
            };
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService
                }
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
    });

    it('should register a new user', async () => {
        const registerDto = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            surnames: 'Test Surnames',
            isEmailPublic: false,
            birthdate: new Date('1990-01-01'),
            isBirthdatePublic: false
        };

        const result = await usersService.register(registerDto);

        expect(result).toEqual({
            id: '1234',
            ...registerDto
        });
    });
});
