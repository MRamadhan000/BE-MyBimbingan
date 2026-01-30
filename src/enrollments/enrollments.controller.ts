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
  UseGuards
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
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    const result = this.enrollmentsService.create(createEnrollmentDto);
    return { message: 'Enrollment created successfully', data: result };
  }

  @Get()
  @CheckPolicies(readEnrollmentPolicy)
  findAll() {
    const result = this.enrollmentsService.findAll();
    return { message: 'Enrollments retrieved successfully', data: result };
  }

  @Get(':id')
  @CheckPolicies(readEnrollmentPolicy)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = this.enrollmentsService.findOne(id);
    return { message: 'Enrollment retrieved successfully', data: result };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @CheckPolicies(deleteEnrollmentPolicy)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.enrollmentsService.remove(id);
    return { message: 'Enrollment deleted successfully' };
  }
}