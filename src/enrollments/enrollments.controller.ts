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
import { ReadEnrollmentPolicyHandler, CreateEnrollmentPolicyHandler, DeleteEnrollmentPolicyHandler } from './policies/enrollment-policies';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPolicies(new CreateEnrollmentPolicyHandler())
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @CheckPolicies(new ReadEnrollmentPolicyHandler())
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ReadEnrollmentPolicyHandler())
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPolicies(new DeleteEnrollmentPolicyHandler())
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentsService.remove(id);
  }
}