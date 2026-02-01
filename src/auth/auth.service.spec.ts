import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StudentsService } from '../students/students.service';
import { LecturersService } from '../lecturers/lecturers.service';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Mock console to suppress error logs during testing
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let studentsService: StudentsService;
  let lecturersService: LecturersService;

  // Mock data
  const mockStudent = {
    id: '1',
    name: 'John Doe',
    studentNumber: '12345678',
    major: 'Computer Science',
    password: 'hashedpassword',
    image: 'profile.jpg',
    createdAt: new Date(),
    hashPassword: jest.fn(),
  };

  const mockLecturer = {
    id: '2',
    name: 'Jane Smith',
    nuptk: '1234567890',
    interests: ['AI', 'Machine Learning'],
    password: 'hashedpassword',
    image: 'lecturer-profile.jpg',
    createdAt: new Date(),
    hashPassword: jest.fn(),
  };

  const mockJwtPayload = { sub: '1', role: 'student' };
  const mockAccessToken = 'mock.jwt.token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockAccessToken),
          },
        },
        {
          provide: StudentsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findByStudentNumber: jest.fn(),
          },
        },
        {
          provide: LecturersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findByNuptk: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    studentsService = module.get<StudentsService>(StudentsService);
    lecturersService = module.get<LecturersService>(LecturersService);
    
    // Mock logger to prevent console output
    (service as any).logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate student user', async () => {
      jest.spyOn(studentsService, 'findOne').mockResolvedValue(mockStudent);

      const result = await service.validateUser('1', 'student');

      expect(result).toEqual(mockStudent);
      expect(studentsService.findOne).toHaveBeenCalledWith('1');
    });

    it('should validate lecturer user', async () => {
      jest.spyOn(lecturersService, 'findOne').mockResolvedValue(mockLecturer);

      const result = await service.validateUser('2', 'lecturer');

      expect(result).toEqual(mockLecturer);
      expect(lecturersService.findOne).toHaveBeenCalledWith('2');
    });

    it('should return null for invalid role', async () => {
      const result = await service.validateUser('1', 'invalid');

      expect(result).toBeNull();
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(studentsService, 'findOne').mockRejectedValue(error);

      await expect(service.validateUser('1', 'student')).rejects.toThrow(error);
    });
  });

  describe('registerStudent', () => {
    const createStudentDto = {
      name: 'John Doe',
      studentNumber: '12345678',
      major: 'Computer Science',
      password: 'password123',
    };

    it('should register student successfully', async () => {
      jest.spyOn(studentsService, 'create').mockResolvedValue(mockStudent);

      const result = await service.registerStudent(createStudentDto);

      expect(result).toEqual({
        message: 'Student registered successfully',
        student: { id: mockStudent.id, name: mockStudent.name },
      });
      expect(studentsService.create).toHaveBeenCalledWith(createStudentDto);
    });

    it('should throw error when registration fails', async () => {
      const error = new Error('Registration failed');
      jest.spyOn(studentsService, 'create').mockRejectedValue(error);

      await expect(service.registerStudent(createStudentDto)).rejects.toThrow(error);
    });
  });

  describe('loginStudent', () => {
    const studentNumber = '12345678';
    const password = 'password123';

    it('should login student successfully', async () => {
      jest.spyOn(studentsService, 'findByStudentNumber').mockResolvedValue(mockStudent);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginStudent(studentNumber, password);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        user: { id: mockStudent.id, name: mockStudent.name, role: 'student' },
      });
      expect(studentsService.findByStudentNumber).toHaveBeenCalledWith(studentNumber);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockStudent.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockStudent.id, role: 'student' });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(studentsService, 'findByStudentNumber').mockResolvedValue(null as any);

      await expect(service.loginStudent(studentNumber, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      jest.spyOn(studentsService, 'findByStudentNumber').mockResolvedValue(mockStudent);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.loginStudent(studentNumber, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(studentsService, 'findByStudentNumber').mockRejectedValue(error);

      await expect(service.loginStudent(studentNumber, password)).rejects.toThrow(error);
    });
  });

  describe('registerLecturer', () => {
    const createLecturerDto = {
      name: 'Jane Smith',
      nuptk: '1234567890',
      interests: ['AI', 'Machine Learning'],
      password: 'password123',
    };

    it('should register lecturer successfully', async () => {
      jest.spyOn(lecturersService, 'create').mockResolvedValue(mockLecturer);

      const result = await service.registerLecturer(createLecturerDto);

      expect(result).toEqual({
        message: 'Lecturer registered successfully',
        lecturer: { id: mockLecturer.id, name: mockLecturer.name },
      });
      expect(lecturersService.create).toHaveBeenCalledWith(createLecturerDto);
    });

    it('should throw error when registration fails', async () => {
      const error = new Error('Registration failed');
      jest.spyOn(lecturersService, 'create').mockRejectedValue(error);

      await expect(service.registerLecturer(createLecturerDto)).rejects.toThrow(error);
    });
  });

  describe('loginLecturer', () => {
    const nuptk = '1234567890';
    const password = 'password123';

    it('should login lecturer successfully', async () => {
      jest.spyOn(lecturersService, 'findByNuptk').mockResolvedValue(mockLecturer);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginLecturer(nuptk, password);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        user: { id: mockLecturer.id, name: mockLecturer.name, role: 'lecturer' },
      });
      expect(lecturersService.findByNuptk).toHaveBeenCalledWith(nuptk);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockLecturer.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockLecturer.id, role: 'lecturer' });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(lecturersService, 'findByNuptk').mockResolvedValue(null as any);

      await expect(service.loginLecturer(nuptk, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      jest.spyOn(lecturersService, 'findByNuptk').mockResolvedValue(mockLecturer);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.loginLecturer(nuptk, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(lecturersService, 'findByNuptk').mockRejectedValue(error);

      await expect(service.loginLecturer(nuptk, password)).rejects.toThrow(error);
    });
  });

  describe('getMe', () => {
    it('should get student user info', async () => {
      const user = { sub: '1', role: 'student' };
      jest.spyOn(studentsService, 'findOne').mockResolvedValue(mockStudent);

      const result = await service.getMe(user);

      expect(result).toEqual({
        id: mockStudent.id,
        name: mockStudent.name,
        studentNumber: mockStudent.studentNumber,
        major: mockStudent.major,
        image: mockStudent.image,
        createdAt: mockStudent.createdAt,
        role: 'student',
        hashPassword: expect.any(Function),
      });
      expect(studentsService.findOne).toHaveBeenCalledWith('1');
    });

    it('should get lecturer user info', async () => {
      const user = { sub: '2', role: 'lecturer' };
      jest.spyOn(lecturersService, 'findOne').mockResolvedValue(mockLecturer);

      const result = await service.getMe(user);

      expect(result).toEqual({
        id: mockLecturer.id,
        name: mockLecturer.name,
        nuptk: mockLecturer.nuptk,
        interests: mockLecturer.interests,
        image: mockLecturer.image,
        createdAt: mockLecturer.createdAt,
        role: 'lecturer',
        hashPassword: expect.any(Function),
      });
      expect(lecturersService.findOne).toHaveBeenCalledWith('2');
    });

    it('should throw BadRequestException for invalid role', async () => {
      const user = { sub: '1', role: 'invalid' };

      await expect(service.getMe(user)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const user = { sub: '1', role: 'student' };
      jest.spyOn(studentsService, 'findOne').mockResolvedValue(null as any);

      await expect(service.getMe(user)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error when service fails', async () => {
      const user = { sub: '1', role: 'student' };
      const error = new Error('Database error');
      jest.spyOn(studentsService, 'findOne').mockRejectedValue(error);

      await expect(service.getMe(user)).rejects.toThrow(error);
    });
  });

  describe('createAuthCookie', () => {
    it('should create auth cookie with correct options', () => {
      const accessToken = 'test.token';

      const result = service.createAuthCookie(accessToken);

      expect(result).toEqual({
        accessToken: 'test.token',
        cookieOptions: {
          httpOnly: true,
          secure: false, // NODE_ENV is not 'production' in test
          sameSite: 'strict',
          maxAge: 3600000,
        },
      });
    });

    it('should create secure cookie in production', () => {
      process.env.NODE_ENV = 'production';
      const accessToken = 'test.token';

      const result = service.createAuthCookie(accessToken);

      expect(result.cookieOptions.secure).toBe(true);

      // Clean up
      delete process.env.NODE_ENV;
    });
  });
});