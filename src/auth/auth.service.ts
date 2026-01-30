import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentsService } from '../students/students.service';
import { LecturersService } from '../lecturers/lecturers.service';
import { CreateStudentDto } from '../students/dto/create-student.dto';
import { CreateLecturerDto } from '../lecturers/dto/create-lecturer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
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
    const student = await this.studentsService.create(createStudentDto);
    return { message: 'Student registered successfully', student: { id: student.id, name: student.name } };
  }

  async loginStudent(studentNumber: string, password: string) {
    const user = await this.studentsService.findByStudentNumber(studentNumber);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: 'student' };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: { id: user.id, name: user.name, role: 'student' } };
  }

  async registerLecturer(createLecturerDto: CreateLecturerDto) {
    const lecturer = await this.lecturersService.create(createLecturerDto);
    return { message: 'Lecturer registered successfully', lecturer: { id: lecturer.id, name: lecturer.name } };
  }

  async loginLecturer(nuptk: string, password: string) {
    const user = await this.lecturersService.findByNuptk(nuptk);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: 'lecturer' };
    const accessToken = this.jwtService.sign(payload);

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