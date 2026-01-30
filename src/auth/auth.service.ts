import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentsService } from '../students/students.service';
import { LecturersService } from '../lecturers/lecturers.service';
import { CreateStudentDto } from '../students/dto/create-student.dto';
import { CreateLecturerDto } from '../lecturers/dto/create-lecturer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private studentsService: StudentsService,
    private lecturersService: LecturersService,
  ) {}

  async validateUser(id: string, role: string): Promise<any> {
    if (role === 'student') {
      return await this.studentsService.findOne(id);
    } else if (role === 'lecturer') {
      return await this.lecturersService.findOne(id);
    }
    return null;
  }

  async registerStudent(createStudentDto: CreateStudentDto) {
    this.logger.log(`Attempting to register student: ${createStudentDto.name} (${createStudentDto.studentNumber})`);
    try {
      const student = await this.studentsService.create(createStudentDto);
      this.logger.log(`Student registration successful: ID ${student.id}, Name ${student.name}`);
      return { message: 'Student registered successfully', student: { id: student.id, name: student.name } };
    } catch (error) {
      this.logger.error(`Student registration failed for ${createStudentDto.name}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async loginStudent(studentNumber: string, password: string) {
    this.logger.log(`Student login attempt: ${studentNumber}`);
    const user = await this.studentsService.findByStudentNumber(studentNumber);
    if (!user) {
      this.logger.warn(`Student login failed - user not found: ${studentNumber}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Student login failed - invalid password: ${studentNumber}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: 'student' };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Student login successful: ${user.name} (${studentNumber})`);
    return { accessToken, user: { id: user.id, name: user.name, role: 'student' } };
  }

  async registerLecturer(createLecturerDto: CreateLecturerDto) {
    this.logger.log(`Attempting to register lecturer: ${createLecturerDto.name} (${createLecturerDto.nuptk})`);
    try {
      const lecturer = await this.lecturersService.create(createLecturerDto);
      this.logger.log(`Lecturer registration successful: ID ${lecturer.id}, Name ${lecturer.name}`);
      return { message: 'Lecturer registered successfully', lecturer: { id: lecturer.id, name: lecturer.name } };
    } catch (error) {
      this.logger.error(`Lecturer registration failed for ${createLecturerDto.name}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async loginLecturer(nuptk: string, password: string) {
    this.logger.log(`Lecturer login attempt: ${nuptk}`);
    const user = await this.lecturersService.findByNuptk(nuptk);
    if (!user) {
      this.logger.warn(`Lecturer login failed - user not found: ${nuptk}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Lecturer login failed - invalid password: ${nuptk}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: 'lecturer' };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Lecturer login successful: ${user.name} (${nuptk})`);
    return { accessToken, user: { id: user.id, name: user.name, role: 'lecturer' } };
  }

  async getMe(user: any) {
    const { sub: id, role } = user;
    let fullUser;

    if (role === 'student') {
      fullUser = await this.studentsService.findOne(id);
    } else if (role === 'lecturer') {
      fullUser = await this.lecturersService.findOne(id);
    } else {
      throw new BadRequestException('Invalid role');
    }

    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    // Exclude password from response
    const { password, ...userWithoutPassword } = fullUser;
    return { ...userWithoutPassword, role };
  }

  createAuthCookie(accessToken: string) {
    return {
      accessToken,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 3600000, // 1 hour
      },
    };
  }
}