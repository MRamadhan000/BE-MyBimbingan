import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);

    mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      user: {
        id: '1',
        name: 'John Doe',
        role: Role.STUDENT,
      },
    };

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;

    // Mock the super.canActivate to return true by default
    jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
      .mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        {},
        {},
      ]);
    });

    it('should allow access when user has required role', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.STUDENT]);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has one of multiple required roles', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.STUDENT, Role.LECTURER]);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should deny access when user does not have required role', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.LECTURER]);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should deny access when JWT validation fails', async () => {
      // Mock super.canActivate to return false (JWT invalid)
      jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockResolvedValue(false);

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.STUDENT]);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle lecturer role access', async () => {
      // Change user role to lecturer
      mockRequest.user.role = Role.LECTURER;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.LECTURER]);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should deny lecturer access to student-only routes', async () => {
      // User is lecturer but route requires student role
      mockRequest.user.role = Role.LECTURER;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.STUDENT]);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle guest role properly', async () => {
      mockRequest.user.role = Role.GUEST;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.STUDENT, Role.LECTURER]);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle empty required roles array', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = await guard.canActivate(mockContext);

      // Empty array means specific roles were defined but none match, so should be false
      expect(result).toBe(false);
    });

    it('should call getAllAndOverride with correct parameters', async () => {
      const handler = {};
      const controller = {};
      
      mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: () => handler,
        getClass: () => controller,
      } as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.STUDENT]);

      await guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        handler,
        controller,
      ]);
    });
  });
});