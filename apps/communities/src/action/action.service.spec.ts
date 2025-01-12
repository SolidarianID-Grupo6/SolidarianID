import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { getModelToken } from '@nestjs/mongoose';
import { Action } from './schemas/action.schema';
import { Cause } from '../cause/schemas/cause.schema';
import { Types } from 'mongoose';
import { expect } from '@jest/globals';

describe('ActionService', () => {
    let service: ActionService;
    const validMongoId = new Types.ObjectId().toString();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActionService,
                {
                    provide: getModelToken(Action.name),
                    useValue: {
                        create: jest.fn().mockImplementation(dto => ({
                            ...dto,
                            _id: validMongoId,
                            save: () => Promise.resolve({ _id: validMongoId })
                        })),
                        findById: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue({
                                _id: validMongoId,
                                type: 'volunteer',
                                volunteers: [],
                                volunteerCurrentCount: 0,
                                volunteerGoalCount: 10,
                                cause: validMongoId
                            })
                        }),
                        findByIdAndUpdate: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue({
                                _id: validMongoId,
                                volunteerCurrentCount: 1,
                                progress: 10
                            })
                        }),
                        find: jest.fn(),
                        exec: jest.fn(),
                    }
                },
                {
                    provide: getModelToken(Cause.name),
                    useValue: {
                        findById: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue({
                                _id: validMongoId,
                                actions: [],
                                save: jest.fn().mockResolvedValue(true)
                            })
                        })
                    }
                },
                {
                    provide: 'NATS_SERVICE',
                    useValue: { emit: jest.fn() }
                }
            ]
        }).compile();

        service = module.get<ActionService>(ActionService);
    });

    describe('Service Methods', () => {
        it('finds all actions', async () => {
            const mockActions = [
                { _id: validMongoId, title: 'Action 1', type: 'food' },
                { _id: validMongoId, title: 'Action 2', type: 'money' }
            ];

            jest.spyOn(service['actionModel'], 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockActions)
            } as any);

            const result = await service.findAll();
            expect(result.length).toBe(2);
        });

        it('finds one action by id', async () => {
            const mockAction = {
                _id: validMongoId,
                title: 'Test Action',
                type: 'food'
            };

            jest.spyOn(service['actionModel'], 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockAction)
            } as any);

            const result = await service.findOne(validMongoId);
            expect(result.title).toBe('Test Action');
        });

        it('processes donations', async () => {
            const donateDto = { donation: 100 };
            const mockAction = {
                _id: validMongoId,
                type: 'money',
                moneyCurrentAmount: 0,
                moneyGoalAmount: 1000,
                cause: validMongoId
            };

            jest.spyOn(service['actionModel'], 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockAction)
            } as any);

            jest.spyOn(service['actionModel'], 'findByIdAndUpdate').mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    ...mockAction,
                    moneyCurrentAmount: 100
                })
            } as any);

            const result = await service.donate(validMongoId, donateDto, 'user123');
            expect(result.current).toBe(100);
        });

        it('registers volunteers', async () => {
            const mockAction = {
                _id: validMongoId,
                type: 'volunteer',
                volunteers: [],
                volunteerCurrentCount: 0,
                volunteerGoalCount: 10,
                cause: validMongoId
            };

            jest.spyOn(service['actionModel'], 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockAction)
            } as any);

            await service.volunteer(validMongoId, 'user123');
            expect(service['actionModel'].findByIdAndUpdate).toHaveBeenCalled();
        });
    });
});
