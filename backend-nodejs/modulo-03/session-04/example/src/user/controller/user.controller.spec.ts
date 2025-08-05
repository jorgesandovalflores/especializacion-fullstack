import { UserController } from './user.controller';

describe('UserController', () => {
    let controller: UserController;
    const mockService = {
        findByEmail: jest.fn(),
    };

    beforeEach(() => {
        controller = new UserController(mockService as any);
    });

    it('debe retornar error si el email ya está registrado', async () => {
        mockService.findByEmail.mockRejectedValue(new Error('Email ya registrado'));

        await expect(controller.findById('test@mail.com')).rejects.toThrow('Email ya registrado');
    });

    it('debe retornar null si el email no existe', async () => {
        mockService.findByEmail.mockResolvedValue(null);

        const result = await controller.findById('nuevo@mail.com');
        expect(result).toBe(null);
        expect(mockService.findByEmail).toHaveBeenCalledWith('nuevo@mail.com');
    });
});
