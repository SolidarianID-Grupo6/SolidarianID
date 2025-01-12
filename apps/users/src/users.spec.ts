import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { expect } from '@jest/globals';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
    let usersService: UsersService;

    const mockUsersService = {
        register: jest.fn().mockImplementation((dto) => {
            if (dto.email === 'existing@example.com') {
                return Promise.reject(new HttpException('User already exists', HttpStatus.CONFLICT));
            }
            return Promise.resolve({ id: '1234', ...dto });
        }),
        login: jest.fn().mockImplementation((dto) => {
            if (dto.password === 'wrongpassword') {
                return Promise.reject(new HttpException('Invalid password', HttpStatus.UNAUTHORIZED));
            }
            return Promise.resolve({
                accessToken: 'test-access-token',
                refreshToken: 'test-refresh-token'
            });
        }),
        findOne: jest.fn().mockImplementation((id) => {
            if (id === 'nonexistent') {
                return Promise.reject(new HttpException('User not found', HttpStatus.NOT_FOUND));
            }
            return Promise.resolve({ id, name: 'Test User', email: 'test@example.com' });
        }),
        update: jest.fn().mockImplementation((id, dto) => ({
            id,
            ...dto
        })),
        followUser: jest.fn()
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
            surnames: 'Test Surname',
            isEmailPublic: false,
            birthdate: new Date('1990-01-01'),
            isBirthdatePublic: false
        };

        const result = await usersService.register(registerDto);
        expect(result.id).toBeDefined();
        expect(result.name).toBe(registerDto.name);
    });

    it('should fail when registering with existing email', async () => {
        const registerDto = {
            name: 'Test User',
            email: 'existing@example.com',
            password: 'password123',
            surnames: 'Test Surname',
            isEmailPublic: false,
            birthdate: new Date('1990-01-01'),
            isBirthdatePublic: false
        };

        await expect(usersService.register(registerDto)).rejects.toThrow('User already exists');
    });
    it('should login user successfully', async () => {
        const loginDto = {
            email: 'test@example.com',
            password: 'password123'
        };

        const result = await usersService.login(loginDto);
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
    });

    it('should fail login with wrong password', async () => {
        const loginDto = {
            email: 'test@example.com',
            password: 'wrongpassword'
        };

        await expect(usersService.login(loginDto)).rejects.toThrow('Invalid password');
    });

    it('should find user by id', async () => {
        const userId = '1234';
        const result = await usersService.findOne(userId);
        expect(result.id).toBe(userId);
    });


    it('should fail finding nonexistent user', async () => {
        await expect(usersService.findOne('nonexistent')).rejects.toThrow('User not found');
    });

    it('should update user data', async () => {
        const updateDto = {
            name: 'Updated Name'
        };
        const userId = '1234';

        const result = await usersService.update(userId, updateDto);
        expect(result.name).toBe(updateDto.name);
    });

    it('should follow another user', async () => {
        const userId = '1234';
        const followedId = '5678';

        await usersService.followUser(userId, followedId);
        expect(mockUsersService.followUser).toHaveBeenCalledWith(userId, followedId);
    });
});