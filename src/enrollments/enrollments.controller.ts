import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  ParseUUIDPipe, 
  HttpCode, 
  HttpStatus,
  UseGuards,
  Req
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorators/check-policies.decorator';
import { readEnrollmentPolicy, createEnrollmentPolicy, deleteEnrollmentPolicy } from './policies/enrollment-policies';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPolicies(createEnrollmentPolicy)
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto, @Req() req: any) {
    const studentId = req.user.id; // Get student ID from JWT token
    const result = await this.enrollmentsService.create(createEnrollmentDto.lecturerId, studentId);
    return { message: 'Enrollment created successfully', data: result };
  }

  @Get()
  @CheckPolicies(readEnrollmentPolicy)
  async findAll() {
    const result = await this.enrollmentsService.findAll();
    return { message: 'Enrollments retrieved successfully', data: result };
  }

  @Get('my')
  async findMyEnrollments(@Req() req: any) {
    const studentId = req.user.id; // Get student ID from JWT token
    const result = await this.enrollmentsService.findByStudentId(studentId);
    return { message: 'My enrollments retrieved successfully', data: result };
  }

  @Get(':id')
  @CheckPolicies(readEnrollmentPolicy)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.enrollmentsService.findOne(id);
    return { message: 'Enrollment retrieved successfully', data: result };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @CheckPolicies(deleteEnrollmentPolicy)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.enrollmentsService.remove(id);
    return { message: 'Enrollment deleted successfully' };
  }
}