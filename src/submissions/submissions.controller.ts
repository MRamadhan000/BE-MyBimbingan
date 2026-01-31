import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionStatus } from './entities/submission.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorators/check-policies.decorator';
import { readSubmissionPolicy, createSubmissionPolicy, reviewSubmissionPolicy } from './policies/submissions-policies';

@Controller('submissions')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // ==========================================
  // ENDPOINT MAHASISWA (Submission)
  // ==========================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPolicies(createSubmissionPolicy)
  create(@Body() createDto: CreateSubmissionDto, @Req() req: any) {
    const studentId = req.user.id; // Get student ID from JWT token
    return this.submissionsService.create(createDto, studentId);
  }

  @Get()
  @CheckPolicies(readSubmissionPolicy)
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  @CheckPolicies(readSubmissionPolicy)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.submissionsService.findOne(id);
  }

  // ==========================================
  // ENDPOINT DOSEN (Review & Feedback)
  // ==========================================

  @Post('feedbacks')
  @HttpCode(HttpStatus.CREATED)
  @CheckPolicies(reviewSubmissionPolicy)
  createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    // Gunakan ini untuk menambah komentar/diskusi di dalam submission
    return this.submissionsService.createFeedback(createFeedbackDto);
  }

  @Get(':id/feedbacks')
  @CheckPolicies(readSubmissionPolicy)
  getFeedbacks(@Param('id', ParseUUIDPipe) id: string) {
    // Ambil semua riwayat chat berdasarkan ID submission
    return this.submissionsService.findOne(id).then((sub) => sub.feedbacks);
  }

  @Patch(':id/review')
  @CheckPolicies(reviewSubmissionPolicy)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: SubmissionStatus,
    @Body('comment') comment: string,
  ) {
    // Dosen mengubah status dan memberi komentar dalam satu request
    return this.submissionsService.updateStatusAndFeedback(id, status, comment);
  }

  // ==========================================
  // ENDPOINT ATTACHMENT & FILE
  // ==========================================

  @Delete('attachments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPolicies(createSubmissionPolicy) // Assuming student can delete their own attachments
  removeFile(@Param('id', ParseUUIDPipe) id: string) {
    return this.submissionsService.removeAttachment(id);
  }
}
