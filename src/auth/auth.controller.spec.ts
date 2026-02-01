import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CreateStudentDto } from '../students/dto/create-student.dto';
import { CreateLecturerDto } from '../lecturers/dto/create-lecturer.dto';
import { StudentLoginDto } from './dto/student-auth.dto';
import { LecturerLoginDto } from './dto/lecturer-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    registerStudent: jest.fn(),
    registerLecturer: jest.fn(),
    loginStudent: jest.fn(),
    loginLecturer: jest.fn(),
    getMe: jest.fn(),
    createAuthCookie: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  const mockRequest = {
    user: { sub: '1', role: 'student' },
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerStudent', () => {
    it('should register a student successfully', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'John Doe',
        studentNumber: '12345678',
        major: 'Computer Science',
        password: 'password123',
      };

      const mockResult = {
        message: 'Student registered successfully',
        student: { id: '1', name: 'John Doe' },
      };

      mockAuthService.registerStudent.mockResolvedValue(mockResult);

      const result = await controller.registerStudent(createStudentDto);

      expect(result).toEqual({
        message: mockResult.message,
        data: mockResult.student,
      });
      expect(authService.registerStudent).toHaveBeenCalledWith(createStudentDto);
    });

    it('should handle registration error', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'John Doe',
        studentNumber: '12345678',
        major: 'Computer Science',
        password: 'password123',
      };

      const error = new Error('Registration failed');
      mockAuthService.registerStudent.mockRejectedValue(error);

      await expect(controller.registerStudent(createStudentDto)).rejects.toThrow(error);
    });
  });

  describe('loginStudent', () => {
    it('should login a student successfully', async () => {
      const studentLoginDto: StudentLoginDto = {
        studentNumber: '12345678',
        password: 'password123',
      };

      const mockLoginResult = {
        accessToken: 'mock.jwt.token',
        user: { id: '1', name: 'John Doe', role: 'student' },
      };

      const mockCookieOptions = {
        cookieOptions: {
          httpOnly: true,
          secure: false,
          sameSite: 'strict' as const,
          maxAge: 3600000,
        },
      };

      mockAuthService.loginStudent.mockResolvedValue(mockLoginResult);
      mockAuthService.createAuthCookie.mockReturnValue(mockCookieOptions);

      const result = await controller.loginStudent(studentLoginDto, mockResponse);

      expect(result).toEqual({
        message: 'Login successful',
        data: mockLoginResult.user,
      });
      expect(authService.loginStudent).toHaveBeenCalledWith(
        studentLoginDto.studentNumber,
        studentLoginDto.password,
      );
      expect(authService.createAuthCookie).toHaveBeenCalledWith(mockLoginResult.accessToken);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockLoginResult.accessToken,
        mockCookieOptions.cookieOptions,
      );
    });

    it('should handle login error', async () => {
      const studentLoginDto: StudentLoginDto = {
        studentNumber: '12345678',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      mockAuthService.loginStudent.mockRejectedValue(error);

      await expect(controller.loginStudent(studentLoginDto, mockResponse)).rejects.toThrow(
        error,
      );
    });
  });

  describe('registerLecturer', () => {
    it('should register a lecturer successfully', async () => {
      const createLecturerDto: CreateLecturerDto = {
        name: 'Jane Smith',
        nuptk: '1234567890',
        interests: ['AI', 'Machine Learning'],
        password: 'password123',
      };

      const mockResult = {
        message: 'Lecturer registered successfully',
        lecturer: { id: '2', name: 'Jane Smith' },
      };

      mockAuthService.registerLecturer.mockResolvedValue(mockResult);

      const result = await controller.registerLecturer(createLecturerDto);

      expect(result).toEqual({
        message: mockResult.message,
        data: mockResult.lecturer,
      });
      expect(authService.registerLecturer).toHaveBeenCalledWith(createLecturerDto);
    });

    it('should handle registration error', async () => {
      const createLecturerDto: CreateLecturerDto = {
        name: 'Jane Smith',
        nuptk: '1234567890',
        interests: ['AI', 'Machine Learning'],
        password: 'password123',
      };

      const error = new Error('Registration failed');
      mockAuthService.registerLecturer.mockRejectedValue(error);

      await expect(controller.registerLecturer(createLecturerDto)).rejects.toThrow(error);
    });
  });

  describe('loginLecturer', () => {
    it('should login a lecturer successfully', async () => {
      const lecturerLoginDto: LecturerLoginDto = {
        nuptk: '1234567890',
        password: 'password123',
      };

      const mockLoginResult = {
        accessToken: 'mock.jwt.token',
        user: { id: '2', name: 'Jane Smith', role: 'lecturer' },
      };

      const mockCookieOptions = {
        cookieOptions: {
          httpOnly: true,
          secure: false,
          sameSite: 'strict' as const,
          maxAge: 3600000,
        },
      };

      mockAuthService.loginLecturer.mockResolvedValue(mockLoginResult);
      mockAuthService.createAuthCookie.mockReturnValue(mockCookieOptions);

      const result = await controller.loginLecturer(lecturerLoginDto, mockResponse);

      expect(result).toEqual({
        message: 'Login successful',
        data: mockLoginResult.user,
      });
      expect(authService.loginLecturer).toHaveBeenCalledWith(
        lecturerLoginDto.nuptk,
        lecturerLoginDto.password,
      );
      expect(authService.createAuthCookie).toHaveBeenCalledWith(mockLoginResult.accessToken);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockLoginResult.accessToken,
        mockCookieOptions.cookieOptions,
      );
    });

    it('should handle login error', async () => {
      const lecturerLoginDto: LecturerLoginDto = {
        nuptk: '1234567890',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      mockAuthService.loginLecturer.mockRejectedValue(error);

      await expect(controller.loginLecturer(lecturerLoginDto, mockResponse)).rejects.toThrow(
        error,
      );
    });
  });

  describe('getStudentMeE', () => {
    it('should return student data message', async () => {
      const result = await controller.getStudentMeE(mockRequest);

      expect(result).toEqual({
        message: 'Student data retrieved successfully',
      });
    });
  });

  describe('getStudentMe', () => {
    it('should get student profile successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        studentNumber: '12345678',
        major: 'Computer Science',
        role: 'student',
      };

      mockAuthService.getMe.mockResolvedValue(mockUser);

      const result = await controller.getStudentMe(mockRequest);

      expect(result).toEqual({
        message: 'Student data retrieved successfully',
        data: mockUser,
      });
      expect(authService.getMe).toHaveBeenCalledWith(mockRequest.user);
    });

    it('should handle error when getting student profile', async () => {
      const error = new Error('User not found');
      mockAuthService.getMe.mockRejectedValue(error);

      await expect(controller.getStudentMe(mockRequest)).rejects.toThrow(error);
    });
  });

  describe('getLecturerMe', () => {
    it('should get lecturer profile successfully', async () => {
      const mockRequest = {
        user: { sub: '2', role: 'lecturer' },
      } as unknown as Request;

      const mockUser = {
        id: '2',
        name: 'Jane Smith',
        nuptk: '1234567890',
        interests: ['AI', 'Machine Learning'],
        role: 'lecturer',
      };

      mockAuthService.getMe.mockResolvedValue(mockUser);

      const result = await controller.getLecturerMe(mockRequest);

      expect(result).toEqual({
        message: 'Lecturer data retrieved successfully',
        data: mockUser,
      });
      expect(authService.getMe).toHaveBeenCalledWith(mockRequest.user);
    });

    it('should handle error when getting lecturer profile', async () => {
      const mockRequest = {
        user: { sub: '2', role: 'lecturer' },
      } as unknown as Request;

      const error = new Error('User not found');
      mockAuthService.getMe.mockRejectedValue(error);

      await expect(controller.getLecturerMe(mockRequest)).rejects.toThrow(error);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await controller.logout(mockResponse);

      expect(result).toEqual({
        message: 'Logout successful',
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token');
    });
  });
});