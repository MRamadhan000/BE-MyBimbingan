import { Controller, Post, Body, Res, UseGuards, Get, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateStudentDto } from '../students/dto/create-student.dto';
import { CreateLecturerDto } from '../lecturers/dto/create-lecturer.dto';
import { StudentLoginDto } from './dto/student-auth.dto';
import { LecturerLoginDto } from './dto/lecturer-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('student/register')
  async registerStudent(@Body() createStudentDto: CreateStudentDto) {
    const result = await this.authService.registerStudent(createStudentDto);
    return { message: result.message, data: result.student };
  }

  @Post('student/login')
  async loginStudent(@Body() studentLoginDto: StudentLoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = await this.authService.loginStudent(studentLoginDto.studentNumber, studentLoginDto.password);
    const { cookieOptions } = this.authService.createAuthCookie(accessToken);
    res.cookie('access_token', accessToken, cookieOptions);
    return { message: 'Login successful', data: user };
  }

  @Post('lecturer/register')
  async registerLecturer(@Body() createLecturerDto: CreateLecturerDto) {
    const result = await this.authService.registerLecturer(createLecturerDto);
    return { message: result.message, data: result.lecturer };
  }

  @Post('lecturer/login')
  async loginLecturer(@Body() lecturerLoginDto: LecturerLoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = await this.authService.loginLecturer(lecturerLoginDto.nuptk, lecturerLoginDto.password);
    const { cookieOptions } = this.authService.createAuthCookie(accessToken);
    res.cookie('access_token', accessToken, cookieOptions);
    return { message: 'Login successful', data: user };
  }

  @Get('student/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  async getStudentMe(@Req() req: Request) {
    const user = await this.authService.getMe(req.user);
    return { message: 'Student data retrieved successfully', data: user };
  }

  @Get('lecturer/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LECTURER)
  async getLecturerMe(@Req() req: Request) {
    const user = await this.authService.getMe(req.user);
    return { message: 'Lecturer data retrieved successfully', data: user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT, Role.LECTURER)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout successful' };
  }
}