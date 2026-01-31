import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { StudentRead } from './policies/student-policies.decorator';

@Controller('students')
// @UseGuards(JwtAuthGuard, PoliciesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  // @StudentRead()
  async findAll() {
    const result = await this.studentsService.findAll();
    return { message: 'Students retrieved successfully', data: result };
  }

  @Get(':id')
  @StudentRead()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.studentsService.findOne(id);
    return { message: 'Student retrieved successfully', data: result };
  }
}
