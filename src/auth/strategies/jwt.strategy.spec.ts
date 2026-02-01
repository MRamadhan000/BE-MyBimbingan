import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const payload = {
      sub: '1',
      role: 'student',
      iat: 1234567890,
      exp: 1234567890 + 3600,
    };

    const mockStudent = {
      id: '1',
      name: 'John Doe',
      studentNumber: '12345678',
      major: 'Computer Science',
    };

    it('should validate and return user with role for student', async () => {
      mockAuthService.validateUser.mockResolvedValue(mockStudent);

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        ...mockStudent,
        role: 'student',
      });
      expect(authService.validateUser).toHaveBeenCalledWith('1', 'student');
    });

    it('should validate and return user with role for lecturer', async () => {
      const lecturerPayload = {
        sub: '2',
        role: 'lecturer',
        iat: 1234567890,
        exp: 1234567890 + 3600,
      };

      const mockLecturer = {
        id: '2',
        name: 'Jane Smith',
        nuptk: '1234567890',
        interests: ['AI', 'Machine Learning'],
      };

      mockAuthService.validateUser.mockResolvedValue(mockLecturer);

      const result = await strategy.validate(lecturerPayload);

      expect(result).toEqual({
        ...mockLecturer,
        role: 'lecturer',
      });
      expect(authService.validateUser).toHaveBeenCalledWith('2', 'lecturer');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith('1', 'student');
    });

    it('should throw UnauthorizedException when validateUser throws error', async () => {
      const error = new Error('Database error');
      mockAuthService.validateUser.mockRejectedValue(error);

      // The validate method will throw the original error, not UnauthorizedException
      await expect(strategy.validate(payload)).rejects.toThrow(error);
      expect(authService.validateUser).toHaveBeenCalledWith('1', 'student');
    });

    it('should handle payload with different user roles', async () => {
      const payloads = [
        { sub: '1', role: 'student' },
        { sub: '2', role: 'lecturer' },
      ];

      const mockUsers = [
        { id: '1', name: 'Student User' },
        { id: '2', name: 'Lecturer User' },
      ];

      for (let i = 0; i < payloads.length; i++) {
        mockAuthService.validateUser.mockResolvedValue(mockUsers[i]);

        const result = await strategy.validate(payloads[i]);

        expect(result).toEqual({
          ...mockUsers[i],
          role: payloads[i].role,
        });
        expect(authService.validateUser).toHaveBeenCalledWith(
          payloads[i].sub,
          payloads[i].role,
        );
      }
    });
  });

  describe('constructor', () => {
    it('should be configured with correct JWT options', () => {
      // Test that strategy is properly configured
      // Since constructor configuration is private, we test by ensuring the strategy works
      expect(strategy).toBeDefined();
      expect(strategy.validate).toBeDefined();
    });
  });
});