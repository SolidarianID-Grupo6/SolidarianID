import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { getModelToken } from '@nestjs/mongoose';
import { Action } from './schemas/action.schema';
import { Cause } from '../cause/schemas/cause.schema';
import { Types } from 'mongoose';
import { expect } from '@jest/globals';

describe('ActionService - Pruebas Metamórficas', () => {
    let service: ActionService;
    const validMongoId = new Types.ObjectId().toString();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActionService,
                {
                    provide: getModelToken(Action.name),
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        find: jest.fn(),
                        exec: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(Cause.name),
                    useValue: {
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: 'NATS_SERVICE',
                    useValue: {
                        emit: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ActionService>(ActionService);
    });

    describe('Pruebas Metamórficas', () => {
        it('Donar dos veces incrementa la cantidad proporcionalmente', async () => {
            const actionId = validMongoId;
            const donation1 = 50;
            const donation2 = 70;

            const initialAction = {
                _id: actionId,
                type: 'money',
                moneyCurrentAmount: 0,
                moneyGoalAmount: 1000,
                donors: [],
                cause: validMongoId,
            };

            jest.spyOn(service['actionModel'], 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(initialAction),
            } as any);

            jest.spyOn(service['actionModel'], 'findByIdAndUpdate').mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    ...initialAction,
                    moneyCurrentAmount: donation1,
                    donors: [{ userId: 'user1', amount: donation1 }],
                }),
            } as any);

            await service.donate(actionId, { donation: donation1 }, 'user1');

            const intermediateAction = {
                ...initialAction,
                moneyCurrentAmount: donation1,
            };

            jest.spyOn(service['actionModel'], 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(intermediateAction),
            } as any);

            jest.spyOn(service['actionModel'], 'findByIdAndUpdate').mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    ...initialAction,
                    moneyCurrentAmount: donation1 + donation2,
                    donors: [
                        { userId: 'user1', amount: donation1 },
                        { userId: 'user2', amount: donation2 },
                    ],
                }),
            } as any);

            const result = await service.donate(actionId, { donation: donation2 }, 'user2');
            expect(result.current).toBe(donation1 + donation2);
        });

        it('Añadir voluntarios incrementa progresivamente el conteo', async () => {
            const actionId = validMongoId;

            const initialAction = {
                _id: actionId,
                type: 'volunteer',
                volunteerCurrentCount: 0,
                volunteerGoalCount: 5,
                volunteers: [],
                cause: validMongoId,
            };

            jest.spyOn(service['actionModel'], 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(initialAction),
            } as any);

            jest.spyOn(service['actionModel'], 'findByIdAndUpdate').mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    ...initialAction,
                    volunteerCurrentCount: 1,
                    volunteers: ['user1'],
                }),
            } as any);

            await service.volunteer(actionId, 'user1');

            const intermediateAction = {
                ...initialAction,
                volunteerCurrentCount: 1,
            };

            jest.spyOn(service['actionModel'], 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(intermediateAction),
            } as any);

            jest.spyOn(service['actionModel'], 'findByIdAndUpdate').mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    ...intermediateAction,
                    volunteerCurrentCount: 2,
                    volunteers: ['user1', 'user2'],
                }),
            } as any);

            await service.volunteer(actionId, 'user2');
            expect(service['actionModel'].findByIdAndUpdate).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    volunteerCurrentCount: 2,
                }),
                expect.anything(),
            );
        });

        it('Progreso calculado debe ser proporcional a las donaciones de comida', async () => {
            const actionId = validMongoId;
            const foodGoal = 200;

            const initialAction = {
                _id: actionId,
                type: 'food',
                foodCurrentQuantity: 0,
                foodGoalQuantity: foodGoal,
                donors: [],
                cause: validMongoId,
            };

            jest.spyOn(service['actionModel'], 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(initialAction),
            } as any);

            jest.spyOn(service['actionModel'], 'findByIdAndUpdate').mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    ...initialAction,
                    foodCurrentQuantity: 100,
                    progress: 50, // Progreso calculado correctamente
                }),
            } as any);

            const result = await service.donate(actionId, { donation: 100 }, 'user1');
            expect(result.progress).toBe(50);
        });
    });
});
