import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    const mockDao = {
        findByEmail: jest.fn(),
    };

    beforeEach(() => {
        service = new UserService(mockDao as any);
    });

    it('debe lanzar error si el email ya está registrado', async () => {
        mockDao.findByEmail.mockResolvedValue({ id: 1, email: 'existente@mail.com' });
        await expect(service.findByEmail('existente@mail.com')).rejects.toThrow('Email ya registrado');
    });

    it('debe retornar null si el email no existe', async () => {
        mockDao.findByEmail.mockResolvedValue(null);
        const result = await service.findByEmail('nuevo@mail.com');
        expect(result).toBe(null);
    });
});
