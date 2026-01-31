import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { LecturerRead, LecturerCreate, LecturerUpdate, LecturerDelete } from './policies/lecturer-policies.decorator';

@Controller('lecturers')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Get()
  @LecturerRead()
  async findAll() {
    const result = await this.lecturersService.findAll();
    return { message: 'Lecturers retrieved successfully', data: result };
  }

  @Get(':id')
  @LecturerRead()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.lecturersService.findOne(id);
    return { message: 'Lecturer retrieved successfully', data: result };
  }

  @Patch(':id')
  @LecturerUpdate()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLecturerDto: UpdateLecturerDto) {
    const result = await this.lecturersService.update(id, updateLecturerDto);
    return { message: 'Lecturer updated successfully', data: result };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @LecturerDelete()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.lecturersService.remove(id);
    return { message: 'Lecturer deleted successfully' };
  }
}
