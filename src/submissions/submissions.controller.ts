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
  Req,
  UseInterceptors,
  UploadedFiles,
  Res
} from '@nestjs/common';
import type { Response } from 'express';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionStatus } from './entities/submission.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorators/check-policies.decorator';
import { readSubmissionPolicy, createSubmissionPolicy, reviewSubmissionPolicy } from './policies/submissions-policies';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('submissions')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // ==========================================
  // ENDPOINT MAHASISWA (Submission)
  // ==========================================

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }))
  @HttpCode(HttpStatus.CREATED)
  @CheckPolicies(createSubmissionPolicy)
  async create(
    @Body() createDto: CreateSubmissionDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any
  ) {
    const studentId = req.user.id; // Get student ID from JWT token
    const result = await this.submissionsService.create(createDto, studentId, files);
    return { message: 'Submission created successfully', data: result };
  }

  @Get()
  @CheckPolicies(readSubmissionPolicy)
  async findAll() {
    const result = await this.submissionsService.findAll();
    return { message: 'Submissions retrieved successfully', data: result };
  }

  @Get('enrollment/:enrollmentId')
  @CheckPolicies(readSubmissionPolicy)
  async findByEnrollment(
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
    @Req() req: any
  ) {
    const studentId = req.user.id; // Get student ID from JWT token
    
    // Service akan memvalidasi:
    // 1. Enrollment dengan ID tersebut harus ada
    // 2. Mahasiswa dalam enrollment harus sama dengan user yang login
    // 3. Ini memastikan mahasiswa hanya bisa akses submission dari enrollment miliknya
    const result = await this.submissionsService.findByEnrollment(enrollmentId, studentId);
    return { 
      message: 'My submissions for this enrollment retrieved successfully', 
      data: result 
    };
  }

  @Get(':id')
  @CheckPolicies(readSubmissionPolicy)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.submissionsService.findOne(id);
    return { message: 'Submission retrieved successfully', data: result };
  }

  // ==========================================
  // ENDPOINT DOSEN (Review & Feedback)
  // ==========================================

  @Post('feedbacks')
  @HttpCode(HttpStatus.CREATED)
  @CheckPolicies(reviewSubmissionPolicy)
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    // Gunakan ini untuk menambah komentar/diskusi di dalam submission
    const result = await this.submissionsService.createFeedback(createFeedbackDto);
    return { message: 'Feedback created successfully', data: result };
  }

  @Get(':id/feedbacks')
  @CheckPolicies(readSubmissionPolicy)
  async getFeedbacks(@Param('id', ParseUUIDPipe) id: string) {
    // Ambil semua riwayat chat berdasarkan ID submission
    const result = await this.submissionsService.findOne(id).then((sub) => sub.feedbacks);
    return { message: 'Feedbacks retrieved successfully', data: result };
  }

  @Patch(':id/review')
  @CheckPolicies(reviewSubmissionPolicy)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: SubmissionStatus,
    @Body('comment') comment: string,
  ) {
    // Dosen mengubah status dan memberi komentar dalam satu request
    const result = await this.submissionsService.updateStatusAndFeedback(id, status, comment);
    return { message: 'Submission status updated successfully', data: result };
  }

  // ==========================================
  // ENDPOINT ATTACHMENT & FILE
  // ==========================================

  @Get('attachments/:id/download')
  @CheckPolicies(readSubmissionPolicy)
  async downloadFile(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const attachment = await this.submissionsService.getAttachment(id);
    
    res.set({
      'Content-Type': attachment.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${attachment.fileName}"`,
    });
    
    res.send(attachment.fileData);
  }

  @Delete('attachments/:id')
  @HttpCode(HttpStatus.OK)
  @CheckPolicies(createSubmissionPolicy) // Assuming student can delete their own attachments
  async removeFile(@Param('id', ParseUUIDPipe) id: string) {
    await this.submissionsService.removeAttachment(id);
    return { message: 'Attachment removed successfully' };
  }
}
